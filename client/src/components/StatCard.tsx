import * as React from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
  "data-testid": testId,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  tone?: "default" | "primary" | "accent";
  "data-testid"?: string;
}) {
  const toneStyles =
    tone === "primary"
      ? "from-primary/12 to-primary/0"
      : tone === "accent"
        ? "from-accent/12 to-accent/0"
        : "from-foreground/6 to-foreground/0";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-card-border/70 bg-card shadow-sm",
        "hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
        "noise-overlay",
      )}
      data-testid={testId}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", toneStyles)} aria-hidden="true" />
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="mt-1 font-display text-2xl tracking-tight">{value}</div>
          </div>
          {icon ? (
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-border/60 bg-card/70">
              {icon}
            </div>
          ) : null}
        </div>
        {hint ? <div className="mt-3 text-xs text-muted-foreground">{hint}</div> : null}
      </div>
    </div>
  );
}
