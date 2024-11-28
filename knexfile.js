// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2', // Specify the MySQL client
    connection: {
      host: '127.0.0.1',
      user: 'root',         // Replace with your MySQL username
      password: 'root',         // Replace with your MySQL password
      database: 'demo_credit_wallet' // Replace with your database name
    },
    migrations: {
      directory: './src/database/migrations' // Ensure your migrations are organized
    },
    seeds: {
      directory: './src/database/seeds'
    }
  }
};

