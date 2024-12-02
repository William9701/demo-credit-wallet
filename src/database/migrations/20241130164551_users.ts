import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('bank_accounts', (table) => {
        table.increments('id').primary(); // Auto-incrementing primary key
        table.integer('userId').unsigned().notNullable(); // Foreign key to users table
        table.string('bankId').notNullable(); // ID of the bank
        table.string('accountId').notNullable(); // Unique account ID from Plaid
        table.string('accessToken').notNullable(); // Access token for the bank account
        table.string('fundingSourceUrl').nullable(); // Funding source URL from Dwolla
        table.string('shareableId').nullable(); // Encrypted shareable ID for the account
        table.timestamps(true, true); // created_at and updated_at timestamps
    
        // Foreign key constraint to users table
        table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
      });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('bank_accounts');
}

