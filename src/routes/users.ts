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

router.post("/create_user", async (req: Request, res: any) => {
  try {
  // Then pass the data to the signUp function
  const data = await signUp(req.body);
  res.status(201).json({ data });
  } catch (error: any) {
    const specificMessage =
        error.body._embedded.errors[0]?.message || "Unknown error occurred";
      return res.status(500).json({ error: specificMessage });
    
  }
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
  const { sourceFundingSourceUrl, destinationFundingSourceUrl, amount } = req.body;

  try {
    console.log("Source Funding URL:", sourceFundingSourceUrl);
    console.log("Destination Funding URL:", destinationFundingSourceUrl);

    // Step 1: Attempt to create the transfer
    try {
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
          const parsedAmount = parseFloat(amount);

          const sourceUser = await trx("users")
            .select("*")
            .where({ fundingSourceUrl: sourceFundingSourceUrl })
            .first();

          const destinationUser = await trx("users")
            .select("*")
            .where({ fundingSourceUrl: destinationFundingSourceUrl })
            .first();

          if (sourceUser) {
            console.log("Source user found:", sourceUser);
            const currentBalance = parseFloat(sourceUser.balance);
            const updatedBalance: any = (currentBalance - parsedAmount).toFixed(2);

            if (updatedBalance < 0) {
              throw new Error("Insufficient funds in source account.");
            }

            await trx("users")
              .where({ id: sourceUser.id })
              .update({ balance: updatedBalance });

            console.log("Source user balance updated:", updatedBalance);
          }

          if (destinationUser) {
            console.log("Destination user found:", destinationUser);
            const currentBalance = parseFloat(destinationUser.balance);
            const updatedBalance = (currentBalance + parsedAmount).toFixed(2);

            await trx("users")
              .where({ id: destinationUser.id })
              .update({ balance: updatedBalance });

            console.log("Destination user balance updated:", updatedBalance);
          }

          await trx.commit();

          return res.status(200).json({ transferUrl });
        } catch (err) {
          await trx.rollback();
          console.error("Error updating balances:", err);
          return res.status(400).json({ error: err });
        }
      } else {
        return res.status(400).json({ error: "Failed to create transfer" });
      }
    } catch (apiError: any) {
      // Handle API-specific errors from Dwolla
      // console.error("Error creating transfer:", apiError);
     // Access the nested error message
     try {
      const specificMessage =
        apiError.body._embedded.errors[0]?.message || "Unknown error occurred";
      console.error("Specific error message:", specificMessage);
      return res.status(500).json({ error: specificMessage });
    } catch (e) {
      console.error("Error extracting specific message:", e);
    }
    

      return res.status(500).json({ error: "Bad request either format not complete or incorrect funding source url" });
    }
  } catch (err) {
    console.error("Unhandled error:", err);
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
