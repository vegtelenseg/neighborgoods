import {default as Knex, TableBuilder} from 'knex';
import {auditing, masterData} from './utils/util';

export async function up(knex: Knex) {
  await knex.schema.createTable('users', (table: TableBuilder) => {
    table
      .increments()
      .unsigned()
      .index()
      .primary();
    table.string('username', 50).notNullable();
    table.string('password').notNullable();
    auditing(knex, table);
  });
  await knex.schema.createTable('user_status', (table: TableBuilder) => {
    table.increments().primary();
    table
      .integer('user_id')
      .unsigned()
      .index()
      .references('users.id')
      .onDelete('CASCADE')
      .notNullable();

    auditing(knex, table);
    masterData(knex, table);
  });
  await knex.schema.createTable('user_profile', (table: TableBuilder) => {
    table.increments().primary();
    table
      .integer('user_id')
      .unsigned()
      .references('users.id')
      .onDelete('CASCADE')
      .notNullable();
    table
      .integer('unit_number')
      .unsigned()
      .index()
      .notNullable();
    table.string('email', 100);
    table.string('profile_name', 50);
    table.string('cell_phone_number', 100);
    auditing(knex, table);
    masterData(knex, table);
  });
  await knex.schema.createTable('product', (table: TableBuilder) => {
    table
      .increments()
      .unsigned()
      .primary();
    table
      .string('name', 50)
      .notNullable()
      .index();
    auditing(knex, table);
  });
  await knex.schema.createTable('user_product', (table: TableBuilder) => {
    table
      .increments()
      .unsigned()
      .primary();
    table
      .integer('user_id')
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE');
    table
      .integer('product_id')
      .notNullable()
      .references('product.id')
      .onDelete('CASCADE');
    auditing(knex, table);
  });
  await knex.schema.createTable(
    'user_product_availability',
    (table: TableBuilder) => {
      table
        .increments()
        .unsigned()
        .primary();
      table
        .boolean('sold')
        .notNullable()
        .defaultTo(false);
      table
        .integer('user_product_id')
        .notNullable()
        .references('user_product.id')
        .onDelete('CASCADE');
      auditing(knex, table);
    }
  );
  await knex.schema.createTable('product_schedule', (table: TableBuilder) => {
    table
      .increments()
      .unsigned()
      .primary()
      .index();
    table
      .integer('product_id')
      .notNullable()
      .references('product.id')
      .onDelete('CASCADE');
    table.time('scheduled_at');
  });
  await knex.schema.alterTable('users', (table) => {
    table
      .string('created_by')
      .nullable()
      .alter();
  });
  // add systemUser
  const [systemUser] = await knex('users')
    .insert({
      username: 'system',
      password: 'password',
    })
    .returning('*');

  // systemUser creates itself
  await knex('users')
    .where('id', systemUser.id)
    .update({
      //eslint-disable-next-line @typescript-eslint/camelcase
      created_by: systemUser.id,
    });

  await knex.schema.alterTable('users', (table) => {
    table
      .string('created_by')
      .notNullable()
      .alter();
  });
}

export async function down(knex: Knex) {
  await knex.schema
    .dropTable('user_status')
    .dropTable('user_profile')
    .dropTable('user_product_availability')
    .dropTable('user_product')
    .dropTable('product_schedule')
    .dropTable('product')
    .dropTable('users');
}
