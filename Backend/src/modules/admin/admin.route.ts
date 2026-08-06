import express from 'express';
import { adminMiddleware } from '../../middlewares/role.middleware.js';
import { getAllUserController, getUserByIdController, updateUserStatusController, getUserApiKeysController, deleteApiKeyController } from './admin.controller.js';
import { validate } from "../../middlewares/validate.middleware.js";
import { idParamSchema } from "./admin.validation.js";

const router = express.Router();

router.get('/users', adminMiddleware, getAllUserController)
router.get('/users/:id', adminMiddleware, validate(idParamSchema), getUserByIdController)
router.patch('/users/:id/status', adminMiddleware, validate(idParamSchema), updateUserStatusController)
router.get('/users/:id/api-keys', adminMiddleware, validate(idParamSchema), getUserApiKeysController)
router.delete('/api-keys/:id', adminMiddleware, validate(idParamSchema), deleteApiKeyController)
export default router;
