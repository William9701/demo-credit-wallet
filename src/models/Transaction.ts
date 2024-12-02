import knexConfig from "../database/knexfile";
import Knex from "knex";

// Initialize Knex
const knex = Knex(knexConfig);


export class TransactionModel {
    static async createTransaction(data: Record<string, any>) {
      return knex("transactions").insert(data);
    }
  
    static async getTransactionsByUser(userId: number) {
      return knex("transactions")
        .where("source_user_id", userId)
        .orWhere("destination_user_id", userId)
        .orderBy("created_at", "desc");
    }
  }