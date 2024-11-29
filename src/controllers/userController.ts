import { Request, Response } from "express";
import knexConfig from "../database/knexfile";
'use server';
import Knex from "knex";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../services/emailService";
import { generateAccountNumber } from "../services/accountService";
import { client } from "../services/plaidService";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { parseStringify } from "../utils/utils";
import crypto from "crypto";

// Initialize Knex
const knex = Knex(knexConfig);



export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, account_type, phone_number, profile_picture } = req.body;

  const account_number = generateAccountNumber();
  const hashedPassword = await bcrypt.hash(password, 10);

  const emailVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
  const fauxToken = crypto.randomBytes(16).toString("hex"); // Create a faux token

  const trx = await knex.transaction();

  try {
    // Send verification email
    const isEmailSent = await sendVerificationEmail(email, emailVerificationToken);
    if (!isEmailSent) {
      res.status(400).json({ message: "Failed to send verification email. Please try again." });
      return;
    }

    // Insert user into the database
    const [insertedId] = await trx("users").insert(
      {
        name,
        email,
        password: hashedPassword,
        account_type,
        phone_number,
        profile_picture,
        account_number,
        email_verification_token: emailVerificationToken,
      }
    );

    const user = await trx("users")
      .select("id", "name", "email", "account_number")
      .where({ id: insertedId })
      .first();

    await trx.commit();

    // Create a user session object (stored in memory or other storage)
    req.app.locals.sessions = req.app.locals.sessions || {};
    req.app.locals.sessions[fauxToken] = user;

    // Send response with faux token and user object
    res.status(201).json({ token: fauxToken, user });
  } catch (error) {
    // Rollback on failure
    await trx.rollback();
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user account", error });
  }
};


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
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
  
    try {
      const user = await knex("users").where({ email }).first();
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
  
      // Generate faux token
      const fauxToken = crypto.randomBytes(16).toString("hex");
  
      // Create a user session object (stored in memory or other storage)
      req.app.locals.sessions = req.app.locals.sessions || {};
      req.app.locals.sessions[fauxToken] = {
        id: user.id,
        name: user.name,
        email: user.email,
        account_number: user.account_number,
      };
  
      // Return token and user object
      res.status(200).json({ token: fauxToken, user: req.app.locals.sessions[fauxToken] });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: "Error logging in", error });
    }
  };
  




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
  


  

  