import { Request, Response } from "express";
import { checkBlacklist } from "../services/Karmablacklist";
import { hashPassword, comparePassword } from '../utils/password_hash';
import DB from "../config/db";
import { AuthHelper } from "../middlewares/Authenticator";
import { Validator } from "../utils/validator";
import { WalletServices } from "../services/walletService";


export abstract class AuthController {
  public static registerUser = async (req: Request, res: Response) => {
    
    const { email, password, firstName, lastName, phone, bvn } = req.body;

    try {

        if (!email || !password || !firstName || !lastName || !bvn) {
          return res.status(400).json({ success: false, message: 'All fields are required!' });
        }
        // Validate email format
        if (Validator.isEmailValid(email)) return res.status(400).json({ success: false, message: 'Invalid email format!' });
        // Validate phone number format
        if(Validator.isPhoneNumberValid(phone)) return res.status(400).json({ success: false, message: 'Invalid phone number format!' });
        // Validate BVN format
        if(Validator.isBvnValid(bvn)) return res.status(400).json({ success: false, message: 'Invalid BVN format!' });

        // Check if email exists
        if(await Validator.checkEmailExist(email)) return res.status(400).json({ success: false, message: 'Email is already in use!' });
        // Check if phone number exists
        if(await Validator.checkPhoneExist(phone)) return res.status(400).json({ success: false, message: 'Phone number is already in use!' });
        // Check if BVN exists
        if(await Validator.checkBvnExist(bvn)) return res.status(400).json({ success: false, message: 'BVN is already in use!' });

        // Check if the user is blacklisted
        // const blacklisted = await checkBlacklist(bvn);

        // hash user password
        const hashedPassword = await hashPassword(password);

        // register user
        await DB('users').insert({
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          bvn,
        })
        // Create a wallet for the user
        const user = await DB('users').where({ email }).first()
        await WalletServices.createWallet(user.id);
        
        // Authenticate user
        const token = AuthHelper.signJwt({user: { id: user.id, email: user.email }})
        return res.status(201).json({ success: true, message:"User registered successfully", token });
  
    } catch (error: any) {
      console.log(error)
      res.status(400).json({ error: error.message });
    }
  };

  public static loginUser = async (req: Request, res: Response) => {

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required!' });
    }
    // Check if user exists
    const user = await DB('users').where({ email }).first();
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }
    
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }
    
    // Authenticate user
    const token = AuthHelper.signJwt({user: { id: user.id, email: user.email }})
    return res.status(200).json({ success: true, 
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      }
      , token });
  };
}

