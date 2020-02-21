import {default as Knex} from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments().unsigned().primary();
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.string('unit_number').notNullable();
  })
}