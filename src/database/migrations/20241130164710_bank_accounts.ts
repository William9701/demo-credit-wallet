import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (table) => {
        table.increments('id').primary(); // Auto-incrementing primary key
        table.string('channel').defaultTo('online'); // Channel (e.g., online, offline)
        table.string('category').defaultTo('Transfer'); // Category of the transaction
        table.integer('senderBankId').unsigned(); // Bank ID for the sender
        table.integer('receiverBankId').unsigned(); // Bank ID for the receiver
        table.decimal('amount', 12, 2); // Amount involved in the transaction
        table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for when the transaction was created
        table.timestamp('updated_at').defaultTo(knex.fn.now()); // Timestamp for when the transaction was last updated
    
        // Foreign keys (if necessary)
        table.foreign('senderBankId').references('bank_accounts.id').onDelete('CASCADE');
        table.foreign('receiverBankId').references('bank_accounts.id').onDelete('CASCADE');
      });
    
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('transactions');
}

