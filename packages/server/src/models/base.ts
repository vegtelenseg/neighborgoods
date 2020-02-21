/* eslint-disable @typescript-eslint/camelcase */
import {
  Model,
  Constructor,
  Transaction,
  QueryBuilder,
  QueryContext,
} from 'objection';
import Knex from 'knex';
import {Span} from 'opentracing';
import {knex} from '../db';
import Context from '../context';

Model.knex(knex);

export interface AuditMixin {
  readonly createdAt: Date;
  updatedAt?: Date;
  createdBy: number;
  updatedBy?: number;
}

export enum PointInTimeState {
  active = 'ACTIVE',
  inactive = 'INACTIVE',
  corrected = 'CORRECTED',
}

const suppressLogs =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production';
export class BaseModel<TContext extends Context> extends Model
  implements AuditMixin {
  public readonly id!: number;
  public createdAt!: Date;
  public updatedAt!: Date | undefined;
  public createdBy!: number;
  public updatedBy!: number | undefined;

  public static get concurrency() {
    return 1;
  }

  public static query<CB extends Model>(
    this: Constructor<CB>,
    trxOrKnex?: Transaction | Knex
  ): QueryBuilder<CB> {
    const query = super.query(trxOrKnex);

    let span: Span | null = null;

    // https://github.com/Vincit/objection.js/issues/807#issuecomment-366734514
    // Tracing Events
    query.onBuildKnex((knexQueryBuilder) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      knexQueryBuilder.on('query', (queryData: any) => {
        const {
          // Parent span can be null during migrations or seeds
          span: parentSpan,
          user,
          startSpan,
        } = query.context();

        if (parentSpan == null && !suppressLogs) {
          // tslint:disable-next-line no-console
          console.warn(
            `Missing Parent Span in models/base. Query: ${queryData.sql}.`
          );
        }

        if (user == null && !suppressLogs) {
          // tslint:disable-next-line no-console
          console.warn(`Missing User in models/base. Query: ${queryData.sql}.`);
        }

        span = startSpan('knex query', {
          childOf: parentSpan,
          tags: {
            method: queryData.method,
            sql: queryData.sql,
            user: user ? user.id : null,
          },
        });
      });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      knexQueryBuilder.on('query-error', (error: Error) => {
        if (span != null) {
          span.setTag('error', true);

          span.log({
            event: 'error',
            message: error.message,
            stack: error.stack,
          });

          span.finish();
        }
      });

      knexQueryBuilder.on(
        'query-response',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (response: any) => {
          if (span != null) {
            span.log({
              event: 'completed',
              data: JSON.stringify(response),
            });
            span.finish();
          }
        }
      );
    });

    // @ts-ignore
    return query;
  }

  /**
   * Default tableName is class name with first character lowercased
   */
  public static get tableName(): string {
    return this.name.slice(0, 1).toLocaleLowerCase() + this.name.slice(1);
  }

  public $beforeInsert(queryContext: QueryContext) {
    // Allow created at to be set by user
    if (!this.createdAt) {
      this.createdAt = new Date();
    }

    if (!queryContext.user) {
      throw new Error(
        `$beforeInsert: User missing from context ${queryContext}.`
      );
    }

    this.createdBy = queryContext.user.id;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public $beforeUpdate(_opt: any, queryContext: QueryContext) {
    this.updatedAt = new Date();

    if (!queryContext.user) {
      throw new Error(
        `$beforeUpdate: User missing from context: ${queryContext}.`
      );
    }

    this.updatedBy = queryContext.user.id;
  }

  /**
   * Convenience method to find the single active record (Record with state.active)
   */
  protected getActiveRecord<T extends PointInTimeModel<TContext>>(
    records: Array<Partial<T>> | undefined,
    name: string
  ): T {
    if (records) {
      const activeRecord = records.find(
        (r) => r.state === PointInTimeState.active
      );

      if (activeRecord) {
        return activeRecord as T;
      }
    }

    throw new Error(
      `Active ${name} not found for ${this.constructor.name}: ${this.id}.`
    );
  }

  //allows returning undefined compared to method above.
  //there are cases where presence of an active record is perfectly valid
  protected getActiveRecordIfPresent<T extends PointInTimeModel<TContext>>(
    records: Array<Partial<T>> | undefined
  ): T | undefined {
    if (records) {
      const activeRecord = records.find(
        (r) => r.state === PointInTimeState.active
      );

      if (activeRecord) {
        return activeRecord as T;
      }
    }
    return undefined;
  }
}

export abstract class PointInTimeModel<
  TContext extends Context
> extends BaseModel<TContext> {
  public durationStart!: Date;
  public durationEnd?: Date;
  public state?: PointInTimeState;

  static get modifiers() {
    return {
      // Modifier for including current active records, most often what we are interested in
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      active: (builder: QueryBuilder<PointInTimeModel<any>>) =>
        builder.where('state', '=', PointInTimeState.active),
    };
  }

  public get isActive() {
    return this.state === PointInTimeState.active;
  }

  public async deactivate(context: TContext, trx: Transaction, endDate: Date) {
    if (this.state !== PointInTimeState.active) {
      throw new Error(
        `${this.constructor.name}:${this.id} is already deactivated.`
      );
    }

    if (endDate <= this.durationStart) {
      throw new Error(
        `End Date: ${endDate.toISOString()} is not after Start Date: ${
          this.durationStart
        }.`
      );
    }

    this.durationEnd = endDate;
    this.state = PointInTimeState.inactive;

    return (
      this.$query(trx)
        .context(context)
        // @ts-ignore
        .patchAndFetch({
          durationEnd: this.durationEnd,
          state: PointInTimeState.inactive,
        })
    );
  }
}

export class AggregateRoot<
  TContext extends Context,
  T extends PointInTimeModel<TContext> = PointInTimeModel<TContext>
> extends BaseModel<TContext> {
  public statuses!: Array<Partial<T>>;

  public get activeStatus(): T {
    return this.getActiveRecord(this.statuses, 'Status');
  }

  public get isActive() {
    if (!this.statuses) {
      throw new Error('Status is not loaded');
    }

    if (this.statuses.length === 0) {
      throw new Error('No Status found');
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.statuses.find((status) => status.isActive!) != null;
  }

  public assertIsActive() {
    if (!this.isActive) {
      throw new Error(`${this.constructor.name} ${this.id} is not active`);
    }
  }

  public get identifier() {
    return `${this.constructor.name}:${this.id}`;
  }

  public async deactivate(context: TContext, trx: Transaction, endDate: Date) {
    const status = this.activeStatus;
    return status.deactivate(context, trx, endDate);
  }

  public async activate(context: TContext, trx: Transaction, startDate: Date) {
    const active = !!this.statuses.find(
      (s) => s.state === PointInTimeState.active
    );

    if (active) {
      throw new Error(`${this.identifier} is already activated`);
    }

    await this.$relatedQuery('statuses', trx)
      .context(context)
      .insert({
        // @ts-ignore
        duration_start: startDate,
        duration_end: undefined,
        state: PointInTimeState.active,
      });
  }
}
