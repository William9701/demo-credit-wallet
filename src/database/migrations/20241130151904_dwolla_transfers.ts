import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("dwolla_transfers", (table) => {
        table.increments("id").primary();
        table.string("transfer_url").notNullable();
        table.string("source_funding_source").notNullable();
        table.string("destination_funding_source").notNullable();
        table.decimal("amount", 10, 2).notNullable();
        table.timestamps(true, true);
      });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("dwolla_transfers");
}

