import {Model} from 'objection';
import {AggregateRoot, PointInTimeModel} from './base';
import Context from '../context';
import {ProductAvailabilityType} from '../types';
import {Product} from './product';

export class UserStatus extends PointInTimeModel<Context> {
  userId!: number;
}

export class UserProduct extends PointInTimeModel<Context> {
  public readonly id!: number;
  public userId!: number;
  public productId!: number;
  public product!: ProductAvailabilityType;

  public static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'userProduct.userId',
          to: 'users.id',
        },
      },
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'userProduct.productId',
          to: 'product.id',
        },
      },
    };
  }
}
export class UserProfile extends PointInTimeModel<Context> {
  public readonly id!: number;
  public userId!: number;
  public unitNumber!: number;
  public email!: string;
  public profileName!: string;
  public cellphoneNumber!: string;
}
export class User extends AggregateRoot<Context> {
  public readonly id!: number;
  public username!: string;
  public password!: string;
  public statuses!: Partial<UserStatus>[];
  public userProducts!: Partial<UserProduct>[];
  public profile!: Partial<UserProfile>[];

  public static get tableName() {
    return 'users';
  }

  public static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: {type: 'integer'},
      },
    };
  }

  public get activeProfile(): UserProfile {
    return this.getActiveRecord(this.profile, 'Profile');
  }

  // @ts-ignore
  public async deactivate(context: Context, trx: Transaction, endDate: Date) {
    await super.deactivate(context, trx, endDate);

    // De-activate the profile so the email can become available again
    await this.activeProfile.deactivate(context, trx, endDate);
  }

  public static get relationMappings() {
    return {
      profile: {
        relation: Model.HasManyRelation,
        modelClass: UserProfile,
        join: {
          from: 'users.id',
          to: 'userProfile.userId',
        },
      },
      userProducts: {
        relation: Model.HasManyRelation,
        modelClass: UserProduct,
        join: {
          from: 'users.id',
          to: 'userProduct.userId',
        },
      },
      statuses: {
        relation: Model.HasManyRelation,
        modelClass: UserStatus,
        join: {
          from: 'users.id',
          to: 'userStatus.userId',
        },
      },
    };
  }
}
