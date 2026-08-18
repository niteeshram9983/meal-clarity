import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Info,
  Salad,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { conditionById } from "@/data/conditions";
import type { PlanResponse } from "@/lib/plan.server";
import type { FlaggedFood, MealSlot, Verdict } from "@/lib/rule-engine";

const VERDICT_STYLES: Record<Verdict, { label: string; className: string }> = {
  green: { label: "Generally suitable", className: "bg-success/12 text-success border-success/30" },
  yellow: {
    label: "Limit / consider portion",
    className: "bg-warning/18 text-warning-foreground border-warning/40",
  },
  red: { label: "Flagged", className: "bg-destructive/10 text-destructive border-destructive/30" },
};

export function PlanView({ data }: { data: PlanResponse }) {
  const { plan, insight } = data;
  const condition = conditionById(plan.input.condition);

  return (
    <div className="space-y-8">
      <section className="surface-panel p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Sample plan generated
            </p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Your HealthPlate</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              A deterministic, rule-generated sample day. Every card explains the rules behind it.
            </p>
          </div>
          <Badge variant="outline" className="border-primary/30 bg-primary/8 text-primary">
            BMI {plan.bmi} (sample calculation)
          </Badge>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { k: "Age", v: `${plan.input.age} years` },
            { k: "Condition", v: condition.label },
            { k: "Dietary preference", v: plan.input.diet === "vegetarian" ? "Vegetarian" : "Non-vegetarian" },
            { k: "Meals", v: `${plan.input.meals} per day` },
          ].map((item) => (
            <div key={item.k} className="rounded-xl bg-surface px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{item.k}</dt>
              <dd className="mt-1 text-sm font-semibold">{item.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <AnalyticsRow plan={plan} />

      <section>
        <SectionHeading icon={Salad} title="Your Sample Meal Plan" subtitle={`${plan.slots.length} meals, ranked from the eligible sample foods.`} />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plan.slots.map((slot) => (
            <MealCard key={slot.slot} slot={slot} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div>
          <SectionHeading
            icon={AlertTriangle}
            title="Foods to Limit / Flag"
            subtitle="Sample foods that did not pass your active rule layers."
          />
          <div className="mt-4 space-y-3">
            {plan.flagged.length === 0 ? (
              <EmptyState text="No sample foods were flagged for this combination of rules." />
            ) : (
              plan.flagged.slice(0, 8).map((item) => <FlaggedCard key={item.food.id} item={item} />)
            )}
          </div>
        </div>

        <div>
          <SectionHeading
            icon={Sparkles}
            title="Smart Alternatives"
            subtitle="Each substitution re-passes your condition, diet and allergy filters."
          />
          <div className="mt-4 space-y-3">
            {plan.flagged.filter((f) => f.alternative).length === 0 ? (
              <EmptyState text="No substitutions needed — nothing was flagged." />
            ) : (
              plan.flagged
                .filter((f) => f.alternative)
                .slice(0, 8)
                .map((item) => (
                  <Card key={`alt-${item.food.id}`} className="lift border-border/70 shadow-none">
                    <CardContent className="flex flex-wrap items-center gap-3 py-4 text-sm">
                      <span className="font-medium text-muted-foreground line-through">
                        {item.food.name}
                      </span>
                      <ArrowRight className="size-4 text-primary" />
                      <span className="font-semibold">{item.alternative!.food.name}</span>
                      <p className="w-full text-xs text-muted-foreground">{item.alternative!.why}</p>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="size-5 text-primary" /> Applied Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {plan.appliedRules.map((rule) => (
              <div key={`${rule.key}-${rule.label}`} className="flex gap-2 rounded-lg bg-surface px-3 py-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                <div>
                  <p className="text-sm font-medium">{rule.label}</p>
                  <p className="text-xs text-muted-foreground">{rule.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="size-5 text-primary" /> Why These Recommendations?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {plan.pipeline.map((step, i) => (
                <li key={step.step} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{step.step}</p>
                    <p className="text-xs text-muted-foreground">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      {plan.excluded.length > 0 && (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldAlert className="size-5 text-primary" /> Filtered Out Before Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {plan.excluded.map((item) => (
              <div key={`${item.layer}-${item.name}`} className="rounded-lg bg-surface px-3 py-2">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <ModelInsightCard insight={insight} />

      <DisclaimerBanner />
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Salad;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <Icon className="size-5 text-primary" /> {title}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface/60 px-4 py-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function AnalyticsRow({ plan }: { plan: PlanResponse["plan"] }) {
  const items = [
    { label: "Rules Applied", value: plan.analytics.rulesApplied },
    { label: "Foods Considered", value: `${plan.analytics.foodsConsidered}+` },
    { label: "Foods Filtered", value: plan.analytics.foodsFiltered },
    { label: "Meals Generated", value: plan.analytics.mealsGenerated },
    { label: "Allergy Conflicts", value: plan.analytics.allergyConflicts },
  ];
  return (
    <section>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <div key={item.label} className="surface-panel lift px-4 py-4">
            <p className="text-2xl font-semibold text-primary">{item.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Counters describe the rule engine's own processing. They are not medical or risk scores.
      </p>
    </section>
  );
}

function MealCard({ slot }: { slot: MealSlot }) {
  const [open, setOpen] = useState(false);
  const verdict = VERDICT_STYLES[slot.verdict];

  return (
    <Card className="lift flex flex-col border-border/70">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{slot.slot}</p>
          <Badge variant="outline" className={verdict.className}>
            {verdict.label}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg leading-snug">{slot.food.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-3">
        <p className="text-sm text-muted-foreground">{slot.food.explanation}</p>
        <div className="flex flex-wrap gap-1.5">
          <Chip>Fiber: {slot.food.fiberLevel}</Chip>
          <Chip>Sugar: {slot.food.sugarLevel}</Chip>
          <Chip>Sodium: {slot.food.sodiumLevel}</Chip>
          <Chip>Protein: {slot.food.proteinLevel}</Chip>
        </div>
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-primary hover:bg-primary/8"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            Why? <ChevronDown className={`ml-1 size-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </Button>
          {open && (
            <div className="mt-2 rounded-xl bg-accent/50 px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                Why was this recommended?
              </p>
              <p className="mt-1 text-sm text-accent-foreground">{slot.why}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-surface px-2 py-1 text-[11px] font-medium capitalize text-muted-foreground">
      {children}
    </span>
  );
}

function FlaggedCard({ item }: { item: FlaggedFood }) {
  const verdict = VERDICT_STYLES[item.verdict];
  return (
    <Card className="lift border-border/70">
      <CardContent className="space-y-2 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 font-medium">
            <AlertTriangle
              className={`size-4 ${item.verdict === "red" ? "text-destructive" : "text-warning"}`}
            />
            {item.food.name}
          </p>
          <Badge variant="outline" className={verdict.className}>
            {verdict.label}
          </Badge>
        </div>
        <ul className="space-y-1">
          {item.reasons.map((reason) => (
            <li key={reason} className="text-xs text-muted-foreground">
              Reason: {reason}
            </li>
          ))}
        </ul>
        {item.alternative && (
          <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-xs">
            <Sparkles className="size-3.5 text-primary" />
            Suggested alternative: <span className="font-semibold">{item.alternative.food.name}</span>
          </div>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="-ml-2 text-primary hover:bg-primary/8">
              Why?
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Why was {item.food.name} flagged?</DialogTitle>
              <DialogDescription>{item.food.explanation}</DialogDescription>
            </DialogHeader>
            <ul className="space-y-2 text-sm">
              {item.reasons.map((reason) => (
                <li key={reason} className="rounded-lg bg-surface px-3 py-2">
                  {reason}
                </li>
              ))}
            </ul>
            {item.alternative && (
              <p className="text-sm text-muted-foreground">{item.alternative.why}</p>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function ModelInsightCard({ insight }: { insight: PlanResponse["insight"] }) {
  return (
    <Card className="border-primary/20 bg-surface/70">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
          <BrainCircuit className="size-5 text-primary" /> Data-Informed Pattern
          <Badge variant="outline" className="border-primary/30 bg-primary/8 text-primary">
            Educational pattern from the uploaded dataset — not medical advice
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-card px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Dataset plan category
            </p>
            <p className="mt-1 text-lg font-semibold">{insight.planCategory}</p>
            <p className="text-xs text-muted-foreground">
              Leaf confidence {insight.confidence}% · model test accuracy {insight.meta.accuracy}%
            </p>
          </div>
          <div className="rounded-xl bg-card px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Trained on</p>
            <p className="mt-1 text-lg font-semibold">
              {insight.meta.rows.toLocaleString()} dataset rows
            </p>
            <p className="text-xs text-muted-foreground">{insight.meta.algorithm}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          {insight.targets.map((t) => (
            <div key={t.label} className="rounded-xl bg-card px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.label}</p>
              <p className="mt-1 text-base font-semibold">
                {t.value} <span className="text-xs font-normal text-muted-foreground">{t.unit}</span>
              </p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-sm font-medium">Decision path (fully auditable)</p>
          <ol className="mt-2 space-y-1">
            {insight.path.map((step, i) => (
              <li key={step} className="rounded-lg bg-card px-3 py-2 text-xs text-muted-foreground">
                {i + 1}. {step}
              </li>
            ))}
          </ol>
        </div>

        {insight.cohort && (
          <p className="text-xs text-muted-foreground">
            Dataset cohort “{insight.cohort.label}” ({insight.cohort.n.toLocaleString()} rows) averages{" "}
            {insight.cohort.calories} kcal, {insight.cohort.protein} g protein, {insight.cohort.carbs} g
            carbohydrate and {insight.cohort.fats} g fat per day.
          </p>
        )}

        <Separator />
        <p className="text-xs leading-relaxed text-muted-foreground">{insight.meta.note}</p>
      </CardContent>
    </Card>
  );
}
