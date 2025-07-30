import dotenv from "dotenv";
dotenv.config();


export const PORT = process.env.PORT || 3000;
export const BASE_URL = process.env.BASE_URL || "";
export const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

export const LENDSQR_API_TOKEN = process.env.LENDSQR_API_TOKEN
export const DB_URL = process.env.DB_URL
export const CLIENT = process.env.CLIENT
export const DB_HOST = process.env.DB_HOST
export const DB_PASS = process.env.DB_PASS
export const DB_PORT = process.env.DB_PORT
export const DB_NAME = process.env.DB_NAME
