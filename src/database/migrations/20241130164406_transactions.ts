import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.increments('id').primary(); // Auto-incrementing primary key
        table.string('email').unique().notNullable(); // User's email address, unique
        table.string('password').notNullable(); // User's password
        table.string('firstName').notNullable(); // User's first name
        table.string('lastName').notNullable(); // User's last name
        table.string('address1').notNullable(); // User's last name
        table.string('city').notNullable(); // User's last name
        table.string('dateOfBirth').notNullable(); // User's last name
        table.string('postalCode').notNullable(); // User's last name
        table.string('account_number').notNullable(); // User's last name
        table.string('ssn').notNullable(); // User's ssn
        table.string('state').notNullable(); // User's state name
        table.string('account_type');  // Loan, Savings, etc.
        table.decimal('balance', 14, 2).defaultTo(0.00);  // Account balance
        table.decimal('loan_amount', 14, 2).nullable();  // Loan amount
        table.decimal('interest_rate', 5, 2).nullable();  // Interest rate
        table.date('loan_due_date').nullable();  // Loan due date
        table.string('fundingSourceUrl').nullable(); // DWOLLA customer funding source url
        table.string('dwollaCustomerId').nullable(); // DWOLLA customer ID
        table.string('dwollaCustomerUrl').nullable(); // DWOLLA customer URL
        table.timestamps(true, true); // created_at and updated_at timestamps
      });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('users');
}

