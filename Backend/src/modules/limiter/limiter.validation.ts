import {z } from "zod";

export const LimiterCheckSchema = z.object({
    body: z.object({
        policy: z.string(),
    }),
})

export type LimiterCheckSchemaType = z.infer<typeof LimiterCheckSchema>;
