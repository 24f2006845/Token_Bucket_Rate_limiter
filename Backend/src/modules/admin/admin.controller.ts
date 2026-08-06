import type { Request, Response ,NextFunction} from 'express';
import { getAllUsers, getUserById, updateUserStatus, getUserApiKeys, deleteApiKey } from './admin.service.js';

export const getAllUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id as string;
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserStatusController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id as string;
    const updatedUser = await updateUserStatus(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getUserApiKeysController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id as string;
    const apiKeys = await getUserApiKeys(userId);
    res.status(200).json(apiKeys);
  } catch (error) {
    next(error);
  }
};

export const deleteApiKeyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKeyId = req.params.id as string;
    await deleteApiKey(apiKeyId);
    res.status(200).json({ message: 'API key deleted successfully' });
  } catch (error) {
    next(error);
  }
};
