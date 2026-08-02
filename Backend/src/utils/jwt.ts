import jwt from "jsonwebtoken";
import type { Role } from "../generated/prisma/browser.js";
import type { JwtPayload } from "../types/jwt.types.js";

export const genrateAccessToken = (JwtPayload: JwtPayload) => {
  return jwt.sign({ userId: JwtPayload.id, role: JwtPayload.role }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};

export const genrateRefreshToken = (JwtPayload: JwtPayload) => {
  return jwt.sign({ userId: JwtPayload.id }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    } catch (error) {
        throw new Error("Invalid access token");
    }
}

export const verifyRefreshToken = (token: string) => {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as { userId: string };
      return decoded
    } catch (error) {
        throw new Error("Invalid refresh token");
    }
}   