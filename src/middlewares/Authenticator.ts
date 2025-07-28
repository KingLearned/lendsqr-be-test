import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import DB from "../config/db";
import { Request, Response, NextFunction } from 'express'

dotenv.config();

export abstract class AuthHelper {

    public static signJwt = (payload: Object) => {
    
        return jwt.sign(payload, process.env.PRIVATE_KEY as string, {
        expiresIn: "744h",
        });
    }   

    public static verifyJwt = <T>(token: string): T | null => {
        try {
            return jwt.verify(token, process.env.PRIVATE_KEY as string) as T;
        } catch (error) {
            return null;
        }
    };

    public static AuthenticateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the token
            let access_token;

            if (!req.headers.authorization) {
                return res.status(401).json({ success: false, message: 'Authorization header is required!' })
            }
            
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")
            ) {
                access_token = req.headers.authorization.split(" ")[1];
            } else if (req.cookies.access_token) {
                access_token = req.cookies.access_token;
            }
            // If no access token is provided
            if (!access_token) {
                return res.status(401).json({ success: false, message: 'Access token is required!' });
            }
            // Validate Access Token
            const decoded = this.verifyJwt<{ user: { id: string, email: string } }>(access_token);
            if (!decoded) {
                return res.status(401).json({ success: false, message: 'Invalid access token!' });
            }

            // Set user in request
            res.locals.user = decoded;

            next();

        } catch (err: any) {
            next(err);
        }
    };
}