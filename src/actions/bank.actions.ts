import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { client as plaidClient } from "../services/plaidService";
import { parseStringify } from "../utils/utils";

import { getTransactionsByBankId } from "./transaction.actions";
import { getBanks, getBank } from "./user.actions";




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
  
















// Get multiple bank accounts
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // get banks from db
    const banks = await getBanks({ userId });

    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        // get each account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        // get institution info from plaid
        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        const account = {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          institutionId: institution.institution_id,
          name: accountData.name,
          officialName: accountData.official_name,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          appwriteItemId: bank.$id,
          sharaebleId: bank.shareableId,
        };

        return account;
      })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get one bank account
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    // get bank from db
    const bank = await getBank({ documentId: appwriteItemId });

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from appwrite
    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id,
    });

    const transferTransactions = transferTransactionsData.documents.map(
      (transferData: Transaction) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
      })
    );

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
    });

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
      const allTransactions = [...transactions, ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

// Get bank info
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get transactions
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any = [];

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

