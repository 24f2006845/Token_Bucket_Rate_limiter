
import { AppError } from "../../utils/AppError.js";
import prisma from "../../config/db.js";
import crypto from "crypto";


export const generateApiKeyService = async (userId: string, name: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        const apiKey = crypto.randomBytes(32).toString("hex");
        const hashedApiKey = crypto.createHash("sha256").update(apiKey).digest("hex");

        const newApiKey = await prisma.apiKey.create({
            data: {
                userId: userId,
                name: name,
                keyHash: hashedApiKey
            }
        });

        return apiKey; 


    }
    catch (error) {
        if (error instanceof AppError) {
            throw error; // Re-throw the AppError to be handled by the error handler middleware
        }
        throw new AppError("Internal server error", 500);
    }
}

export const getApiKeysService = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        const apiKeys = await prisma.apiKey.findMany({
            where: { userId: userId },
            select: {
                id: true,
                name: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return apiKeys;
    } catch (error) {
        if (error instanceof AppError) {
            throw error; // Re-throw the AppError to be handled by the error handler middleware
        }
        throw new AppError("Internal server error", 500);
    }
};

export const deleteApiKeyService = async (userId: string, apiKeyId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        const apiKey = await prisma.apiKey.findUnique({
            where: { id: apiKeyId }
        });

        if (!apiKey || apiKey.userId !== userId) {
            throw new AppError("API key not found or does not belong to the user", 404);
        }
        await prisma.apiKey.update({
            where: { id: apiKeyId },
            data: { status: "REVOKED" }
        })

        return { message: "API key deleted successfully" };
    } catch (error) {
        if (error instanceof AppError) {
            throw error; 
        }
        throw new AppError("Internal server error", 500);
    }
};


