import prisma from "../../config/db.js";
import type { SyncPolicyBody } from "./policy.validation.js";

export const getPolicyService = async (userId: string) => {
    const userPolicies = await prisma.policy.findMany({
        where: {
            apiKey: {
                userId: userId
            }
        }
    });
    return userPolicies;    
};

export const getPolicyByIdService = async (policyId: string, userId: string) => {
    const policy = await prisma.policy.findFirst({
        where: {
            id: policyId,
            apiKey: {
                userId: userId
            }
        }
    });
    return policy;
};


export const deletePolicyService = async (policyId: string, userId: string) => {
    const deletedPolicy = await prisma.policy.deleteMany({
        where: {
            id: policyId,
            apiKey: {
                userId: userId
            }
        }
    });
    if (deletedPolicy.count === 0) {
        return null; // No policy was deleted, return null to indicate not found
    } 
    return deletedPolicy;
};

export const syncPolicyService = async (
    apiKeyId: string,
    policies: any[]
) => {

    for (const policy of policies) {

        await prisma.policy.upsert({
            where: {
                apiKeyId_name: {
                    apiKeyId,
                    name: policy.name,
                },
            },
            update: {
                capacity: policy.capacity,
                refillRate: policy.refillRate,
                interval: policy.interval,
            },
            create: {
                apiKeyId,
                name: policy.name,
                capacity: policy.capacity,
                refillRate: policy.refillRate,
                interval: policy.interval,
            },
        });

    }

    return {
        synced: policies.length,
    };
};

export const validateApiKeyService = async (hashedApiKey: string) => {
    const apiKey = await prisma.apiKey.findUnique({
        where: {
            keyHash: hashedApiKey
        },
        include: {
            user: {
                select: { status: true },
            },
        },
    });
    if (!apiKey || apiKey.status !== "ACTIVE" || apiKey.user.status !== "ACTIVE") {
        return null;
    }
    return apiKey;
};

