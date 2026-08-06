import { z } from "zod";

export const createApiKeySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(100),
  }),
});

export const deleteApiKeySchema = z.object({
  body: z.object({
    apiKeyId: z.string().uuid(),
  }),
});
