import { parseStringify } from "../utils/utils";

import knexConfig from "../database/knexfile";
import Knex from "knex";
const knex = Knex(knexConfig);

declare interface CreateTransactionProps {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  email: string;
}

declare interface getTransactionsByBankIdProps {
  bankId: string;
}


// Create a new transaction
export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    const [newTransactionId] = await knex('transactions').insert({
      channel: 'online',
      category: 'Transfer',
      ...transaction,
    }).returning('id');

    const newTransaction = await knex('transactions').where('id', newTransactionId).first();

    return parseStringify(newTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
  }
};

// Get transactions by bank ID
export const getTransactionsByBankId = async ({ bankId }: getTransactionsByBankIdProps) => {
  try {
    const senderTransactions = await knex('transactions')
      .where('senderBankId', bankId);

    const receiverTransactions = await knex('transactions')
      .where('receiverBankId', bankId);

    const transactions = {
      total: senderTransactions.length + receiverTransactions.length,
      documents: [
        ...senderTransactions,
        ...receiverTransactions,
      ]
    };

    return parseStringify(transactions);
  } catch (error) {
    console.error("Error fetching transactions by bank ID:", error);
  }
};
