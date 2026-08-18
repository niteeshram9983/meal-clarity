import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { CONDITIONS, type ConditionId } from "@/data/conditions";
import { planInputSchema } from "@/lib/plan-schema";
import { generateSamplePlan } from "@/lib/plan.functions";
import { savePlan } from "@/lib/plan-storage";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Planner — Build a Sample Meal Plan | HealthPlate AI" },
      {
        name: "description",
        content:
          "Enter age, height, weight, health condition, dietary preference and allergies to generate an explainable educational sample meal plan.",
      },
      { property: "og:title", content: "Planner — Build a Sample Meal Plan | HealthPlate AI" },
      {
        property: "og:description",
        content:
          "A transparent planner form: condition rules, allergy filtering and deterministic sample meal generation.",
      },
    ],
  }),
  component: PlannerPage,
});

const ALLERGY_OPTIONS = ["Peanuts", "Dairy", "Wheat", "Soy", "Tree nuts", "Egg", "Fish"];

interface FormState {
  age: string;
  heightCm: string;
  weightKg: string;
  condition: ConditionId;
  diet: "vegetarian" | "non-vegetarian";
  allergies: string[];
  otherAllergy: string;
  meals: "3" | "4" | "5";
  preferences: string;
}

const EMPTY: FormState = {
  age: "",
  heightCm: "",
  weightKg: "",
  condition: "none",
  diet: "vegetarian",
  allergies: [],
  otherAllergy: "",
  meals: "3",
  preferences: "",
};

const DEMO: FormState = {
  age: "30",
  heightCm: "170",
  weightKg: "65",
  condition: "diabetes-hypertension",
  diet: "vegetarian",
  allergies: ["Peanuts"],
  otherAllergy: "",
  meals: "5",
  preferences: "I like oats, rice and vegetables.",
};

function PlannerPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const generate = useServerFn(generateSamplePlan);

  const mutation = useMutation({
    mutationFn: (payload: unknown) => generate({ data: payload as never }),
    onSuccess: (data) => {
      savePlan(data);
      toast.success("Sample plan generated");
      void navigate({ to: "/results" });
    },
    onError: () => toast.error("Could not generate the sample plan. Please try again."),
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function submit(source: FormState) {
    const allergies = [...source.allergies];
    const other = source.otherAllergy.trim();
    if (other) allergies.push(other);

    const parsed = planInputSchema.safeParse({
      age: Number(source.age),
      heightCm: Number(source.heightCm),
      weightKg: Number(source.weightKg),
      condition: source.condition,
      diet: source.diet,
      allergies,
      meals: Number(source.meals),
      preferences: source.preferences.trim() || undefined,
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    mutation.mutate(parsed.data);
  }

  const loading = mutation.isPending;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="outline" className="border-primary/30 bg-primary/8 text-primary">
            Step-by-step planner
          </Badge>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Build your sample plan</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            All inputs stay in your browser and are processed by deterministic rules.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-11"
          disabled={loading}
          onClick={() => {
            setForm(DEMO);
            setErrors({});
            submit(DEMO);
          }}
        >
          <Wand2 className="mr-2 size-4" /> Try Demo Data
        </Button>
      </div>

      <div className="mt-6">
        <DisclaimerBanner />
      </div>

      <form
        className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]"
        onSubmit={(e) => {
          e.preventDefault();
          submit(form);
        }}
      >
        <div className="space-y-6">
          <Section title="1 · Personal information" subtitle="Used only for BMI context and dataset pattern lookup.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Age (years)" error={errors["age"]}>
                <Input
                  inputMode="numeric"
                  value={form.age}
                  onChange={(e) => set("age", e.target.value)}
                  placeholder="30"
                  className="h-11"
                />
              </Field>
              <Field label="Height (cm)" error={errors["heightCm"]}>
                <Input
                  inputMode="numeric"
                  value={form.heightCm}
                  onChange={(e) => set("heightCm", e.target.value)}
                  placeholder="170"
                  className="h-11"
                />
              </Field>
              <Field label="Weight (kg)" error={errors["weightKg"]}>
                <Input
                  inputMode="numeric"
                  value={form.weightKg}
                  onChange={(e) => set("weightKg", e.target.value)}
                  placeholder="65"
                  className="h-11"
                />
              </Field>
            </div>
          </Section>

          <Section title="2 · Health condition" subtitle="Selecting a condition activates its rule layers. No diagnosis is made.">
            <div className="grid gap-3 sm:grid-cols-2">
              {CONDITIONS.map((c) => {
                const active = form.condition === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => set("condition", c.id)}
                    aria-pressed={active}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/8"
                        : "border-border hover:border-primary/40 hover:bg-surface"
                    }`}
                  >
                    <p className="text-sm font-semibold">{c.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{c.focus}</p>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="3 · Dietary preference" subtitle="Vegetarian plans never include meat, chicken or fish options.">
            <RadioGroup
              value={form.diet}
              onValueChange={(v) => set("diet", v as FormState["diet"])}
              className="grid gap-3 sm:grid-cols-2"
            >
              {[
                { v: "vegetarian", l: "Vegetarian" },
                { v: "non-vegetarian", l: "Non-vegetarian" },
              ].map((opt) => (
                <Label
                  key={opt.v}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                    form.diet === opt.v ? "border-primary bg-primary/8" : "border-border hover:bg-surface"
                  }`}
                >
                  <RadioGroupItem value={opt.v} />
                  <span className="text-sm font-medium">{opt.l}</span>
                </Label>
              ))}
            </RadioGroup>
          </Section>

          <Section title="4 · Allergies" subtitle="Matching foods are removed before any meal is generated.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ALLERGY_OPTIONS.map((a) => (
                <Label
                  key={a}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-surface"
                >
                  <Checkbox
                    checked={form.allergies.includes(a)}
                    onCheckedChange={(checked) =>
                      set(
                        "allergies",
                        checked ? [...form.allergies, a] : form.allergies.filter((x) => x !== a),
                      )
                    }
                  />
                  <span className="text-sm font-medium">{a}</span>
                </Label>
              ))}
            </div>
            <Field label="Other allergy (optional)" error={errors["allergies"]}>
              <Input
                value={form.otherAllergy}
                onChange={(e) => set("otherAllergy", e.target.value)}
                placeholder="e.g. sesame"
                className="h-11"
              />
            </Field>
          </Section>

          <Section title="5 · Meals & food preferences" subtitle="Preferences gently boost matching sample foods in ranking.">
            <RadioGroup
              value={form.meals}
              onValueChange={(v) => set("meals", v as FormState["meals"])}
              className="grid grid-cols-3 gap-3"
            >
              {["3", "4", "5"].map((m) => (
                <Label
                  key={m}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                    form.meals === m ? "border-primary bg-primary/8" : "border-border hover:bg-surface"
                  }`}
                >
                  <RadioGroupItem value={m} className="sr-only" />
                  <span className="text-sm font-medium">{m} meals</span>
                </Label>
              ))}
            </RadioGroup>
            <Field label="Food preferences (optional)">
              <Textarea
                value={form.preferences}
                onChange={(e) => set("preferences", e.target.value)}
                placeholder="I like oats, rice and vegetables."
                rows={3}
              />
            </Field>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="size-5 text-primary" /> Plan summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row k="Condition" v={CONDITIONS.find((c) => c.id === form.condition)?.label ?? "—"} />
              <Row k="Diet" v={form.diet === "vegetarian" ? "Vegetarian" : "Non-vegetarian"} />
              <Row
                k="Allergies"
                v={
                  [...form.allergies, form.otherAllergy.trim()].filter(Boolean).join(", ") ||
                  "None listed"
                }
              />
              <Row k="Meals" v={`${form.meals} per day`} />
              <Button type="submit" size="lg" className="mt-2 h-12 w-full text-base" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Generating…
                  </>
                ) : (
                  "Generate Sample Plan"
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Deterministic output: the same inputs always produce the same sample plan.
              </p>
            </CardContent>
          </Card>
        </aside>
      </form>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-panel p-5 sm:p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-surface px-3 py-2">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{k}</span>
      <span className="text-right text-sm font-medium">{v}</span>
    </div>
  );
}
