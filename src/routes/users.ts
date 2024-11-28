import express, { Request, Response } from 'express';
import knexConfig from '../database/knexfile'; // Corrected import
import Knex from 'knex';

const knex = Knex(knexConfig); // Initialize Knex with config

const router = express.Router();

// Function to generate a random account number (example format: ACCT123456)
const generateAccountNumber = () => {
    return 'ACCT' + Math.floor(100000 + Math.random() * 900000);  // Example format
};

// POST route to create a user account
router.post('/users', async (req: Request, res: Response) => {
    const { name, email, password, account_type, phone_number, profile_picture } = req.body;

    const account_number = generateAccountNumber(); // Generate account number

    try {
        // Insert the new user into the 'users' table
        await knex('users').insert(
            {
                name,
                email,
                password,
                account_type,
                phone_number,
                profile_picture,
                account_number, // Store the generated account number
            }
        );

        // Retrieve the newly created user based on the email (or account_number)
        const user = await knex('users').where({ email }).first();

        // Return the created user data including the account number
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            account_number: user.account_number,  // Send back the account number
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user account', error });
    }
});


export default router;
