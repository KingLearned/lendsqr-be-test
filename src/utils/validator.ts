import { Request, Response, NextFunction, response } from 'express'
import DB from '../config/db';

export abstract class Validator {

    public static isEmailValid( email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return true
        }
        return false;
    }

    public static isPhoneNumberValid(phone: string) {
        const phoneRegex = /^\d{11}$/;
        if (!phoneRegex.test(phone)) {
            return true
        }
        return false;
    }

    public static isBvnValid(bvn: string) {
        const bvnRegex = /^\d{11}$/;
        if (!bvnRegex.test(bvn)) {
            return true
        }
        return false;
    }

    public static async checkBvnExist(bvn: string)  {
        const exist = await DB('users').where({ bvn }).first();
        if (exist) {
            return true; 
        }
        return false
    }

    public static async checkEmailExist(email: string) {
        const exist = await DB('users').where({ email }).first();
        if (exist) {
            return true; 
        }
        return false
    }

    public static async checkPhoneExist(phone: string) {
        const exist = await DB('users').where({ phone }).first();
        if (exist) {
            return true; 
        }
        return false
    }


}