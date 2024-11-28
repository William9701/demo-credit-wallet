import { Knex } from "knex";
import path from "path";

const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "demo_credit_wallet",
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations'), // Adjust this path
    extension: 'ts', // Ensure TypeScript extension is used
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds'),
  },
};

export default config;
