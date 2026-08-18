import { Link, createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlanView } from "@/components/plan-view";
import { loadPlan } from "@/lib/plan-storage";
import type { PlanResponse } from "@/lib/plan.server";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your HealthPlate — Sample Plan Results | HealthPlate AI" },
      {
        name: "description",
        content:
          "Review your generated educational sample meal plan, flagged foods, smart alternatives and the exact rules that were applied.",
      },
      { property: "og:title", content: "Your HealthPlate — Sample Plan Results" },
      {
        property: "og:description",
        content:
          "Meal cards, flagged foods, rule-checked alternatives and an auditable list of applied rules.",
      },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const [data, setData] = useState<PlanResponse | null | undefined>(undefined);

  useEffect(() => {
    setData(loadPlan());
  }, []);

  if (data === undefined) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-20 text-center sm:px-6">
        <ClipboardList className="mx-auto size-10 text-primary" />
        <h1 className="mt-4 text-2xl font-semibold">No sample plan yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill in the planner (or use the demo data) to generate an explainable sample plan.
        </p>
        <Button asChild size="lg" className="mt-6 h-12">
          <Link to="/planner">Go to the planner</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <PlanView data={data} />
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild variant="outline" className="h-11">
          <Link to="/planner">Adjust inputs</Link>
        </Button>
        <Button asChild variant="ghost" className="h-11">
          <Link to="/how-it-works">See the rule pipeline</Link>
        </Button>
      </div>
    </div>
  );
}
