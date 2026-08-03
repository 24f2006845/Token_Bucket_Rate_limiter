import prisma from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
export const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    if (!users) {
        throw new AppError("No users found", 404);
    }
    return users;
};

export const getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return user;
};

export const updateUserStatus = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" },
    });
    return updatedUser;
};

export const getUserApiKeys = async (userId: string) => {
    const apiKeys = await prisma.apiKey.findMany({
        where: { userId },
    });
    if (!apiKeys) {
        throw new AppError("No API keys found for this user", 404);
    }
    return apiKeys;
};

export const deleteApiKey = async (apiKeyId: string) => {
    const apiKey = await prisma.apiKey.findUnique({
        where: { id: apiKeyId },
    });
    if (!apiKey) {
        throw new AppError("API key not found", 404);
    }
    await prisma.apiKey.update({
        where: { id: apiKeyId },
        data: { status: "REVOKED"},
    });
};