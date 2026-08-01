import type { Request, Response } from "express";
import { loginService, registerService } from "./auth.service.js";
export const LoginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Call the login service
    const { accessToken, refreshToken } = await loginService(email, password);

    // Return the tokens in the response
    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const RegisterController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Call the register service
    const { userId } = await registerService(name, email, password);

    // Return the userId in the response
    return res.status(201).json({ userId });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};