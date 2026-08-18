import model from "@/data/diet-model.json";
import type { PlanInput } from "./rule-engine";

type TreeNode =
  | { leaf: true; probs: number[]; n: number }
  | { leaf: false; feature: string; threshold: number; left: TreeNode; right: TreeNode };

export interface ModelInsight {
  planCategory: string;
  confidence: number;
  path: string[];
  targets: { label: string; value: number; unit: string }[];
  cohort?: {
    label: string;
    n: number;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  meta: {
    rows: number;
    accuracy: number;
    algorithm: string;
    dataset: string;
    note: string;
    importances: { feature: string; weight: number }[];
  };
}

const FEATURE_LABELS: Record<string, string> = {
  Age: "age",
  Height_cm: "height",
  Weight_kg: "weight",
  BMI: "BMI",
  diabetes: "diabetes flag",
  hypertension: "hypertension flag",
  heart: "heart-disease flag",
  obesity: "obesity flag",
  vegetarian: "vegetarian flag",
  male: "male flag",
};

const COHORT_KEY: Record<string, string> = {
  diabetes: "Diabetes",
  "type2-diabetes": "Diabetes",
  hypertension: "Hypertension",
  "diabetes-hypertension": "Diabetes",
  "heart-disease": "Heart Disease",
  none: "None",
  asthma: "None",
  arthritis: "None",
  alzheimers: "None",
};

function features(input: PlanInput): Record<string, number> {
  const bmi = input.weightKg / Math.pow(input.heightCm / 100, 2);
  const c = input.condition;
  return {
    Age: input.age,
    Height_cm: input.heightCm,
    Weight_kg: input.weightKg,
    BMI: Math.round(bmi * 100) / 100,
    diabetes: c === "diabetes" || c === "type2-diabetes" || c === "diabetes-hypertension" ? 1 : 0,
    hypertension: c === "hypertension" || c === "diabetes-hypertension" ? 1 : 0,
    heart: c === "heart-disease" ? 1 : 0,
    obesity: bmi >= 30 ? 1 : 0,
    vegetarian: input.diet === "vegetarian" ? 1 : 0,
    male: 0,
  };
}

/**
 * Interpretable inference: walks the exported decision tree and evaluates the
 * exported linear regressions. Educational pattern only — never medical advice.
 */
export function predictInsight(input: PlanInput): ModelInsight {
  const x = features(input);
  const path: string[] = [];
  let node = model.tree as TreeNode;

  while (!node.leaf) {
    const value = x[node.feature] ?? 0;
    const goLeft = value <= node.threshold;
    const label = FEATURE_LABELS[node.feature] ?? node.feature;
    path.push(
      `${label} ${goLeft ? "≤" : ">"} ${Number(node.threshold.toFixed(2))} (yours: ${Number(value.toFixed(2))})`,
    );
    node = goLeft ? node.left : node.right;
  }

  const probs = node.probs;
  let best = 0;
  probs.forEach((p, i) => {
    if (p > probs[best]!) best = i;
  });

  const regs = model.regressions as Record<
    string,
    { coef: Record<string, number>; intercept: number }
  >;
  const evalReg = (key: string) => {
    const r = regs[key]!;
    const sum = Object.entries(r.coef).reduce((acc, [f, c]) => acc + c * (x[f] ?? 0), r.intercept);
    return Math.max(0, Math.round(sum));
  };

  const cohortKey = COHORT_KEY[input.condition] ?? "None";
  const cohorts = model.cohorts as Record<
    string,
    { n: number; calories: number; protein: number; carbs: number; fats: number }
  >;
  const cohort = cohorts[cohortKey];

  return {
    planCategory: model.meta.classes[best] ?? "Balanced Diet",
    confidence: Math.round((probs[best] ?? 0) * 100),
    path,
    targets: [
      { label: "Energy pattern", value: evalReg("Recommended_Calories"), unit: "kcal/day" },
      { label: "Protein pattern", value: evalReg("Recommended_Protein"), unit: "g/day" },
      { label: "Carbohydrate pattern", value: evalReg("Recommended_Carbs"), unit: "g/day" },
      { label: "Fat pattern", value: evalReg("Recommended_Fats"), unit: "g/day" },
    ],
    cohort: cohort ? { label: cohortKey, ...cohort } : undefined,
    meta: {
      rows: model.meta.rows,
      accuracy: Math.round(model.meta.testAccuracy * 1000) / 10,
      algorithm: model.meta.algorithm,
      dataset: model.meta.dataset,
      note: model.meta.signalNote,
      importances: Object.entries(model.meta.importances)
        .map(([feature, weight]) => ({
          feature: FEATURE_LABELS[feature] ?? feature,
          weight: Math.round((weight as number) * 1000) / 10,
        }))
        .sort((a, b) => b.weight - a.weight),
    },
  };
}
