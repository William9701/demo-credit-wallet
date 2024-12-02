import { UserModel } from "../models/User";
import { TransactionModel } from "../models/Transaction";

export class WalletService {
  static async creditUser(userId: number, amount: number) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    const newBalance = parseFloat(user.balance) + amount;
    await UserModel.updateBalance(userId, newBalance);

    await TransactionModel.createTransaction({
      type: "deposit",
      amount,
      source_user_id: userId,
      destination_user_id: null,
    });

    return newBalance;
  }

  static async debitUser(userId: number, amount: number) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.balance < amount) throw new Error("Insufficient balance");

    const newBalance = parseFloat(user.balance) - amount;
    await UserModel.updateBalance(userId, newBalance);

    await TransactionModel.createTransaction({
      type: "withdraw",
      amount,
      source_user_id: userId,
      destination_user_id: null,
    });

    return newBalance;
  }

  static async transferFunds(
    sourceUserId: number,
    destinationUserId: number,
    amount: number
  ) {
    const sourceUser = await UserModel.findById(sourceUserId);
    const destinationUser = await UserModel.findById(destinationUserId);

    if (!sourceUser || !destinationUser) throw new Error("User not found");
    if (sourceUser.balance < amount) throw new Error("Insufficient balance");

    const newSourceBalance = parseFloat(sourceUser.balance) - amount;
    const newDestinationBalance = parseFloat(destinationUser.balance) + amount;

    await UserModel.updateBalance(sourceUserId, newSourceBalance);
    await UserModel.updateBalance(destinationUserId, newDestinationBalance);

    await TransactionModel.createTransaction({
      type: "transfer",
      amount,
      source_user_id: sourceUserId,
      destination_user_id: destinationUserId,
    });

    return { newSourceBalance, newDestinationBalance };
  }
}
