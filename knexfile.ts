import type { Knex } from "knex";
import dotenv from "dotenv";
import { CLIENT, DB_URL } from "./src/config/env";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: CLIENT,
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
