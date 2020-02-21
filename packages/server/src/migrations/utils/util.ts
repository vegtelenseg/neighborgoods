import {TableBuilder, default as Knex} from 'knex';

export function auditing(knex: Knex, table: TableBuilder) {
  table
    .integer('created_by')
    .unsigned()
    // .index()
    .notNullable();
  table
    .integer('updated_by')
    .unsigned()
    .index();
  table
    .timestamp('created_at')
    .defaultTo(knex.fn.now())
    // .index()
    .notNullable();
  table
    .timestamp('updated_at')
    .nullable()
    .index();
}

//only index ACTIVE entries, and add duration overlap constraint
//i.e no two user entries with same   id can be active over the same period
//user_idA.duration && user_idB.duration
//https://www.postgresql.org/docs/current/functions-geometry.html
//The parent key can be either a single key or a composite list of keys
export async function durationConstraint(
  knex: Knex,
  tableName: string,
  parentKey: string | string[]
) {
  if (typeof parentKey === 'string') {
    await knex.schema.raw(`
      CREATE UNIQUE index ${tableName}_duration_single_active
      on ${tableName} (${parentKey}, state)
      where state = 'ACTIVE'
    `);

    await knex.schema.raw(`
      ALTER TABLE ${tableName}
      ADD CONSTRAINT ${tableName}_duration_overlap
      EXCLUDE USING gist (${parentKey} WITH =, duration WITH &&)
    `);
  } else {
    await knex.schema
      .raw(`CREATE UNIQUE index ${tableName}_duration_single_active
      on ${tableName} (${parentKey.join(', ')}, state)
      where state = 'ACTIVE'`);

    await knex.schema.raw(`
      ALTER TABLE ${tableName}
      ADD CONSTRAINT ${tableName}_duration_overlap
      EXCLUDE USING gist (${parentKey
        .map((key) => {
          return key + ' WITH =';
        })
        .join(',')}, duration WITH &&)`);
  }
}

export function masterData(_knex: Knex, table: TableBuilder) {
  // @ts-ignore
  table.dateTime('duration_start').notNullable();

  table.dateTime('duration_end').nullable();
  // @ts-ignore - https://github.com/tgriesser/knex/issues/2886
  table.string('state').notNullable();
}
