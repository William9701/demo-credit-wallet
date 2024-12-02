import { Request, Response } from "express";
import { WalletService } from "../services/WalletService";
import { TransactionModel } from "../models/Transaction";

export class WalletController {
  static async deposit(req: Request, res: Response) {
    try {
      const { userId, amount } = req.body;
      const newBalance = await WalletService.creditUser(userId, parseFloat(amount));
      res.status(200).json({ message: "Deposit successful", newBalance });
    } catch (error) {
        res.status(400).json({ error: (error as { message: string }).message }); // Type Assertion
    }
  }

  static async withdraw(req: Request, res: Response) {
    try {
      const { userId, amount } = req.body;
      const newBalance = await WalletService.debitUser(userId, parseFloat(amount));
      res.status(200).json({ message: "Withdrawal successful", newBalance });
    } catch (error) {
        res.status(400).json({ error: (error as { message: string }).message }); // Type Assertion
    }
  }

  static async transfer(req: Request, res: Response) {
    try {
      const { sourceUserId, destinationUserId, amount } = req.body;
      const result = await WalletService.transferFunds(
        sourceUserId,
        destinationUserId,
        parseFloat(amount)
      );
      res.status(200).json({ message: "Transfer successful", result });
    } catch (error) {
        res.status(400).json({ error: (error as { message: string }).message }); // Type Assertion
    }
  }

  static async getTransactions(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const transactions = await TransactionModel.getTransactionsByUser(parseInt(userId));
      res.status(200).json({ transactions });
    } catch (error) {
        res.status(400).json({ error: (error as { message: string }).message }); // Type Assertion
    }
  }
}
