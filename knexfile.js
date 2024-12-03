// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2', // Specify the MySQL client
    connection: {
      host: process.env.DBHOST |'127.0.0.1',
      user: process.env.DBUSER |'root',         // Replace with your MySQL username
      password: process.env.DBPASSWORD |'root',         // Replace with your MySQL password
      database: process.env.DATABASE |'demo_credit_wallet', // Replace with your database name
    },
    migrations: {
      directory: './src/database/migrations' // Ensure your migrations are organized
    },
    seeds: {
      directory: './src/database/seeds'
    }
  }
};

