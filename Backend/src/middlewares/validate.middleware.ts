import { z } from 'zod';
import type{ Request, Response, NextFunction } from 'express';
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
    });
    if (!result.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: result.error.flatten() });
    }
    next();
  };
};