import { Knex } from "knex";

export const seed = async (knex: Knex) => {
await knex("users").insert([
    { name: "John Doe", email: "john@example.com", password: "hashedpassword" },
    { name: "Jane Smith", email: "jane@example.com", password: "hashedpassword" }
  ]);
  
  await knex("transactions").insert({
    type: "deposit",
    amount: 100.00,
    source_user_id: 1,
  });
};