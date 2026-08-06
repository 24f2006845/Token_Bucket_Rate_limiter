import { AppError } from "../../utils/AppError.js";
import prisma from "../../config/db.js";
import redis from "../../config/redis.js";
import { TokenBucketService } from "./tokenBucket.js";

export const LimiterCheckService = async (apikeyId: string, policy: string) => {
    try{
        const policydata = await prisma.policy.findUnique({
            where: {
                id: policy
            },
            select:{
                id: true,
                name: true,
                capacity: true,
                refillRate: true,
                interval: true,
            }
        });

        if(!policydata){
            throw new AppError("Policy not found", 404);
        }
        let Bucket = await redis.get(`tokenBucket:${apikeyId}:${policydata.id}`);

        if (!Bucket) {
            const tokenBucket = {
                tokens: policydata.capacity,
                lastRefill: Math.floor(Date.now() / 1000),
            };
            await redis.set(`tokenBucket:${apikeyId}:${policydata.id}`, JSON.stringify(tokenBucket));
            Bucket = JSON.stringify(tokenBucket);
        } 
        const processedBucket = TokenBucketService(JSON.parse(Bucket), policydata);
        if (!processedBucket.allowed) {
            throw new AppError(`Rate limit exceeded. Retry after ${processedBucket.retryAfter} seconds`, 429);
        }
        await redis.set(`tokenBucket:${apikeyId}:${policydata.id}`, JSON.stringify(processedBucket.bucket));
        return processedBucket;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Internal server error", 500);
    }
}