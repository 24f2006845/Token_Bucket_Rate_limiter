import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getAllPolicies,getPolicyById,deletePolicyController ,syncPolicyController} from "./policy.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { policyIdSchema, updatePolicySchema, syncPolicySchema ,deletePolicySchema, } from "./policy.validation.js";
import { validateApiKeyMiddleware } from "../../middlewares/apiKeyMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getAllPolicies);
router.get("/:id", authMiddleware ,validate(policyIdSchema),getPolicyById);
router.delete("/delete/:id", authMiddleware, validate(deletePolicySchema), deletePolicyController);
router.post("/sync", validate(syncPolicySchema),validateApiKeyMiddleware, syncPolicyController);

export default router;