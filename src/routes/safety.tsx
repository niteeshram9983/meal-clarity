import { Link, createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DisclaimerBanner } from "@/components/disclaimer-banner";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety & Scope — What HealthPlate AI Does Not Do" },
      {
        name: "description",
        content:
          "HealthPlate AI is an educational prototype: it does not diagnose, treat or cure conditions, and it never replaces a qualified doctor or dietitian.",
      },
      { property: "og:title", content: "Safety & Scope — HealthPlate AI" },
      {
        property: "og:description",
        content:
          "Read the scope, limitations and safety boundaries of this educational rule-based dietary guidance prototype.",
      },
    ],
  }),
  component: SafetyPage,
});

const NOT = [
  "Does not diagnose any disease or condition.",
  "Does not prescribe treatment or medication.",
  "Does not claim to cure, treat or reverse medical conditions.",
  "Is not a medical prescription or a clinical nutrition plan.",
  "Does not replace individualized advice from a doctor or dietitian.",
];

const DOES = [
  "Generates educational SAMPLE meal plans from a local sample food database.",
  "Applies transparent condition rules for added sugar, sodium, saturated fat and processing.",
  "Removes listed allergens before any plan is generated.",
  "Explains the rule behind every selection, flag and substitution.",
  "Labels dataset-derived model output as an educational pattern, not advice.",
];

function SafetyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <h1 className="text-3xl font-semibold sm:text-4xl">Safety & scope</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        HealthPlate AI is a hackathon prototype built to demonstrate explainable, rule-based dietary
        guidance. Its boundaries are deliberate and explicit.
      </p>

      <div className="mt-6">
        <DisclaimerBanner />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="border-border/70">
          <CardContent className="space-y-3 py-6">
            <ShieldCheck className="size-5 text-primary" />
            <p className="font-semibold">What it does</p>
            <ul className="space-y-2">
              {DOES.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">
                  • {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="space-y-3 py-6">
            <XCircle className="size-5 text-destructive" />
            <p className="font-semibold">What it never does</p>
            <ul className="space-y-2">
              {NOT.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">
                  • {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-primary/20 bg-surface/70">
        <CardContent className="space-y-3 py-6">
          <HeartHandshake className="size-5 text-primary" />
          <p className="font-semibold">If you have a medical condition or allergy</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Always confirm any dietary change with a qualified professional. Allergy filtering in this
            prototype works on a small sample database and cannot guarantee the safety of real-world
            foods, restaurant meals or packaged products — always read labels and ask your clinician.
          </p>
        </CardContent>
      </Card>

      <div className="mt-10">
        <Button asChild size="lg" className="h-12">
          <Link to="/planner">Continue to the planner</Link>
        </Button>
      </div>
    </div>
  );
}
