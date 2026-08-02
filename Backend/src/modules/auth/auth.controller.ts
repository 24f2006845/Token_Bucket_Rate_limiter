import type { NextFunction, Request, Response } from "express";
import { loginService, registerService,LogoutService , getMeService,refreshTokenService} from "./auth.service.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";
import type { LoginResponse,RegisterResponse } from "./auth.types.js";

export const LoginController = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Call the login service
    const data = await loginService(email, password);
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "strict", // Adjust based on your requirements
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return the tokens in the response
    const response: LoginResponse = data;
    return res.status(200).json({
      success: true,
      data: {
        accessToken: response.accessToken,
        user: response.user
      },
      message: "Login successful"
    });
  } catch (error) {
    next(error);
  }
};

export const RegisterController = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    // Call the register service
    const { userId } = await registerService(name, email, password);

    // Return the userId in the response
    const response: RegisterResponse = { userId };
    return res.status(201).json({ success: true, data: response, message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const LogoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.userId; // Assuming you have the userId in the request body

    // Call the logout service
    const data = await LogoutService(userId);

    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "strict", // Adjust based on your requirements
    });

    return res.status(200).json({ success: true, data, message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.userId; 

    // Call the getMe service
    const data = await getMeService(userId);

    return res.status(200).json({ success: true, data, message: "User details fetched successfully" });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken; // Assuming the refresh token is stored in a cookie

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Refresh token not provided" });
    }

    // Call the refresh token service
    const data = await refreshTokenService(refreshToken);
    const {accessToken} = data;

    return res.status(200).json({ success: true, data: { accessToken }, message: "Access token refreshed successfully" });
  } catch (error) {
    next(error);
  }
};