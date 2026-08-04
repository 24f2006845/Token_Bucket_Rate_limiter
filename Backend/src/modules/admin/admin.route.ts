import express from 'express';
import { adminMiddleware } from '../../middlewares/role.middleware.js';
import { getAllUserController, getUserByIdController, updateUserStatusController, getUserApiKeysController, deleteApiKeyController } from './admin.controller.js';

const router = express.Router();

router.get('/users', adminMiddleware, getAllUserController)
router.get('/users/:id', adminMiddleware, getUserByIdController)
router.patch('/users/:id/status', adminMiddleware, updateUserStatusController)
router.get('/users/:id/api-keys', adminMiddleware, getUserApiKeysController)
router.delete('/api-keys/:id', adminMiddleware, deleteApiKeyController  )
export default router;