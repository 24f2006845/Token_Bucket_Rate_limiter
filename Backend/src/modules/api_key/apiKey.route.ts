import {Router} from "express";
import { deleteApiKeyController, generateApiKeyController, getApiKeysController } from "./apiKey.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createApiKeySchema, deleteApiKeySchema } from "./apiKey.validation.js";


const router = Router();

router.post("/generate", authMiddleware, validate(createApiKeySchema), generateApiKeyController);
router.get("/getapiKey", authMiddleware, getApiKeysController);
router.delete("/delete", authMiddleware, validate(deleteApiKeySchema), deleteApiKeyController );



export default router;
