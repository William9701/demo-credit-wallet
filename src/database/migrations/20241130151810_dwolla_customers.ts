import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("dwolla_customers", (table) => {
        table.increments("id").primary();
        table.string("customer_id").notNullable().unique();
        table.string("customer_url").notNullable();
        table.string("email").notNullable();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("type").notNullable(); // 'personal' or 'business'
        table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("dwolla_customers");
}
