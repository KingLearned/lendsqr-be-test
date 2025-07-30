import axios from "axios";
import { LENDSQR_API_TOKEN } from "../config/env";

export const checkBlacklist = async (bvn:string) => {

    // Check if the user is blacklisted on Karma API
    try {
        const { data } = await axios.get(`https://api.lendsqr.com/karma/${bvn}`, {
            headers: {
                Authorization: `Bearer ${LENDSQR_API_TOKEN}`,
            },
        });
        if (data.blacklisted) {
            throw new Error("User is blacklisted");
        }
        
    } catch (error: any) {
        console.error("Error checking blacklist:", error.message);
        throw new Error("Failed to check blacklist status");
    }

    return true
}
