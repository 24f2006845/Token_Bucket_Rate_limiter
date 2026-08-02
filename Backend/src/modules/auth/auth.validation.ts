import * as z from "zod";
import { AppError } from "../../utils/AppError.js";


    export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string()
    });

    export const registerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z]).+$/, { message: "Password must be at least 8 characters long and contain at least one uppercase and one lowercase letter" }),
    });

    const validateSchema = (schema: z.ZodSchema<any>) => {
    return (req: any, res: any, next: any) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map((err) => err.message);
                return res.status(400).json({ message: errorMessages.join(", ") });
            }
            next(error);
        }
    };
    };

    export const validateLogin = validateSchema(loginSchema);
    export const validateRegister = validateSchema(registerSchema);

    