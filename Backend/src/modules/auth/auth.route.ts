import express from "express";
import { getMeController, LoginController, LogoutController, RegisterController,refreshTokenController } from "./auth.controller.js";
import { validateLogin, validateRegister } from "./auth.validation.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validateRegister, RegisterController);
router.post("/login", validateLogin, LoginController);
router.post("/logout", authMiddleware, LogoutController);
router.get("/me", authMiddleware, getMeController);
router.get("/refresh-token", refreshTokenController);

export default router;
