import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = verifyAccessToken(token); 
        req.user = { userId: decoded.userId, role: decoded.role };

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(401).json({ success: false, message: error.message });
        }
        return res.status(401).json({ success: false, message: "Invalid token" });
    }   


}