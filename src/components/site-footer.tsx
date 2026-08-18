import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/70 bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Leaf className="size-4" />
            </span>
            <span className="font-semibold">HealthPlate AI</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Explainable dietary guidance — hackathon prototype.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/planner" className="text-muted-foreground transition-colors hover:text-foreground">
            Planner
          </Link>
          <Link
            to="/how-it-works"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            How It Works
          </Link>
          <Link to="/safety" className="text-muted-foreground transition-colors hover:text-foreground">
            Safety
          </Link>
        </nav>
      </div>
      <div className="border-t border-border/70 px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        Educational sample guidance only. Not a substitute for a qualified doctor or dietitian.
      </div>
    </footer>
  );
}
