import type { Request, Response , NextFunction } from "express";
import { AppError } from "../../utils/AppError.js";
import { LimiterCheckService } from "./limiter.service.js";
export const LimiterCheckController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const apikeyId = req.apiKey?.id
        const {policy} = req.body
        if (!policy){
            return next(new AppError("Policy not found", 404))
        }
        const limiterCheckService = LimiterCheckService(apikeyId as string, policy)

        const response  = {
            status: "success",
            message: "Rate limit check successful",
            data: limiterCheckService
        }
        return res.status(200).json(response)

    }catch(error){
        if (error instanceof AppError) {
            return next(error);
        }
        return next(new AppError("Internal server error", 500)); 
    }
}