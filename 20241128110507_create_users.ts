import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary(); // Auto-incrementing ID
    table
      .enum("type", ["deposit", "withdraw", "transfer"])
      .notNullable(); // Transaction type
    table.decimal("amount", 10, 2).notNullable(); // Transaction amount
    table.integer("source_user_id").unsigned(); // Source user ID
    table
      .integer("destination_user_id")
      .unsigned()
      .nullable(); // Destination user ID
    table
      .timestamp("created_at")
      .defaultTo(knex.fn.now()); // Timestamp of creation

    // Foreign key constraints
    table
      .foreign("source_user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE"); // Delete transactions if source user is deleted
    table
      .foreign("destination_user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE"); // Delete transactions if destination user is deleted
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");
}
