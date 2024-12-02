import knexConfig from "../database/knexfile";
import Knex from "knex";

// Initialize Knex
const knex = Knex(knexConfig);

export class UserModel {
  static async findById(id: number) {
    return knex("users").where({ id }).first();
  }

  static async updateBalance(userId: number, newBalance: number) {
    return knex("users").where({ id: userId }).update({ balance: newBalance });
  }

  static async createUser(data: Record<string, any>) {
    return knex("users").insert(data);
  }
}
