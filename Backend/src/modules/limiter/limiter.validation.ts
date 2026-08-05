import {z } from "zod";

export const LimiterCheckSchema = z.object({
    policy: z.string().min(1, { message: "Policy is required" }),
})

export type LimiterCheckSchemaType = z.infer<typeof LimiterCheckSchema>;
