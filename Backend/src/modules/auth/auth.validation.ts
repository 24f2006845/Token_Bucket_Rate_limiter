import type { NextFunction, Request, RequestHandler, Response } from "express";
import * as z from "zod";
import { AppError } from "../../utils/AppError.js";

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z]).+$/, {
            message:
                "Password must be at least 8 characters long and contain at least one uppercase and one lowercase letter",
        }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

const validateSchema = <T extends z.ZodTypeAny>(schema: T): RequestHandler<{}, any, z.infer<T>> => {
    return (req: Request<{}, any, z.infer<T>>, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const issues: z.ZodIssue[] = result.error.issues;
            return next(new AppError(issues.map((issue: z.ZodIssue) => issue.message).join(", "), 400));
        }

        req.body = result.data;
        next();
    };
};

export const validateLogin = validateSchema(loginSchema);
export const validateRegister = validateSchema(registerSchema);

    