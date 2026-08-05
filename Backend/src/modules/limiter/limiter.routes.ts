import { Router } from "express";
import { validateApiKeyMiddleware } from "../../middlewares/apiKeyMiddleware.js";
import { LimiterCheckController } from "./limiter.controller.js";
import { LimiterCheckSchema } from "./limiter.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

router.post("/check",validateApiKeyMiddleware, validate(LimiterCheckSchema), LimiterCheckController);

export default router;