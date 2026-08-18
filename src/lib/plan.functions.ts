import { createServerFn } from "@tanstack/react-start";
import { planInputSchema } from "./plan-schema";
import { buildPlanResponse } from "./plan.server";

/**
 * API layer: the rule engine + interpretable model run server-side so the same
 * contract can later be backed by a database without touching the UI.
 */
export const generateSamplePlan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => planInputSchema.parse(data))
  .handler(async ({ data }) => buildPlanResponse(data));
