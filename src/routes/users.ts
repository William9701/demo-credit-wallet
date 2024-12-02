"use server";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { loginUser } from "../controllers/userController";
import { getAccountDetails } from "../controllers/transactionController";
import {
  signUp,
  createLinkToken,
  exchangePublicToken,
} from "../actions/user.actions";
import knexConfig from "../database/knexfile";
import {
  createTransfer,
  getFundingSourceBalance,
} from "../actions/dwolla.actions";
import { getAccountDetail } from "../actions/bank.actions";
import Knex from "knex";
import { AccountType } from "plaid";
// Initialize Knex
const knex = Knex(knexConfig);
declare type User = {
  $id: string;
  email: string;
  userId: string;
  dwollaCustomerUrl: string;
  dwollaCustomerId: string;
  firstName: string;
  lastName: string;
  name: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};

declare type Account = {
  id: number;
  userId: number;
  bankId: string;
  accountId: string;
  accessToken: string;
  fundingSourceUrl: string;
  shareableId: string;
  created_at: string;
  updated_at: string;
};

const router = express.Router();

router.post("/create_user", async (req, res) => {
  // Then pass the data to the signUp function
  const data = await signUp(req.body);
  res.status(201).json({ data });
});

router.post("/exchange_public_token", async (req: any, res: any) => {
  try {
    const { public_token, id } = req.body;

    // Start a transaction
    const trx = await knex.transaction();

    // Retrieve the user by ID
    const user: User = await trx("users")
      .select("*") // Correct syntax for selecting all columns
      .where({ id: id }) // Ensure `req.body` has an `id` field
      .first();

    // Handle case where user is not found
    if (!user) {
      await trx.rollback(); // Rollback transaction if necessary
      return res.status(404).json({ message: "User not found" });
    }

    // Call createLinkToken with the user data
    const { newBankAccountId } = await exchangePublicToken(public_token, user);

    console.log("Bank ID (newBankAccountId):", newBankAccountId);

    // Debug: Fetch all rows from bank_accounts
    const allBankAccounts = await trx("bank_accounts").select("*");

    // Commit the transaction
    await trx.commit();

    const newBankAccount = await getAccountDetail(newBankAccountId);
    console.log("Link Created:", newBankAccount);

    // Send a success response
    res.status(200).json({ newBankAccount });
  } catch (error) {
    console.error("Error in /create_link_token route:", error);

    // Return an error response
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/create_link_token", async (req: any, res: any) => {
  try {
    console.log("Received body in the router:", req.body);

    // Start a transaction
    const trx = await knex.transaction();

    // Retrieve the user by ID
    const user = await trx("users")
      .select("*") // Correct syntax for selecting all columns
      .where({ id: req.body.id }) // Ensure `req.body` has an `id` field
      .first();

    // Handle case where user is not found
    if (!user) {
      await trx.rollback(); // Rollback transaction if necessary
      return res.status(404).json({ message: "User not found" });
    }

    // Call createLinkToken with the user data
    const data = await createLinkToken(user);
    console.log("Created link token:", data);

    // Commit the transaction
    await trx.commit();

    // Send a success response
    res.status(200).json({ token: data });
  } catch (error) {
    console.error("Error in /create_link_token route:", error);

    // Return an error response
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/create_transfer", async (req: any, res: any) => {
  const { sourceFundingSourceUrl, destinationFundingSourceUrl, amount } =
    req.body;

  try {
    console.log("Source Funding URL:", sourceFundingSourceUrl);
    console.log("Destination Funding URL:", destinationFundingSourceUrl);

    // Step 1: Attempt to create the transfer
    const transferUrl = await createTransfer({
      sourceFundingSourceUrl,
      destinationFundingSourceUrl,
      amount,
    });

    if (transferUrl) {
      console.log("Transfer created successfully:", transferUrl);

      // Step 2: Start a transaction to update user balances
      const trx = await knex.transaction();

      try {
        // Parse the amount as a decimal for consistent calculations
        const parsedAmount = parseFloat(amount);

        // Search for users with matching source and destination URLs
        const sourceUser = await trx("users")
          .select("*")
          .where({ fundingSourceUrl: sourceFundingSourceUrl })
          .first();

        const destinationUser = await trx("users")
          .select("*")
          .where({ fundingSourceUrl: destinationFundingSourceUrl })
          .first();

        // Update source user balance if found
        if (sourceUser) {
          console.log("Source user found:", sourceUser);

          // Convert balance to a number for proper arithmetic
          const currentBalance = parseFloat(sourceUser.balance);

          // Subtract the amount
          const updatedBalance = (currentBalance - parsedAmount).toFixed(2);

          await trx("users")
            .where({ id: sourceUser.id })
            .update({ balance: updatedBalance });

          console.log("Source user balance updated:", updatedBalance);
        }

        // Update destination user balance if found
        if (destinationUser) {
          console.log("Destination user found:", destinationUser);

          // Convert balance to a number for proper arithmetic
          const currentBalance = parseFloat(destinationUser.balance);

          // Add the amount
          const updatedBalance = (currentBalance + parsedAmount).toFixed(2);

          await trx("users")
            .where({ id: destinationUser.id })
            .update({ balance: updatedBalance });

          console.log("Destination user balance updated:", updatedBalance);
        }

        // Commit the transaction
        await trx.commit();

        // Return success response
        return res.status(200).json({ transferUrl });
      } catch (err) {
        // Rollback the transaction on error
        await trx.rollback();
        console.error("Error updating balances:", err);
        return res
          .status(500)
          .json({ error: "Failed to update user balances" });
      }
    } else {
      console.error("Failed to create transfer");
      return res.status(400).json({ error: "Failed to create transfer" });
    }
  } catch (err) {
    console.error("Error creating transfer:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/get_wallet_balance", async (req: any, res: any) => {
  const { id } = req.body;
  // Start a transaction
  const trx = await knex.transaction();

  // Retrieve the user by ID
  const user = await trx("users")
    .select("*") // Correct syntax for selecting all columns
    .where({ id: id }) // Ensure `req.body` has an `id` field
    .first();

  // Handle case where user is not found
  if (!user) {
    await trx.rollback(); // Rollback transaction if necessary
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const wallet = await getFundingSourceBalance(user.fundingSourceUrl);
    return res.status(200).json({ wallet });
  } catch (err) {
    console.error("Error getting balance:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/get_account_details", getAccountDetails);

router.post("/login", loginUser);

export default router;
