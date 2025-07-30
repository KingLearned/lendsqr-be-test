import DB from "../config/db";
import { generateUniqueAccountNumber } from "../utils/generateAccountNumber";

export default abstract class WalletServices {

  // Create a wallet for a user
  public static createWallet = async (userId: number) => {
    try {
      
      const accountNumber = await generateUniqueAccountNumber();

      const [wallet] = await DB("wallets").insert(
        {
          user_id: userId,
          account_number: accountNumber,
        },
        ["id", "user_id", "account_number", "balance"]
      );

    } catch (error:any) {
      console.log(error)
      throw new Error("Error creating wallet: " + error.message);
    }
  };

  // Get user's wallet balance
  public static async returnbalance(userId: number) {
    const balance = await DB("wallets").where("user_id", userId).select("balance").first();
    return `NGN${Number(balance.balance).toLocaleString()}`;
  }

  // Fund a user's wallet
  public static fundUserWallet = async (userId: number, amount: number) => {
    try {
      
      if (amount <= 0) throw new Error("Amount must be greater than 0");

      await DB("wallets").where("user_id", userId).increment("balance", amount);
    
      await DB("transactions").insert({
        sender_id: null,
        receiver_id: userId,
        amount,
        type: "fund",
      });

      const balance = await DB("wallets").where("user_id", userId).select("balance").first()
      return balance 

    } catch (error:any) {
      throw new Error("Error funding wallet: " + error.message);
    }
  };

  // Transfer funds to another user
  public static transferFunds = async (
    senderId: number,
    accountNumber: number,
    amount: number
  ) => {

    try {
      
      if (amount <= 0) throw new Error("Amount must be greater than 0");

      const receiver = await DB("wallets").where("account_number", accountNumber).first();
      if (!receiver) throw new Error("No receiver with provided account number found");

      const isUserAccount = await DB("wallets").where({account_number: accountNumber, user_id: senderId}).first();
      if (isUserAccount) throw new Error("You cannot transfer to your own account");

      return await DB.transaction(async (trx) => {
        const sender = await trx("wallets").where("user_id", senderId).first();
        const receiver = await trx("wallets").where("account_number", accountNumber).first();
    
        if (sender.balance < amount) throw new Error("Insufficient balance");
    
        await trx("wallets").where("user_id", senderId).decrement("balance", amount);
        await trx("wallets").where("account_number", accountNumber).increment("balance", amount);
    
        await trx("transactions").insert({
          sender_id: senderId,
          receiver_id: receiver.user_id,
          amount,
          type: "transfer",
        });

        return { message: "Transfer successful", amount:`NGN${amount.toLocaleString()}` };

      });
    } catch (error:any) {
      throw new Error("Error transferring funds: " + error.message);
    }
  };

  // Withdraw funds from a user's wallet
  public static withdrawFunds = async (userId: number, amount: number) => {
    if (amount <= 0) throw new Error("Amount must be greater than 0");
  
    const wallet = await DB("wallets").where("user_id", userId).first();
  
    if (!wallet || wallet.balance < amount) {
      throw new Error("Insufficient balance");
    }
  
    await DB("wallets").where("user_id", userId).decrement("balance", amount);
  
    await DB("transactions").insert({
      sender_id: userId,
      receiver_id: null,
      amount,
      type: "withdraw",
    });
  
    return { message: "Withdrawal successful", amount:`NGN${amount.toLocaleString()}` };
  };

  // Get user's Transaction history
  public static getUserTransactions = async (userId: number) => { 
    try {
      const transactions = await DB("transactions")
        .where("sender_id", userId)
        .orWhere("receiver_id", userId)
        .select("id", "sender_id", "receiver_id", "amount", "type", "created_at").orderBy("created_at", "desc");

      return transactions;
    } catch (error:any) {
      throw new Error("Error fetching transactions: " + error.message);
    }
  }
}
