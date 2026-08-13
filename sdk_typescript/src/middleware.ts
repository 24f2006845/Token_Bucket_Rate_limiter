import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { RateLimiter } from "./limiter.js";

/** Create Express middleware that enforces a named rate-limit policy. */
export function rateLimit(limiter: RateLimiter, policy: string): RequestHandler {
  return async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await limiter.check(policy);

      if (result.allowed) {
        res.set({
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": String(result.remainingTokens),
        });
        next();
        return;
      }

      if (result.retryAfter !== undefined) {
        res.set("Retry-After", String(result.retryAfter));
      }
      res.status(429).json({
        success: false,
        message: "Too many requests.",
        retryAfter: result.retryAfter,
      });
    } catch (error) {
      next(error);
    }
  };
}
