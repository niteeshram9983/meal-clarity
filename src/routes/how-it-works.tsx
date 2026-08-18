import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowDown, Database, ScanSearch } from "lucide-react";
import model from "@/data/diet-model.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONDITIONS, RULE_LABELS } from "@/data/conditions";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — The Rule Pipeline | HealthPlate AI" },
      {
        name: "description",
        content:
          "See the transparent pipeline: user input, condition rules, food database, preference filter, allergy filter, ranking, sample plan and warnings.",
      },
      { property: "og:title", content: "How It Works — The Rule Pipeline | HealthPlate AI" },
      {
        property: "og:description",
        content:
          "An auditable, rule-based dietary guidance pipeline plus an interpretable model trained on a local dataset.",
      },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  { title: "User Input", text: "Age, height, weight, condition, diet, allergies, meal count and preferences." },
  { title: "Condition Rules", text: "The selected condition activates specific sugar, sodium, saturated-fat and processing layers." },
  { title: "Food Database", text: "A local sample database of 40+ foods with coarse nutrition categorisations." },
  { title: "Preference Filter", text: "Vegetarian selection removes all meat, chicken and fish sample entries." },
  { title: "Allergy Filter", text: "Allergen matches — checkbox or free text — are removed before ranking." },
  { title: "Meal Ranking", text: "Remaining foods are scored deterministically by the active rule weights." },
  { title: "Sample Meal Plan", text: "The top-ranked eligible food fills each meal slot without repeats." },
  { title: "Warnings & Alternatives", text: "Flagged foods list their reason plus a substitution that re-passes every filter." },
];

function HowItWorks() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <Badge variant="outline" className="border-primary/30 bg-primary/8 text-primary">
        Fully auditable
      </Badge>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">How HealthPlate AI works</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        There is no black box. The system is transparent, explainable, rule-based, easy to audit and
        easy to modify — designed for educational guidance rather than clinical use.
      </p>

      <div className="mt-10 space-y-2">
        {STEPS.map((step, i) => (
          <div key={step.title}>
            <Card className="lift border-border/70">
              <CardContent className="flex items-start gap-4 py-5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                </div>
              </CardContent>
            </Card>
            {i < STEPS.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown className="size-4 text-primary/60" />
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="flex items-center gap-2 text-2xl font-semibold">
          <ScanSearch className="size-5 text-primary" /> Rule layers per condition
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {CONDITIONS.map((c) => (
            <div key={c.id} className="surface-panel p-4">
              <p className="font-semibold">{c.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.focus}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.rules.map((r) => (
                  <span
                    key={r}
                    className="rounded-md bg-surface px-2 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {RULE_LABELS[r]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="flex items-center gap-2 text-2xl font-semibold">
          <Database className="size-5 text-primary" /> The dataset-trained companion model
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          An interpretable model — {model.meta.algorithm} — was trained offline on{" "}
          {model.meta.rows.toLocaleString()} rows of the uploaded{" "}
          <span className="font-medium">{model.meta.dataset}</span> dataset. Only the learned tree
          thresholds and regression coefficients ship with the app, so every prediction can be traced
          step by step. Its output is shown as an educational data pattern beside the rule engine —
          never as medical advice.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { k: "Dataset rows", v: model.meta.rows.toLocaleString() },
            { k: "Held-out accuracy", v: `${Math.round(model.meta.testAccuracy * 1000) / 10}%` },
            { k: "Plan categories", v: String(model.meta.classes.length) },
          ].map((s) => (
            <div key={s.k} className="surface-panel px-4 py-4">
              <p className="text-xl font-semibold text-primary">{s.v}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{s.k}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-xl bg-surface px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          {model.meta.signalNote}
        </p>
      </section>

      <div className="mt-12">
        <Button asChild size="lg" className="h-12">
          <Link to="/planner">Build My Sample Plan</Link>
        </Button>
      </div>
    </div>
  );
}
