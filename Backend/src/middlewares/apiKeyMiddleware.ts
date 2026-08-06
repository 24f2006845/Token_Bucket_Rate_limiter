import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import crypto from "crypto";
import { validateApiKeyService } from "../modules/policy/policy.service.js";

export const validateApiKeyMiddleware = async (req: Request, res: Response, next: NextFunction) =>  {
    const apiKey = req.get('x-api-key') as string;
     if (!apiKey) {
        return next(new AppError("API key is missing", 400));
    }
    const hashedApiKey = crypto.createHash('sha256').update(apiKey).digest('hex');

    try {
      const validatedApiKey = await validateApiKeyService(hashedApiKey);

      if (!validatedApiKey) {
          return next(new AppError("Invalid API key", 401));
      }

      req.apiKey = {
          id: validatedApiKey.id,
          userId: validatedApiKey.userId
      };

      return next();
    } catch (error) {
      return next(error);
    }
};

    
