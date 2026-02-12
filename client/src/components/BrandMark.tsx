import * as React from "react";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  subtitle = "Campus tutoring, beautifully organized.",
}: {
  className?: string;
  subtitle?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)} data-testid="brand-mark">
      <div
        className="
          relative grid place-items-center
          h-11 w-11 rounded-2xl
          bg-gradient-to-br from-primary/95 to-accent/90
          shadow-lg shadow-primary/20
          ring-1 ring-black/5
          overflow-hidden noise-overlay
        "
        aria-hidden="true"
      >
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.8),transparent_60%)]" />
        <span className="font-display text-[15px] text-primary-foreground tracking-tight">
          SB
        </span>
      </div>
      <div className="leading-tight">
        <div className="font-display text-lg tracking-tight">StudyBuddy</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  );
}
