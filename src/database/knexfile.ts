import { Knex } from "knex";
import path from "path";

const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: "bqgkrmn5tfuuxbww5fnp-mysql.services.clever-cloud.com",
      user: "u63a4jiivmeozawi" ,
      password: "f4KsTZH9sNJM7hB0BAT3",
      database: "bqgkrmn5tfuuxbww5fnp" ,
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
