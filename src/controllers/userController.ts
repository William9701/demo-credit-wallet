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

// Initialize Knex
const knex = Knex(knexConfig);

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, account_type, phone_number, profile_picture } = req.body;

  const account_number = generateAccountNumber();
  const hashedPassword = await bcrypt.hash(password, 10);

  const emailVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();

  const trx = await knex.transaction();

  try {
    // Send verification email
    const isEmailSent = await sendVerificationEmail(email, emailVerificationToken);
    if (!isEmailSent) {
      res.status(400).json({ message: "Failed to send verification email. Please try again." });
      return;
    }

    // Insert user into the database
    const [user] = await trx("users").insert(
      {
        name,
        email,
        password: hashedPassword,
        account_type,
        phone_number,
        profile_picture,
        account_number,
        email_verification_token: emailVerificationToken,
      },
      ["id", "name", "email", "account_number"]
    );

    await trx.commit();

    // Send successful response
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      account_number: user.account_number,
    });
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
