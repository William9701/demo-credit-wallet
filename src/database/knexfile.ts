import { Knex } from "knex";
import path from "path";

const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: "bj6hfggpnse7bhnpnn35-mysql.services.clever-cloud.com",
      user: "ua522lksd7zy7i2y" ,
      password: "Pt01LC19FqrVfbXsqeMf",
      database: "bj6hfggpnse7bhnpnn35" ,
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
