import type { PlanResponse } from "./plan.server";

const KEY = "healthplate.plan";

export function savePlan(plan: PlanResponse) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, JSON.stringify(plan));
}

export function loadPlan(): PlanResponse | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PlanResponse;
  } catch {
    return null;
  }
}
