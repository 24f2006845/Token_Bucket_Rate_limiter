import express from "express";
import { LoginController, RegisterController } from "./auth.controller.js";
import { validateLogin, validateRegister } from "./auth.validation.js";

const router = express.Router();

router.post("/register", validateRegister, RegisterController);
router.post("/login", validateLogin, LoginController);

export default router;