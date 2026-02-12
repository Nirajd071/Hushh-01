import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  "data-testid": testId,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  "data-testid"?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-card-border/70 bg-card p-8 text-center shadow-sm",
        "noise-overlay",
      )}
      data-testid={testId}
    >
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl border border-border/60 bg-muted/60">
        {icon}
      </div>
      <div className="mt-4 font-display text-xl tracking-tight">{title}</div>
      <div className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </div>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
        {actionLabel && onAction ? (
          <Button
            type="button"
            onClick={onAction}
            className="
              w-full sm:w-auto rounded-xl px-5
              bg-gradient-to-r from-primary to-primary/80
              text-primary-foreground shadow-lg shadow-primary/20
              hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5
              active:translate-y-0 active:shadow-md
              transition-all duration-200
            "
            data-testid={testId ? `${testId}-action` : "empty-action"}
          >
            {actionLabel}
          </Button>
        ) : null}
        {secondaryLabel && onSecondary ? (
          <Button
            type="button"
            variant="secondary"
            onClick={onSecondary}
            className="w-full sm:w-auto rounded-xl"
            data-testid={testId ? `${testId}-secondary` : "empty-secondary"}
          >
            {secondaryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
