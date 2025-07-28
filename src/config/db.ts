import knex from "knex";
import config from "../../knexfile";

const DB = knex(config.development);

// Check if database is connected successfully 
DB.raw('SELECT 1')
  .then(() => {
    console.log("Database connection successfully!");
  })
  .catch((err) => {
    console.log("Database connection failed:", err.message);
    process.exit(1);
  });

export default DB;
