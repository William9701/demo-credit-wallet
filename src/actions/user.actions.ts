"use server";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils/utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { client as plaidClient } from "../services/plaidService";
import { addFundingSource, createDwollaCustomer, addFundingSource2 } from "./dwolla.actions";
import knexConfig from "../database/knexfile";
import Knex from "knex";
import bcrypt from "bcryptjs";

import { generateAccountNumber } from "../services/accountService";
import { json } from "body-parser";
import { STATUS_CODES } from "http";

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

// declare interface BankDropdownProps {
//   accounts: Account[];
//   setValue?: UseFormSetValue<any>;
//   otherStyles?: string;
// }

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









export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const user = await knex('users').where({ userId }).first();
    return parseStringify(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const user = await knex('users').where({ email, password }).first();

    if (!user) throw new Error('Invalid credentials');

    return parseStringify(user);
  } catch (error) {
    console.error("Error during sign-in:", error);
  }
};

async function cleanUserData(userData: any) {
  const { _events, _readableState, socket, ...cleanedData } = userData;
  return cleanedData;
}

const checkAdjutorBlacklisted = async (email: String) => {
  try {
    const response = await fetch(
      `https://adjutor.lendsqr.com/v2/verification/karma/${email}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer sk_live_EHr2C48xVeca52XCiy8VbbGuqMSKw41dyJI58oEV",
        },
      }
    );

    // Check if the response status is OK
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const { data } = await response.json(); // Parse the JSON response
    const { amount_in_contention, karma_type, default_date } = data;

    // Check if user meets any blacklist criteria
    if (
      parseFloat(amount_in_contention) > 0 || // Financial contention
      (karma_type.karma && karma_type.karma !== "Others") // Specific blacklist type
    ) {
      return true; // User is blacklisted
    }

    return false; // User is not blacklisted
  } catch (error) {
    console.error("Error checking Adjutor blacklist:", error);
    return false; // Handle errors gracefully
  }
};




export  const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData
  try {
    const trx = await knex.transaction();

    const blackListed = await checkAdjutorBlacklisted(email)
    if (blackListed) {
      throw new Error("User is blacklisted")
    }

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });

    

    const account_number = generateAccountNumber();
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!dwollaCustomerUrl) throw new Error("Error creating Dwolla customer");

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
    const fundingSource = await addFundingSource2(dwollaCustomerId)
    const fundingSourceUrl = `https://api-sandbox.dwolla.com/funding-sources/${fundingSource}`

    const [newUserId] = await knex('users').insert({
      ...userData,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      fundingSourceUrl,
      dwollaCustomerId,
      dwollaCustomerUrl,
      account_number,
    })

    const user = await trx("users")
      .select("*")
      .where({ id: newUserId })
      .first();

    await trx.commit();

    return { user }; // Return the user
  } catch (error) {
    console.error("Error during sign-up:", error);
  }
};

export const createLinkToken = async (user: User) => {
  const Muser = await cleanUserData(user);
  
    try {
      const tokenParams = {
        user: {
          client_user_id: process.env.PLAID_CLIENT_ID!
        },
        client_name: `${Muser.firstName} ${Muser.lastName}`,
        products: ['auth'] as Products[],
        language: 'en',
        country_codes: ['US'] as CountryCode[],
      }
      const response = await plaidClient.linkTokenCreate(tokenParams);
      console.log(response.data.link_token)
  
      return parseStringify({ linkToken: response.data.link_token })
    } catch (error) {
      console.log(error);
    }
  }

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  const trx = await knex.transaction();
  try {
    const [newBankAccountId] = await knex('bank_accounts').insert({
      userId,
      bankId,
      accountId,
      accessToken,
      fundingSourceUrl,
      shareableId,
    });
    await trx.commit();
    return parseStringify({ newBankAccountId });
  } catch (error) {
    console.error("Error creating bank account:", error);
  }
};

export const exchangePublicToken = async (
  publicToken: any, user: any) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    console.log(user.id);
    console.log(publicToken);

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    const processorTokenResponse = await plaidClient.processorTokenCreate({
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    });

    const processorToken = processorTokenResponse.data.processor_token;

    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    if (!fundingSourceUrl) throw Error;

    const { newBankAccountId } = await createBankAccount({
      userId: user.id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });
    

    return parseStringify({ newBankAccountId });
  } catch (error) {
    console.error("Error during public token exchange:", error);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const banks = await knex('bank_accounts').where({ userId });
    return parseStringify(banks);
  } catch (error) {
    console.error("Error fetching banks:", error);
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const bank = await knex('bank_accounts').where({ id: documentId }).first();
    return parseStringify(bank);
  } catch (error) {
    console.error("Error fetching bank:", error);
  }
};

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    const bank = await knex('bank_accounts').where({ accountId }).first();
    return bank ? parseStringify(bank) : null;
  } catch (error) {
    console.error("Error fetching bank by account ID:", error);
  }
};
