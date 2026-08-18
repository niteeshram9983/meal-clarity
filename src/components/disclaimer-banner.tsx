import { ShieldCheck } from "lucide-react";

export const DISCLAIMER_TEXT =
  "HealthPlate AI provides general educational meal suggestions and is not a substitute for a qualified doctor or dietitian. It does not diagnose, treat or cure medical conditions. People with medical conditions, allergies or special dietary needs should seek individualized professional advice.";

export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex gap-3 rounded-xl border border-primary/20 bg-accent/50 px-4 py-3">
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
      <p className={compact ? "text-xs leading-relaxed text-accent-foreground" : "text-sm leading-relaxed text-accent-foreground"}>
        {DISCLAIMER_TEXT}
      </p>
    </div>
  );
}
