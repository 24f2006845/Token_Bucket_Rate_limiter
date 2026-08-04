import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getAllPolicies,getPolicyById } from "./policy.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { policyIdSchema, updatePolicySchema, syncPolicySchema ,deletePolicySchema, } from "./policy.validation.js";

const router = Router();

router.get("/", authMiddleware, getAllPolicies);
router.get("/:id", authMiddleware ,validate(policyIdSchema),getPolicyById);
router.patch("/update/:id", authMiddleware, validate(updatePolicySchema));
router.delete("/delete/:id", authMiddleware, validate(deletePolicySchema));
router.post("/sync", authMiddleware, validate(syncPolicySchema));

export default router;