import prisma from "../../config/db.js";
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