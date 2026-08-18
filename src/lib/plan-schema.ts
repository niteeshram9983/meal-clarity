import { z } from "zod";

export const planInputSchema = z.object({
  age: z
    .number({ invalid_type_error: "Enter your age in years." })
    .int("Age must be a whole number.")
    .positive("Age must be a positive number.")
    .max(110, "Please enter an age below 110."),
  heightCm: z
    .number({ invalid_type_error: "Enter your height in cm." })
    .min(90, "Height should be between 90 and 250 cm.")
    .max(250, "Height should be between 90 and 250 cm."),
  weightKg: z
    .number({ invalid_type_error: "Enter your weight in kg." })
    .min(25, "Weight should be between 25 and 250 kg.")
    .max(250, "Weight should be between 25 and 250 kg."),
  condition: z.enum([
    "none",
    "diabetes",
    "type2-diabetes",
    "hypertension",
    "diabetes-hypertension",
    "heart-disease",
    "asthma",
    "arthritis",
    "alzheimers",
  ]),
  diet: z.enum(["vegetarian", "non-vegetarian"]),
  allergies: z.array(z.string().max(40)).max(12).default([]),
  meals: z.union([z.literal(3), z.literal(4), z.literal(5)]),
  preferences: z.string().max(300).optional(),
});

export type PlanInputPayload = z.infer<typeof planInputSchema>;
