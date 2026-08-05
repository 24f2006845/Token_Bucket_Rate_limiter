import { AppError } from "../../utils/AppError.js";
import prisma from "../../config/db.js";
import redis from "../../config/redis.js";

export const LimiterCheckService = async (apikeyId: string, policy: string) => {
    try{
        const policydata = await prisma.policy.findUnique({
            where: {
                id: policy
            }
        });

        if(!policydata){
            throw new AppError("Policy not found", 404);
        }
        return policydata;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Internal server error", 500);
    }
}