import express from "express";
import { getMeController, LoginController, LogoutController, RegisterController,refreshTokenController } from "./auth.controller.js";
import { validateLogin, validateRegister } from "./auth.validation.js";

const router = express.Router();

router.post("/register", validateRegister, RegisterController);
router.post("/login", validateLogin, LoginController);
router.post("/logout", LogoutController);
router.get("/me", getMeController);
router.get("/refresh-token", refreshTokenController);

export default router;