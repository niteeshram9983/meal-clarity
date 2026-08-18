export type ConditionId =
  | "none"
  | "diabetes"
  | "type2-diabetes"
  | "hypertension"
  | "diabetes-hypertension"
  | "heart-disease"
  | "asthma"
  | "arthritis"
  | "alzheimers";

export interface ConditionDef {
  id: ConditionId;
  label: string;
  /** short, non-diagnostic framing of the dietary focus */
  focus: string;
  /** which rule layers this selection activates */
  rules: RuleKey[];
}

export type RuleKey =
  | "sugar"
  | "sodium"
  | "saturated-fat"
  | "processed"
  | "fiber-priority"
  | "protein-priority";

export const RULE_LABELS: Record<RuleKey, string> = {
  sugar: "Added-sugar filter",
  sodium: "Sodium filter",
  "saturated-fat": "Saturated-fat filter",
  processed: "Ultra-processed food filter",
  "fiber-priority": "Fiber-first ranking",
  "protein-priority": "Protein-balance ranking",
};

export const CONDITIONS: ConditionDef[] = [
  {
    id: "none",
    label: "No condition selected",
    focus: "A general balanced sample plan with whole-food ranking only.",
    rules: ["fiber-priority"],
  },
  {
    id: "diabetes",
    label: "Diabetes",
    focus: "Flags sample foods categorised as high in added sugar or highly refined carbohydrate.",
    rules: ["sugar", "processed", "fiber-priority", "protein-priority"],
  },
  {
    id: "type2-diabetes",
    label: "Type 2 diabetes",
    focus: "Same added-sugar and refined-carbohydrate layers, with fiber and protein ranked first.",
    rules: ["sugar", "processed", "fiber-priority", "protein-priority"],
  },
  {
    id: "hypertension",
    label: "Hypertension",
    focus: "Flags sample foods categorised as high in sodium, especially packaged and processed items.",
    rules: ["sodium", "processed", "fiber-priority"],
  },
  {
    id: "diabetes-hypertension",
    label: "Diabetes + Hypertension",
    focus: "Applies both the added-sugar and the sodium rule sets together.",
    rules: ["sugar", "sodium", "processed", "fiber-priority", "protein-priority"],
  },
  {
    id: "heart-disease",
    label: "Heart disease",
    focus: "Flags sample foods categorised as high in sodium or saturated fat.",
    rules: ["sodium", "saturated-fat", "processed", "fiber-priority"],
  },
  {
    id: "asthma",
    label: "Asthma",
    focus: "Prioritises minimally processed whole foods; allergen filtering is applied strictly.",
    rules: ["processed", "fiber-priority"],
  },
  {
    id: "arthritis",
    label: "Arthritis",
    focus: "Prioritises whole foods and flags ultra-processed, high added-sugar sample items.",
    rules: ["sugar", "saturated-fat", "processed", "fiber-priority"],
  },
  {
    id: "alzheimers",
    label: "Alzheimer's disease",
    focus: "Prioritises vegetables, whole grains and lower saturated-fat sample options.",
    rules: ["saturated-fat", "sugar", "processed", "fiber-priority"],
  },
];

export const conditionById = (id: ConditionId): ConditionDef =>
  CONDITIONS.find((c) => c.id === id) ?? CONDITIONS[0];
