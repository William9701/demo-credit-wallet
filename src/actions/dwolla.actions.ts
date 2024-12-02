"use server";

import { Client } from "dwolla-v2";
import knexConfig from "../database/knexfile";
'use server';
import Knex from "knex";
import { response } from "express";
const knex = Knex(knexConfig);




/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type SignUpParams = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  password: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

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

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  password: string;
};

declare type Account = {
  id: string;
  availableBalance: number;
  currentBalance: number;
  officialName: string;
  mask: string;
  institutionId: string;
  name: string;
  type: string;
  subtype: string;
  appwriteItemId: string;
  shareableId: string;
};

declare type Transaction = {
  id: string;
  $id: string;
  name: string;
  paymentChannel: string;
  type: string;
  accountId: string;
  amount: number;
  pending: boolean;
  category: string;
  date: string;
  image: string;

  $createdAt: string;
  channel: string;
  senderBankId: string;
  receiverBankId: string;
};

declare type Bank = {
  $id: string;
  accountId: string;
  bankId: string;
  accessToken: string;
  fundingSourceUrl: string;
  userId: string;
  shareableId: string;
};

declare type AccountTypes =
  | "depository"
  | "credit"
  | "loan "
  | "investment"
  | "other";

declare type Category = "Food and Drink" | "Travel" | "Transfer";

declare type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

declare type Receiver = {
  firstName: string;
  lastName: string;
};

declare type TransferParams = {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: string;
};

declare type AddFundingSourceParams = {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
};

declare type NewDwollaCustomerParams = {
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};

declare interface CreditCardProps {
  account: Account;
  userName: string;
  showBalance?: boolean;
}

declare interface BankInfoProps {
  account: Account;
  appwriteItemId?: string;
  type: "full" | "card";
}

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface MobileNavProps {
  user: User;
}

declare interface PageHeaderProps {
  topTitle: string;
  bottomTitle: string;
  topDescription: string;
  bottomDescription: string;
  connectBank?: boolean;
}

declare interface PaginationProps {
  page: number;
  totalPages: number;
}

declare interface PlaidLinkProps {
  user: User;
  variant?: "primary" | "ghost";
  dwollaCustomerId?: string;
}

// declare type User = sdk.Models.Document & {
//   accountId: string;
//   email: string;
//   name: string;
//   items: string[];
//   accessToken: string;
//   image: string;
// };

declare interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

//   declare interface BankDropdownProps {
//     accounts: Account[];
//     setValue?: UseFormSetValue<any>;
//     otherStyles?: string;
//   }

declare interface BankTabItemProps {
  account: Account;
  appwriteItemId?: string;
}

declare interface TotalBalanceBoxProps {
  accounts: Account[];
  totalBanks: number;
  totalCurrentBalance: number;
}

declare interface FooterProps {
  user: User;
  type?: 'mobile' | 'desktop'
}

declare interface RightSidebarProps {
  user: User;
  transactions: Transaction[];
  banks: Bank[] & Account[];
}

declare interface SiderbarProps {
  user: User;
}

declare interface RecentTransactionsProps {
  accounts: Account[];
  transactions: Transaction[];
  appwriteItemId: string;
  page: number;
}

declare interface TransactionHistoryTableProps {
  transactions: Transaction[];
  page: number;
}

declare interface CategoryBadgeProps {
  category: string;
}

declare interface TransactionTableProps {
  transactions: Transaction[];
}

declare interface CategoryProps {
  category: CategoryCount;
}

declare interface DoughnutChartProps {
  accounts: Account[];
}

declare interface PaymentTransferFormProps {
  accounts: Account[];
}

// Actions
declare interface getAccountsProps {
  userId: string;
}

declare interface getAccountProps {
  appwriteItemId: string;
}

declare interface getInstitutionProps {
  institutionId: string;
}

declare interface getTransactionsProps {
  accessToken: string;
}

declare interface CreateFundingSourceOptions {
  customerId: string; // Dwolla Customer ID
  fundingSourceName: string; // Dwolla Funding Source Name
  plaidToken: string; // Plaid Account Processor Token
  _links: object; // Dwolla On Demand Authorization Link
}

declare interface CreateTransactionProps {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  email: string;
}

declare interface getTransactionsByBankIdProps {
  bankId: string;
}

declare interface signInProps {
  email: string;
  password: string;
}

declare interface getUserInfoProps {
  userId: string;
}

declare interface exchangePublicTokenProps {
  publicToken: string;
  user: User;
}

declare interface createBankAccountProps {
  accessToken: string;
  userId: string;
  accountId: string;
  bankId: string;
  fundingSourceUrl: string;
  shareableId: string;
}

declare interface getBanksProps {
  userId: string;
}

declare interface getBankProps {
  documentId: string;
}

declare interface getBankByAccountIdProps {
  accountId: string;
}



















// Determine Dwolla Environment
const getEnvironment = (): "production" | "sandbox" => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      throw new Error(
        "Dwolla environment should either be set to `sandbox` or `production`"
      );
  }
};

// Dwolla Client Initialization
const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

// Create a Dwolla Customer
export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    const customerUrl = await dwollaClient
      .post("customers", newCustomer)
      .then((res) => res.headers.get("location"));

    // Save the customer to the database using Knex
    if (customerUrl) {
      const customerId = customerUrl.split("/").pop(); // Extract ID from URL
      await knex("dwolla_customers").insert({
        customer_id: customerId,
        customer_url: customerUrl,
        email: newCustomer.email,
        first_name: newCustomer.firstName,
        last_name: newCustomer.lastName,
        type: newCustomer.type,
      });
    }

    return customerUrl;
  } catch (err) {
    console.error("Creating a Dwolla Customer Failed: ", err);
    throw err;
  }
};

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    const fundingSourceUrl = await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((res) => res.headers.get("location"));

    // Save the funding source to the database
    if (fundingSourceUrl) {
      await knex("dwolla_funding_sources").insert({
        funding_source_url: fundingSourceUrl,
        customer_id: options.customerId,
        funding_source_name: options.fundingSourceName,
      });
    }

    return fundingSourceUrl;
  } catch (err) {
    console.error("Creating a Funding Source Failed: ", err);
    throw err;
  }
};

// Create an On-Demand Authorization
export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations"
    );
    return onDemandAuthorization.body._links;
  } catch (err) {
    console.error("Creating an On-Demand Authorization Failed: ", err);
    throw err;
  }
};

// Create a Transfer
export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: "USD",
        value: amount,
      },
    };

    const transferUrl = await dwollaClient
      .post("transfers", requestBody)
      .then((res) => res.headers.get("location"));

    // Save the transfer details to the database
    if (transferUrl) {
      await knex("dwolla_transfers").insert({
        transfer_url: transferUrl,
        source_funding_source: sourceFundingSourceUrl,
        destination_funding_source: destinationFundingSourceUrl,
        amount,
      });
    }

    return transferUrl;
  } catch (err) {
    console.error("Transfer fund failed: ", err);
    throw err;
  }
};

// Add a Funding Source with Authorization
export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    // Create Dwolla authorization link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // Add funding source to the Dwolla customer & get the funding source URL
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };

    const fundingSourceUrl = await createFundingSource(fundingSourceOptions);

    return fundingSourceUrl;
  } catch (err) {
    console.error("Adding Funding Source Failed: ", err);
    throw err;
  }
};


export const addFundingSource2 = async (dwollaCustomerId: string) => {
  try {
    // Prepare the payload
    const fundingSourcePayload = {
      type: 'personal', // or 'savings' for a savings account
      // other required data like routing number, account number, etc.
    };

    // Construct the customer URL
    const customerUrl = `https://api-sandbox.dwolla.com/customers/${dwollaCustomerId}`;

    // Fetch funding sources
    const response = await dwollaClient.get(`${customerUrl}/funding-sources`);
    
    const fundingSources = response.body._embedded["funding-sources"];

    if (fundingSources && fundingSources.length > 0) {
      const name = fundingSources[0].id;
      return name;
    } else {
      console.log('No funding sources found for this customer.');
      return null; // Or handle as needed
    }
  } catch (error) {
    console.error('Error adding funding source:', error);
    throw error;
  }
};


export const getFundingSourceBalance = async (fundingSourceId: string) => {
  try {
    // Construct the balance URL for the funding source
    const balanceUrl = `${fundingSourceId}/balance`;

    // Fetch the balance
    const response = await dwollaClient.get(balanceUrl);

    // Log and return the balance
    const balance = response.body.balance;
    console.log('Funding Source Balance:', balance);
    return balance;
  } catch (error) {
    console.error('Error fetching funding source balance:', error);
    throw error;
  }
};
