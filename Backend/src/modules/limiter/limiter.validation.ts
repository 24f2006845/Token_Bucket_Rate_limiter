import {z } from "zod";

export const LimiterCheckSchema = z.object({
    body: z.object({
        policy: z.string().uuid({ message: "A valid policy ID is required" }),
    }),
})

export type LimiterCheckSchemaType = z.infer<typeof LimiterCheckSchema>;
