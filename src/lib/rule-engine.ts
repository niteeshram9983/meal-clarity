import { ALLERGEN_SYNONYMS, FOODS, type Food, type Level, type MealType } from "@/data/foods";
import { RULE_LABELS, conditionById, type ConditionId, type RuleKey } from "@/data/conditions";

export interface PlanInput {
  age: number;
  heightCm: number;
  weightKg: number;
  condition: ConditionId;
  diet: "vegetarian" | "non-vegetarian";
  allergies: string[];
  meals: 3 | 4 | 5;
  preferences?: string;
}

export type Verdict = "green" | "yellow" | "red";

export interface MealSlot {
  slot: string;
  food: Food;
  why: string;
  verdict: Verdict;
  score: number;
}

export interface FlaggedFood {
  food: Food;
  reasons: string[];
  verdict: Verdict;
  alternative?: { food: Food; why: string } | undefined;
}

export interface ExcludedFood {
  name: string;
  reason: string;
  layer: "allergy" | "diet";
}

export interface PlanResult {
  input: PlanInput;
  bmi: number;
  slots: MealSlot[];
  flagged: FlaggedFood[];
  excluded: ExcludedFood[];
  appliedRules: { key: RuleKey | "diet" | "allergy"; label: string; detail: string }[];
  analytics: {
    rulesApplied: number;
    foodsConsidered: number;
    foodsFiltered: number;
    mealsGenerated: number;
    allergyConflicts: number;
    eligibleFoods: number;
  };
  pipeline: { step: string; detail: string }[];
}

const LEVEL_SCORE: Record<Level, number> = { low: 0, medium: 1, high: 2 };

const SLOTS: Record<3 | 4 | 5, { slot: string; type: MealType }[]> = {
  3: [
    { slot: "Breakfast", type: "breakfast" },
    { slot: "Lunch", type: "lunch" },
    { slot: "Dinner", type: "dinner" },
  ],
  4: [
    { slot: "Breakfast", type: "breakfast" },
    { slot: "Lunch", type: "lunch" },
    { slot: "Snack", type: "snack" },
    { slot: "Dinner", type: "dinner" },
  ],
  5: [
    { slot: "Breakfast", type: "breakfast" },
    { slot: "Morning Snack", type: "snack" },
    { slot: "Lunch", type: "lunch" },
    { slot: "Evening Snack", type: "snack" },
    { slot: "Dinner", type: "dinner" },
  ],
};

/** Normalise a free-text allergy into canonical allergen keys. */
export function normaliseAllergy(raw: string): string[] {
  const value = raw.trim().toLowerCase();
  if (!value) return [];
  const hits = new Set<string>();
  for (const [key, words] of Object.entries(ALLERGEN_SYNONYMS)) {
    if (words.some((w) => value.includes(w) || w.includes(value))) hits.add(key);
  }
  // unknown, user-entered allergy: keep the raw token so name matching still works
  if (hits.size === 0) hits.add(value);
  return [...hits];
}

function foodMatchesAllergy(food: Food, allergyKeys: string[]): string | null {
  const haystack = `${food.name} ${food.allergens.join(" ")} ${food.explanation}`.toLowerCase();
  for (const key of allergyKeys) {
    if (food.allergens.some((a) => a.toLowerCase() === key)) return key;
    const synonyms = ALLERGEN_SYNONYMS[key] ?? [key];
    if (synonyms.some((s) => haystack.includes(s))) return key;
  }
  return null;
}

/** Condition rule layer: returns flag reasons for a food. */
export function evaluateFood(food: Food, rules: RuleKey[]): { reasons: string[]; verdict: Verdict } {
  const reasons: string[] = [];
  let severity = 0;

  if (rules.includes("sugar")) {
    if (food.sugarLevel === "high") {
      reasons.push("Flagged because this sample food is categorized as high in added sugar.");
      severity = 2;
    } else if (food.sugarLevel === "medium") {
      reasons.push("Consider portion: categorized as moderate in added sugar.");
      severity = Math.max(severity, 1);
    }
  }
  if (rules.includes("sodium")) {
    if (food.sodiumLevel === "high") {
      reasons.push("Flagged because this sample food is categorized as high in sodium.");
      severity = 2;
    } else if (food.sodiumLevel === "medium") {
      reasons.push("Consider preparation: categorized as moderate in sodium.");
      severity = Math.max(severity, 1);
    }
  }
  if (rules.includes("saturated-fat")) {
    if (food.saturatedFatLevel === "high") {
      reasons.push("Flagged because this sample food is categorized as high in saturated fat.");
      severity = 2;
    } else if (food.saturatedFatLevel === "medium") {
      reasons.push("Consider preparation: categorized as moderate in saturated fat.");
      severity = Math.max(severity, 1);
    }
  }
  if (rules.includes("processed") && food.processed) {
    reasons.push("Flagged because this sample food is categorized as highly processed or packaged.");
    severity = Math.max(severity, 2);
  }

  const verdict: Verdict = severity === 2 ? "red" : severity === 1 ? "yellow" : "green";
  return { reasons, verdict };
}

function rankScore(food: Food, rules: RuleKey[], preferences: string): number {
  let score = 0;
  if (rules.includes("fiber-priority")) score += LEVEL_SCORE[food.fiberLevel] * 3;
  if (rules.includes("protein-priority")) score += LEVEL_SCORE[food.proteinLevel] * 2;
  if (rules.includes("sugar")) score += (2 - LEVEL_SCORE[food.sugarLevel]) * 2;
  if (rules.includes("sodium")) score += (2 - LEVEL_SCORE[food.sodiumLevel]) * 2;
  if (rules.includes("saturated-fat")) score += (2 - LEVEL_SCORE[food.saturatedFatLevel]) * 2;
  if (!food.processed) score += 2;

  const prefs = preferences
    .toLowerCase()
    .split(/[,.;\n]|\band\b/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2);
  if (prefs.some((p) => food.name.toLowerCase().includes(p) || p.includes(food.name.toLowerCase())))
    score += 6;

  return score;
}

export function generatePlan(input: PlanInput): PlanResult {
  const condition = conditionById(input.condition);
  const rules = condition.rules;
  const allergyKeys = [...new Set(input.allergies.flatMap(normaliseAllergy))];
  const preferences = input.preferences ?? "";
  const excluded: ExcludedFood[] = [];
  const pipeline: { step: string; detail: string }[] = [];

  pipeline.push({
    step: "User input",
    detail: `Age ${input.age}, ${input.heightCm} cm, ${input.weightKg} kg, ${input.meals} meals.`,
  });
  pipeline.push({ step: "Condition rules", detail: `${condition.label}: ${condition.focus}` });

  // Layer 1 — dietary preference filter
  let pool = FOODS.filter((food) => {
    if (input.diet === "vegetarian" && !food.vegetarian) {
      excluded.push({
        name: food.name,
        reason: "Excluded because it does not match the vegetarian preference.",
        layer: "diet",
      });
      return false;
    }
    return true;
  });
  pipeline.push({
    step: "Dietary preference filter",
    detail: `${input.diet === "vegetarian" ? "Vegetarian" : "Non-vegetarian"} filter removed ${
      excluded.filter((e) => e.layer === "diet").length
    } sample foods.`,
  });

  // Layer 2 — allergy filter (always before plan generation)
  pool = pool.filter((food) => {
    const hit = foodMatchesAllergy(food, allergyKeys);
    if (hit) {
      excluded.push({
        name: food.name,
        reason: `Excluded because it matches your listed allergy (${hit}).`,
        layer: "allergy",
      });
      return false;
    }
    return true;
  });
  const allergyConflicts = excluded.filter((e) => e.layer === "allergy").length;
  pipeline.push({
    step: "Allergy filter",
    detail: allergyKeys.length
      ? `${allergyKeys.join(", ")} — ${allergyConflicts} sample foods removed before plan generation.`
      : "No allergies listed, nothing removed at this layer.",
  });

  // Layer 3 — condition evaluation + ranking
  const evaluated = pool.map((food) => ({
    food,
    ...evaluateFood(food, rules),
    score: rankScore(food, rules, preferences),
  }));
  pipeline.push({
    step: "Food database + meal matching",
    detail: `${pool.length} eligible sample foods matched to ${input.meals} meal slots.`,
  });

  const suitable = evaluated
    .filter((e) => e.verdict !== "red")
    .sort((a, b) => b.score - a.score || a.food.name.localeCompare(b.food.name));

  // Layer 4 — slot assignment (no repeats where possible)
  const used = new Set<string>();
  const slots: MealSlot[] = SLOTS[input.meals].map(({ slot, type }) => {
    const candidates = suitable.filter((e) => e.food.mealTypes.includes(type));
    const pick = candidates.find((c) => !used.has(c.food.id)) ?? candidates[0] ?? suitable[0]!;
    used.add(pick.food.id);
    return {
      slot,
      food: pick.food,
      verdict: pick.verdict,
      score: pick.score,
      why: buildWhy(pick.food, input, condition.label, pick.verdict, pick.reasons),
    };
  });
  pipeline.push({ step: "Ranking + sample meal plan", detail: `${slots.length} meals generated deterministically.` });

  // Layer 5 — flags + substitutions
  const flagged: FlaggedFood[] = evaluated
    .filter((e) => e.verdict !== "green" && e.reasons.length > 0)
    .sort((a, b) => (a.verdict === "red" ? -1 : 1) - (b.verdict === "red" ? -1 : 1))
    .map((e) => {
      const alt = findAlternative(e.food, suitable);
      return {
        food: e.food,
        reasons: e.reasons,
        verdict: e.verdict,
        alternative: alt
          ? {
              food: alt.food,
              why: `${alt.food.name} passes the same ${condition.label.toLowerCase()} rules, the ${
                input.diet
              } preference and your allergy filter.`,
            }
          : undefined,
      };
    });
  pipeline.push({
    step: "Warnings + alternatives",
    detail: `${flagged.length} sample foods flagged, with rule-checked substitutions.`,
  });

  const appliedRules: PlanResult["appliedRules"] = rules.map((key) => ({
    key,
    label: RULE_LABELS[key],
    detail: `${condition.label} — ${RULE_LABELS[key]} applied.`,
  }));
  appliedRules.push({
    key: "diet",
    label: input.diet === "vegetarian" ? "Vegetarian filter" : "Non-vegetarian options allowed",
    detail: "Dietary preference filter applied before ranking.",
  });
  if (allergyKeys.length)
    appliedRules.push({
      key: "allergy",
      label: `Allergy filter (${allergyKeys.join(", ")})`,
      detail: "Allergen matches removed before any meal was generated.",
    });

  const bmi = input.weightKg / Math.pow(input.heightCm / 100, 2);

  return {
    input,
    bmi: Math.round(bmi * 10) / 10,
    slots,
    flagged,
    excluded,
    appliedRules,
    analytics: {
      rulesApplied: appliedRules.length,
      foodsConsidered: FOODS.length,
      foodsFiltered: excluded.length,
      mealsGenerated: slots.length,
      allergyConflicts: 0,
      eligibleFoods: pool.length,
    },
    pipeline,
  };
}

function buildWhy(
  food: Food,
  input: PlanInput,
  conditionLabel: string,
  verdict: Verdict,
  reasons: string[],
): string {
  const traits: string[] = [];
  if (food.fiberLevel === "high") traits.push("high-fiber");
  if (food.sugarLevel === "low") traits.push("low-sugar");
  if (food.sodiumLevel === "low") traits.push("low-sodium");
  if (food.proteinLevel === "high") traits.push("protein-rich");
  if (!food.processed) traits.push("minimally processed");
  const traitText = traits.length ? traits.join(", ") : "balanced";
  const base = `${food.name} was selected because it matches the ${input.diet} preference and is categorized as a ${traitText} option in the sample database.`;
  const conditionText =
    input.condition === "none"
      ? " No condition-specific rules were applied for this plan."
      : ` It passed the ${conditionLabel} rule layer.`;
  const caution = verdict === "yellow" && reasons[0] ? ` Note: ${reasons[0]}` : "";
  return base + conditionText + caution;
}

function findAlternative(
  food: Food,
  suitable: { food: Food; score: number }[],
): { food: Food } | undefined {
  if (food.substituteId) {
    const explicit = suitable.find((s) => s.food.id === food.substituteId);
    if (explicit) return { food: explicit.food };
  }
  const sameSlot = suitable.find((s) =>
    s.food.mealTypes.some((t) => food.mealTypes.includes(t)) && s.food.id !== food.id,
  );
  return sameSlot ? { food: sameSlot.food } : undefined;
}

export const DEMO_INPUT: PlanInput = {
  age: 30,
  heightCm: 170,
  weightKg: 65,
  condition: "diabetes-hypertension",
  diet: "vegetarian",
  allergies: ["Peanuts"],
  meals: 5,
  preferences: "I like oats, rice and vegetables.",
};
