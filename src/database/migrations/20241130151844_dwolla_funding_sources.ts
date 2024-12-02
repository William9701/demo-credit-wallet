import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("dwolla_funding_sources", (table) => {
        table.increments("id").primary();
        table.string("funding_source_url").notNullable();
        table.string("customer_id").notNullable();
        table.string("funding_source_name").notNullable();
        table.timestamps(true, true);
      });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("dwolla_funding_sources");
}

