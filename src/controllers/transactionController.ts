import { Request, Response } from "express";
import knexConfig from "../database/knexfile";
'use server';
import Knex from "knex";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../services/emailService";
import { generateAccountNumber } from "../services/accountService";
import { client } from "../services/plaidService";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products, TransferIntentCreateRequest } from "plaid";
import { parseStringify } from "../utils/utils";
import crypto from "crypto";
import { PaymentAmountCurrency } from 'plaid';


// Initialize Knex
const knex = Knex(knexConfig);





export const createLinkToken = async (req: Request, res: Response) => {
    try {
      const tokenParams: any = {
        user: {
          client_user_id: process.env.PLAID_CLIENT_ID
        },
        client_name: `leaf`,
        products: ['auth', 'transactions'] as Products[],
        language: 'en',
        country_codes: ['US'] as CountryCode[],
      }
  
      // Create a link token using the Plaid client
      const response = await client.linkTokenCreate(tokenParams);
  
      // Return the link token to the frontend
      res.json({ link_token: response.data.link_token });
    } catch (error) {
      console.log(error);
    }
  }

  export const exchangePublicToken = async (req: Request, res: Response) => {
    const { public_token, token } = req.body;
  
    // Begin transaction
    const trx = await knex.transaction();
  
    try {
      console.log("Token received:", token);
  
      // Find the user by ID
      const user = await knex("users").where({ id: token }).first();
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      console.log("User found:", user);
  
      // Exchange the public token for an access token
      const response = await client.itemPublicTokenExchange({
        public_token: public_token,
      });
      const accessToken = response.data.access_token;
  
      console.log("Access Token received:", accessToken);
  
      // Update the user's record in the database with the access token
      await trx("users")
        .where({ id: user.id })
        .update({ access_token: accessToken });
  
      // Commit transaction
      await trx.commit();
  
      res.json({ message: "Access token updated successfully", access_token: accessToken });
    } catch (err: any) {
      // Rollback transaction on error
      await trx.rollback();
  
      console.error("Error exchanging public token:", err);
      res.status(500).json({ error: "An error occurred while exchanging the token" });
    }
  };
  

  export const getAccountDetails = async (req: Request, res: Response) => {
    const { token } = req.body;
    const trx = await knex.transaction();
  
    try {
      console.log("Token received:", token);
  
      // Find the user by ID
      const user = await knex("bank_accounts").where({ id: token }).first();
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      
        const access_token: any = user.accessToken; // Corrected spelling

        console.log("User found:", access_token);
        const response = await client.accountsGet({ access_token }); 
        const accounts = response.data.accounts;
        console.log("Accounts:", accounts);
    } catch (err) {
    // ... handle error ...
    }

  }