import jwt from "jsonwebtoken";
import type { Role } from "../generated/prisma/browser.js";
import type { JwtPayload } from "../types/jwt.types.js";
import { AppError } from "./AppError.js";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

if (!accessTokenSecret || !refreshTokenSecret) {
  throw new Error("ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be configured");
}

export const genrateAccessToken = (JwtPayload: JwtPayload) => {
  return jwt.sign({ userId: JwtPayload.id, role: JwtPayload.role }, accessTokenSecret, {
    expiresIn: "15m",
  });
};

export const genrateRefreshToken = (JwtPayload: JwtPayload) => {
  return jwt.sign({ userId: JwtPayload.id }, refreshTokenSecret, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, accessTokenSecret) as { userId: string, role: Role };
        return decoded
    } catch (error) {
        throw new AppError("Invalid access token", 401  );
    }
}

export const verifyRefreshToken = (token: string) => {
    try {
      const decoded = jwt.verify(token, refreshTokenSecret) as { userId: string };
      return decoded
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }
}
