import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = verifyAccessToken(token); 
        if (decoded.role !== "ADMIN") {
            throw new AppError("Unauthorized access", 403);
        }
        req.user = { userId: decoded.userId, role: decoded.role };

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        return res.status(401).json({ success: false, message: "Invalid token" });
    }   
}