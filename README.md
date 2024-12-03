# Demo Credit Wallet Project

This project is a comprehensive API for a **Demo Credit Wallet** system built with **Node.js**, **TypeScript**,  **Knex.js** and **Express**, for database management. The goal is to enable users to Create Account, fund their account, transfer funds to another user’s account, withdraw funds from their account making sure that any user with records in the Lendsqr Adjutor Karma blacklist is never onboard, it also has features to manage their credit wallet and more. The backend is powered by the **Dwolla** and **Plaid** APIs for financial services integration.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Setup](#setup)
5. [API Routes](#api-routes)
   - [POST /api/create_user](#post-create_user)
   - [POST /api/exchange_public_token](#post-exchange_public_token)
   - [POST /api/create_link_token](#post-create_link_token)
   - [POST /api/create_transfer](#post-create_transfer)
   - [POST /api/get_wallet_balance](#post-get_wallet_balance)
   - [POST /api/get_user](#post-get_user)
   - [POST /api/get_user_transactions](#post-get_user_transactions)
   - [POST /api/get_DWOLLA_user_transactions](#post-get_dwolla_user_transactions)
   - [POST /api/get_account_details](#post-get_account_details)
6. [Database Schema](#database-schema)
7. [E-R Diagram](#er-diagram)
8. [Contributing](#contributing)
9. [License](#license)

---

## Introduction

The **Demo Credit Wallet Project** provides a secure and flexible API for user authentication, account management, transaction processing, and interaction with financial APIs like Dwolla and Plaid. It allows users to create accounts, add bank accounts, view balances, initiate transfers, and more. 

This project is a full-stack solution that integrates with third-party APIs to enable users to connect their bank accounts and manage transfers within a wallet.

---

## Features

- **User Account Management:** Create, login, and view user profiles.
- **Bank Account Linking:** Users can link their bank accounts via the **Plaid** API.
- **Transactions:** Supports both credit and debit transactions through the **Dwolla** API.
- **Wallet Balance:** Retrieve wallet balance for a user and perform transfers between users.
- **Transaction History:** View transaction history for users.
- **Security:** Secure API routes with proper validation and error handling.

---

## Technologies Used

- **Node.js:** JavaScript runtime to run the server.
- **Express.js:** Web framework to handle routes and middleware.
- **TypeScript:** Superset of JavaScript for type safety and better development experience.
- **Knex.js:** SQL query builder for managing interactions with the PostgreSQL database.
- **Dwolla API:** Payment platform for ACH transfers.
- **Plaid API:** Financial services API to link user bank accounts.

---

## Setup

To get started with this project, follow the steps below:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/demo-credit-wallet.git
   cd demo-credit-wallet
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup environment variables:**
   
   Create a `.env` file at the root of the project and add your credentials for the **Plaid** and **Dwolla** APIs:
   
   ```env
   PLAID_CLIENT_ID=your-plaid-client-id
   PLAID_SECRET=your-plaid-secret
   DWOLLA_KEY=your-dwolla-key
   DWOLLA_SECRET=your-dwolla-secret
   ```

4. **Run the application:**

   ```bash
   npm run dev
   ```

---

## API Routes

### `POST /api/create_user`

- **Description:** Create a new user in the system.
- **Request Body:**
   ```json
   {
     "email": "user@example.com",
     "firstName": "John",
     "lastName": "Doe",
     "dateOfBirth": "1990-01-01",
     "address1": "123 Main St",
     "city": "New York",
     "state": "NY",
     "postalCode": "10001",
     "ssn": "123-45-6789"
   }
   ```
- **Response:**
   ```json
   {
     "data": { ...user data... }
   }
   ```

### `POST /api/create_transfer`

- **Description:** Create a transfer from one local wallet to  another local wallet or from a linked bank acount to your local wallet both for funding and withdrawal.
- **Request Body:**
   ```json
   {
     "sourceFundingSourceUrl": "source-funding-source-url",
     "destinationFundingSourceUrl": "destination-funding-source-url",
     "amount": 100.00
   }
   ```
- **Response:**
   ```json
   {
     "transferUrl": "transfer-url-here"
   }
   ```

### `POST /api/get_wallet_balance`

- **Description:** Get the wallet balance of a user.
- **Request Body:**
   ```json
   {
     "id": "user-id"
   }
   ```
- **Response:**
   ```json
   {
     "wallet": { ...wallet balance details... }
   }
   ```

### `POST /api/get_user`

- **Description:** Get the details of a user by their ID.
- **Request Body:**
   ```json
   {
     "id": "user-id"
   }
   ```
- **Response:**
   ```json
   {
     "user": { ...user details... }
   }
   ```

### `POST /api/get_user_transactions`

- **Description:** Get the transaction history of a user.
- **Request Body:**
   ```json
   {
     "id": "user-id"
   }
   ```
- **Response:**
   ```json
   {
     "user": { ...user details... },
     "transactions": [ ...transaction details... ]
   }
   ```

### `POST /api/get_DWOLLA_user_transactions`

- **Description:** Get the Dwolla-specific transaction history of a user.
- **Request Body:**
   ```json
   {
     "id": "user-id"
   }
   ```
- **Response:**
   ```json
   {
     "data": { ...transaction data from Dwolla... }
   }
   ```

### `POST /api/get_account_details`

- **Description:** Retrieve the account details of a bank account.
- **Request Body:**
   ```json
   {
     "accountId": "account-id"
   }
   ```
- **Response:**
   ```json
   {
     "accountDetails": { ...account details... }
   }
   ```

### `POST /api/login`

- **Description:** Log in a user by their credentials.
- **Request Body:**
   ```json
   {
     "email": "user@example.com",
     "password": "userpassword"
   }
   ```
- **Response:**
   ```json
   {
     "message": "Login successful",
     "token": "jwt-token-here"
   }
   ```

---

## Database Schema

The database is structured with the following tables:

1. **users:** Stores user information like name, email, address, and other personal details.
2. **bank_accounts:** Stores linked bank account information, including funding source details.
3. **dwolla_transfers:** Stores information about transfers made through the Dwolla API.

---

## E-R Diagram

![E-R Diagram](https://app.dbdesigner.net/uploads/your-er-diagram.png) *(Example link to your E-R diagram)*

---

## Contributing

We welcome contributions to improve the project. To contribute, please follow the steps below:

1. Fork the repository.
2. Create a new branch for your feature.
3. Commit your changes and push to your fork.
4. Submit a pull request for review.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This README should give a clear understanding of how to set up and use the API as well as provide details on the endpoints available for interaction with the **Demo Credit Wallet**. The E-R diagram and other visual documentation can be linked to enhance clarity.