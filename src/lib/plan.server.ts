import { predictInsight, type ModelInsight } from "./ml-model";
import { generatePlan, type PlanInput, type PlanResult } from "./rule-engine";
import type { PlanInputPayload } from "./plan-schema";

export interface PlanResponse {
  plan: PlanResult;
  insight: ModelInsight;
  generatedAt: string;
}

export function buildPlanResponse(payload: PlanInputPayload): PlanResponse {
  const input: PlanInput = {
    age: payload.age,
    heightCm: payload.heightCm,
    weightKg: payload.weightKg,
    condition: payload.condition,
    diet: payload.diet,
    allergies: payload.allergies ?? [],
    meals: payload.meals,
    preferences: payload.preferences ?? "",
  };

  return {
    plan: generatePlan(input),
    insight: predictInsight(input),
    generatedAt: new Date().toISOString(),
  };
}
