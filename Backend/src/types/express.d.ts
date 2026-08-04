import { Role } from "@prisma/client";

    declare global {
    namespace Express {
        interface Request {
        user?: {
            userId: string;
            role: Role;
        };
        apiKey?: {
            id: string;
            userId: string;
        }
        }
    }
    }

export {};