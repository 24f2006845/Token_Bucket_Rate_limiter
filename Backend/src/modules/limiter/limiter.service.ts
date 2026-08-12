import { AppError } from "../../utils/AppError.js";
import prisma from "../../config/db.js";
import { consumeTokenAtomically } from "./tokenBucket.js";

export const LimiterCheckService = async (apikeyId: string, policy: string) => {
    try{
        const policydata = await prisma.policy.findFirst({
            where: {
                apiKeyId: apikeyId,
                name: policy
            },
            select:{
                id: true,
                name: true,
                algorithm: true,
                capacity: true,
                refillRate: true,
                interval: true,
            }
        });

        if(!policydata){
            throw new AppError("Policy nott found", 404);
        }
        if (policydata.algorithm !== "TOKEN_BUCKET") {
            throw new AppError("This policy algorithm is not implemented", 400);
        }

        const processedBucket = await consumeTokenAtomically(
            `tokenBucket:{${apikeyId}}:${policydata.id}`,
            policydata,
        );
        if (!processedBucket.allowed) {
            throw new AppError("Rate limit exceeded", 429, processedBucket.retryAfter);
        }
        return processedBucket;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Internal server error", 500);
    }
}
