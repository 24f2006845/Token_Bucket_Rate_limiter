import prisma from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
export const getAllUsers = async () => {
    return prisma.user.findMany({
        where: { role: "USER" },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
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
    const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    return prisma.$transaction(async (tx) => {
        if (nextStatus === "SUSPENDED") {
            await tx.apiKey.updateMany({
                where: { userId },
                data: { status: "REVOKED" },
            });
        }
        return tx.user.update({
            where: { id: userId },
            data: {
                status: nextStatus,
                ...(nextStatus === "SUSPENDED" ? { refreshToken: null } : {}),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    });
};

export const getUserApiKeys = async (userId: string) => {
    return prisma.apiKey.findMany({
        where: { userId },
        select: {
            id: true,
            name: true,
            status: true,
            lastUsedAt: true,
            createdAt: true,
            updatedAt: true,
        },
    });
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
