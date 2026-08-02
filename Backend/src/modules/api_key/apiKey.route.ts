import {Router} from "express";
import { deleteApiKeyController, generateApiKeyController, getApiKeysController } from "./apiKey.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";


const router = Router();

router.post("/generate", authMiddleware, generateApiKeyController);
router.get("/getapiKey", authMiddleware, getApiKeysController);
router.delete("/delete", authMiddleware, deleteApiKeyController );



export default router;