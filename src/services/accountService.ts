export const generateAccountNumber = (): string => {
    return "ACCT" + Math.floor(100000 + Math.random() * 900000);
  };
  