import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table.integer("sender_id").unsigned().nullable().references("id").inTable("users").onDelete("SET NULL");
    table.integer("receiver_id").unsigned().nullable().references("id").inTable("users").onDelete("SET NULL");
    table.decimal("amount", 14, 2).notNullable();
    table.enum("type", ["fund", "transfer", "withdraw"]).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("transactions");
}
