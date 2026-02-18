import { z } from "zod";

export const journalSchema = z.object({
  notes: z.string()
    .min(10, "Your note must be at least 10 characters to generate an AI review.")
    .max(500, "Keep your note concise for the best AI analysis."),
  emotion: z.enum(["Fearful", "Greedy", "Calm", "Anxious", "Neutral"]),
  rating: z.number().int().min(1).max(5),
  hypotheticalExitPrice: z.number().positive().optional(),
});

export type JournalSchema = z.infer<typeof journalSchema>;
