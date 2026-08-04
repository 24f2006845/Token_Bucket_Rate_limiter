import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError.js";
import { getPolicyService, getPolicyByIdService  } from "./policy.service.js";


export const getAllPolicies = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.user?.userId

        const userPolicies =  await getPolicyService(userId as string);
        res.status(200).json({ success: true, data: userPolicies });
    }catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getPolicyById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {policyId} = req.params;
        const userId = req.user?.userId
        const policy = await getPolicyByIdService(policyId as string, userId as string);
        if (!policy) {
            throw new AppError("Policy not found", 404);
        }
        res.status(200).json({ success: true, data: policy });
    }catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


