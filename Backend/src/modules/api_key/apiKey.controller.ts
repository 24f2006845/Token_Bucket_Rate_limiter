import type { Request, Response, NextFunction } from "express";
import { deleteApiKeyService, generateApiKeyService,getApiKeysService  } from "./apiKey.service.js";

export const generateApiKeyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.userId; 
    const name = req.body.name;
    const apiKey = await generateApiKeyService(userId,name); 

    return res.status(201).json({ success: true, data: { apiKey }, message: "API key generated successfully" });
  } catch (error) {
    next(error);
  }
};

export const getApiKeysController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.userId; 
    const apiKeys = await getApiKeysService(userId);

    return res.status(200).json({ success: true, data: { apiKeys }, message: "API keys retrieved successfully" });
  } catch (error) {
    next(error);
  }
};
export const deleteApiKeyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.userId; 
    const apiKeyId = req.body.apiKeyId; 
    const result = await deleteApiKeyService(userId, apiKeyId);

    return res.status(200).json({ success: true, data: result, message: "API key deleted successfully" });
  } catch (error) {
    next(error);
  }
}