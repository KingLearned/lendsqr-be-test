import type { Knex } from "knex";
import dotenv from "dotenv";
import { DB_URL } from "./src/config/env";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: DB_URL,
    migrations: {
      directory: "./src/db/migrations"
    },
    seeds: {
      directory: "./src/db/seeds"
    }
  },
};

export default config;
