import { Knex } from "knex";
import path from "path";

const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: "byjh6nz1zpqorjhnn5my-mysql.services.clever-cloud.com",
      user: "uljihcrptkgm8tqh" ,
      password: "At65YllX1A3fmUynB0bj",
      database: "byjh6nz1zpqorjhnn5my" ,
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
