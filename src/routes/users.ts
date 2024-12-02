"use server";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { createUser,loginUser } from "../controllers/userController";
import {    getAccountDetails } from "../controllers/transactionController"
import { signUp, createLinkToken, exchangePublicToken } from "../actions/user.actions"
import knexConfig from "../database/knexfile";
import { createTransfer, getFundingSourceBalance } from "../actions/dwolla.actions"
import Knex from "knex";
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
  


const router = express.Router();

router.post("/users", (req, res) => {
    console.log("Received body in the router:", req.body);
    // Then pass the data to the signUp function
    const data = signUp(req.body);
    res.status(201).json({ data });
  });
  
router.post("/login", loginUser);
router.post("/exchange_public_token", async (req: any, res: any) => { 
    try {
      const { public_token, id } = req.body;
  
      // Start a transaction
      const trx = await knex.transaction();
  
      // Retrieve the user by ID
      const user: User = await trx("users")
        .select('*') // Correct syntax for selecting all columns
        .where({ id: id }) // Ensure `req.body` has an `id` field
        .first();
        
      // Handle case where user is not found
      if (!user) {
        await trx.rollback(); // Rollback transaction if necessary
        return res.status(404).json({ message: "User not found" });
      }
  
      // Call createLinkToken with the user data
      const data = await exchangePublicToken(public_token, user);
      
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
router.post("/create_link_token", async (req: any, res: any) => { 
    try {
      console.log("Received body in the router:", req.body);
  
      // Start a transaction
      const trx = await knex.transaction();
  
      // Retrieve the user by ID
      const user = await trx("users")
        .select('*') // Correct syntax for selecting all columns
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
  
  
router.post("/get_account_details",getAccountDetails);
// Ensure `createTransfer` is properly called as an async function inside the route handler
router.post("/create_transfer", async (req: any, res: any) => {
    const { sourceFundingSourceUrl, destinationFundingSourceUrl, amount } = req.body;
    console.log(sourceFundingSourceUrl)
    try {
      const transferUrl = await createTransfer({
        sourceFundingSourceUrl,
        destinationFundingSourceUrl,
        amount
      });
  
      if (transferUrl) {
        return res.status(200).json({ transferUrl });
      } else {
        return res.status(400).json({ error: "Failed to create transfer" });
      }
    } catch (err) {
      console.error("Error creating transfer:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

export default router;

router.post("/get_wallet_balance", async (req: any, res: any) => {
    const { id } = req.body;
    // Start a transaction
    const trx = await knex.transaction();
  
    // Retrieve the user by ID
    const user = await trx("users")
      .select('*') // Correct syntax for selecting all columns
      .where({ id: id }) // Ensure `req.body` has an `id` field
      .first();
      
    // Handle case where user is not found
    if (!user) {
      await trx.rollback(); // Rollback transaction if necessary
      return res.status(404).json({ message: "User not found" });
    }

    try {
        const wallet = await getFundingSourceBalance(user.fundingSourceUrl)
        return res.status(200).json({ wallet });
        
      } catch (err) {
        console.error("Error getting balance:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

    
});
