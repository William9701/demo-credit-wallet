import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        // Migration for users table (with account data included)
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.string('account_type');  // Loan, Savings, etc.
        table.decimal('balance', 14, 2).defaultTo(0.00);  // Account balance
        table.decimal('loan_amount', 14, 2).nullable();  // Loan amount
        table.decimal('interest_rate', 5, 2).nullable();  // Interest rate
        table.date('loan_due_date').nullable();  // Loan due date
        table.string('phone_number').nullable();  // Optional phone number
        table.string('account_number').unique().nullable(); // Optional phone number
        table.string('profile_picture').nullable();  // URL to profile picture
        table.boolean('is_email_verified').defaultTo(false);  // Email verification status
        table.boolean('is_active').defaultTo(true);  // Account status
        table.timestamps(true, true);  // Created & Updated timestamps

    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
}
