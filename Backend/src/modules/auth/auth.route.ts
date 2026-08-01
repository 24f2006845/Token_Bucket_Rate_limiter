import express from "express";
import { LoginController, RegisterController } from "./auth.controller.js";

const router = express.Router();

router.post("/register", RegisterController);
router.post("/login", LoginController);

export default router;