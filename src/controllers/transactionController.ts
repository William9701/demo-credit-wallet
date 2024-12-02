import { Request, Response } from "express";
import knexConfig from "../database/knexfile";
import Knex from "knex";
import { client } from "../services/plaidService";



// Initialize Knex
const knex = Knex(knexConfig);


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