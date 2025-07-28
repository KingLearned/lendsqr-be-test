import DB from "../config/db";

// Generate a random 10-digit number
const generateRandomAccountNumber = (): string => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Make every account number unique
export const generateUniqueAccountNumber = async (): Promise<string> => {
  let accountNumber;
  let exists = true;

  while (exists) {
    accountNumber = generateRandomAccountNumber();
    const wallet = await DB("wallets").where({ account_number: accountNumber }).first();
    if (!wallet) {
      exists = false;
    }
  }

  return accountNumber!;
};
