import { Request, Response } from "express";
import { WalletServices } from "../services/walletService";
import { userInfo } from "os";
import DB from "../config/db";


export abstract class UserController {

  // Get all users with their wallet info
  public static getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await DB("users")
              .join("wallets", "users.id", "wallets.user_id")
              .select(
                "users.firstname",
                "users.lastname",
                "users.phone",
                "wallets.account_number",
              );

      res.status(200).json({success: true, message:"Users fetched successfully", data: users});

    } catch (error: any) {
      console.error("Error fetching user wallet info:", error);
      throw new Error("Could not fetch user wallet info: " + error.message);
    }
  };

  // Get user details with wallet info
  public static getUserDetails = async (req: Request, res: Response) => {
    try {
      const { user } = res.locals.user

      const userData = await DB("users")
        .where("id", user.id)
        .select("id", "firstname", "lastname", "phone", "bvn", "email")
        .first();

      const wallet = await DB("wallets")
        .where("user_id", user.id)
        .select("account_number", "balance")
        .first();

      res.status(200).json({success: true, message:"Details fetched successfully", data: 
        {
        id: userData.id,
        name: `${userData.firstname} ${userData.lastname}`,
        email: userData.email,
        bvn: userData.bvn,
        phone: userData.phone,
        account_number: wallet.account_number,
        balance: `NGN${Number(wallet.balance).toLocaleString()}`,
      }});

    } catch (error: any) {
      console.error("Error fetching user wallet info:", error);
      throw new Error("Could not fetch user wallet info: " + error.message);
    }
  };

  // Fund user's wallet
  public static fundWallet = async (req: Request, res: Response) => {
    try {
      const { user } = res.locals.user // Get user Id from res.locals set in AuthHelper.AuthenticateUser

      const result = await WalletServices.fundUserWallet(user.id, req.body.amount);
      res.status(200).json({ message: "Wallet funded successfully", amount: `NGN${req.body.amount.toLocaleString()}`, balance: `NGN${Number(result.balance).toLocaleString()}` });
    } catch (err: any) {
      console.log(err)
      res.status(400).json({ error: err.message });
    }
  };

  // Transfer funds to another user
  public static transferFunds = async (req: Request, res: Response) => {
    const { user } = res.locals.user // Get user Id from res.locals set in AuthHelper.AuthenticateUser

    try {
      const result = await WalletServices.transferFunds(user.id, req.body.account_number, req.body.amount);
      res.status(200).json({...result, balance: await WalletServices.returnbalance(user.id)});
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }

  };

  // Withdraw funds from user's wallet
  public static withdrawFunds = async (req: Request, res: Response) => {
    const { user } = res.locals.user // Get user Id from res.locals set in AuthHelper.AuthenticateUser

    try {
      const result = await WalletServices.withdrawFunds(user.id, req.body.amount);
      res.status(200).json({...result, balance: await WalletServices.returnbalance(user.id)});
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  // Get user's transaction history
  public static getTransactionHistory = async (req: Request, res: Response) => {
    const { user } = res.locals.user // Get user Id from res.locals set in AuthHelper.AuthenticateUser

    try {
      const transactions = await WalletServices.getUserTransactions(user.id);
      if (!transactions) {
        return res.status(404).json({ success: false, message: "No transactions found" });
      }
      res.status(200).json({ success: true, message: "Transaction history fetched successfully", transactions });
    } catch (error: any) {
      console.error("Error fetching transaction history:", error);
      res.status(500).json({ success: false, message: "Could not fetch transaction history" });
    }
  }

}


