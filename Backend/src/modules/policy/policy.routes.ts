import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getAllPolicies,getPolicyById } from "./policy.controller.js";
import { get } from "node:http";

const router = Router();

router.get("/", authMiddleware, getAllPolicies);
router.get("/:id", authMiddleware ,getPolicyById);
router.patch("/:id", authMiddleware )
router.delete("/:id", authMiddleware )
router.post("/sync", authMiddleware )

export default router;