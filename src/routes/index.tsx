import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, KeyRound, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HealthPlate AI — Explainable Sample Meal Guidance" },
      {
        name: "description",
        content:
          "Build educational sample meal plans around health conditions, dietary preferences and allergies, with a transparent rule engine explaining every suggestion.",
      },
      { property: "og:title", content: "HealthPlate AI — Explainable Sample Meal Guidance" },
      {
        property: "og:description",
        content:
          "A transparent, rule-based dietary guidance prototype: condition rules, allergy filtering and an explanation behind every recommendation.",
      },
    ],
  }),
  component: Landing,
});

const TRUST = [
  { icon: ScanSearch, title: "Explainable Rules", text: "Every food comes with the rule that selected or flagged it." },
  { icon: ShieldCheck, title: "Allergy Filtering", text: "Allergens are removed before a plan is ever generated." },
  { icon: KeyRound, title: "No Paid API Required", text: "Deterministic local rules plus a model trained on a local dataset." },
];

function Landing() {
  return (
    <div>
      <section className="soft-green">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge variant="outline" className="border-primary/30 bg-primary/8 text-primary">
              Explainable rule engine · Hackathon prototype
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
              Smarter meal guidance, made understandable.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              HealthPlate AI creates educational sample meal plans around health conditions, dietary
              preferences and allergies — with a clear explanation behind every recommendation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 text-base">
                <Link to="/planner">Build My Sample Plan</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 text-base">
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {TRUST.map((item) => (
                <div key={item.title} className="flex flex-col gap-2">
                  <item.icon className="size-5 text-primary" />
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <PreviewCard />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Three transparent rule layers</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Condition rules, dietary preference and allergy filtering run in a fixed order, so any
          judge can audit exactly why a food appeared or was flagged.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Condition rules",
              text: "Added sugar, sodium, saturated fat and ultra-processed layers activate based on the selected condition.",
            },
            {
              title: "Preference filter",
              text: "Vegetarian plans never see chicken, fish or meat options from the sample database.",
            },
            {
              title: "Allergy filter",
              text: "Listed allergens — including free-text entries — are removed before ranking begins.",
            },
          ].map((item) => (
            <Card key={item.title} className="lift border-border/70">
              <CardContent className="space-y-2 py-6">
                <CheckCircle2 className="size-5 text-primary" />
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function PreviewCard() {
  return (
    <div className="surface-panel relative p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Today's Guidance
          </p>
          <p className="mt-1 text-xl font-semibold">Balanced by Design</p>
        </div>
        <Sparkles className="size-5 text-primary" />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { v: "3", l: "Rule Layers" },
          { v: "40+", l: "Sample Foods" },
          { v: "100%", l: "Explainable" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-surface px-3 py-3 text-center">
            <p className="text-lg font-semibold text-primary">{s.v}</p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {[
          { slot: "Breakfast", food: "Vegetable oats", tag: "Generally suitable" },
          { slot: "Lunch", food: "Dal with whole-grain roti", tag: "Generally suitable" },
          { slot: "Snack", food: "Unsalted roasted chana", tag: "Generally suitable" },
          { slot: "Dinner", food: "Vegetable khichdi", tag: "Generally suitable" },
        ].map((m) => (
          <div
            key={m.slot}
            className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3"
          >
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{m.slot}</p>
              <p className="text-sm font-medium">{m.food}</p>
            </div>
            <Badge variant="outline" className="border-success/30 bg-success/12 text-success">
              {m.tag}
            </Badge>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/6 px-4 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Flagged</p>
            <p className="text-sm font-medium">Sugary soft drink</p>
          </div>
          <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
            High added sugar
          </Badge>
        </div>
      </div>
    </div>
  );
}
