import { z } from "zod";

export const syncPolicySchema = z.object({
  body: z.object({
    policies: z.array(
      z.object({
        name: z.string().min(1, "Policy name is required"),
        capacity: z.number().int().positive(),
        refillRate: z.number().int().positive(),
        interval: z.number().int().positive(),
      })
    ).min(1, "At least one policy is required"),
  }),
});

export type SyncPolicyBody =
  z.infer<typeof syncPolicySchema>["body"];


export const updatePolicySchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid policy ID"),
  }),
  body: z.object({
    capacity: z.number().int().positive().optional(),
    refillRate: z.number().int().positive().optional(),
    interval: z.number().int().positive().optional(),
  }),
});

export type UpdatePolicyBody =
  z.infer<typeof updatePolicySchema>["body"];

export type UpdatePolicyParams =
  z.infer<typeof updatePolicySchema>["params"];


export const policyIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid policy ID"),
  }),
});

export type PolicyIdParams =
  z.infer<typeof policyIdSchema>["params"];

  export const deletePolicySchema = z.object({
    params: z.object({
      id: z.string().uuid("Invalid policy ID"),
    }),
  });
  
  export type DeletePolicyParams =
    z.infer<typeof deletePolicySchema>["params"];