import { z } from "zod";

export const journalSchema = z.object({
  notes: z.string()
    .min(10, "Your note must be at least 10 characters to generate an AI review.")
    .max(500, "Keep your note concise for the best AI analysis.")
    .optional(),
  emotion: z.enum(["Fearful", "Greedy", "Calm", "Anxious", "Neutral"]).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  hypotheticalExitPrice: z.number().positive().optional(),
})
  // allow partial updates and require at least one field
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "No updates provided",
  });

export type JournalSchema = z.infer<typeof journalSchema>;
