import * as React from "react";
import { Link } from "wouter";
import { Filter, MapPin, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTutorSearch } from "@/hooks/use-tutors";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";

function dollars(cents?: number | null) {
  if (cents === undefined || cents === null) return "—";
  return `$${(cents / 100).toFixed(0)}`;
}

export default function FindTutorsPage() {
  const [subject, setSubject] = React.useState("");
  const [university, setUniversity] = React.useState("");
  const [minRate, setMinRate] = React.useState<string>("");
  const [maxRate, setMaxRate] = React.useState<string>("");
  const [activeOnly, setActiveOnly] = React.useState(true);

  const query = useTutorSearch({
    subject: subject || undefined,
    university: university || undefined,
    minRateCents: minRate ? Number(minRate) * 100 : undefined,
    maxRateCents: maxRate ? Number(maxRate) * 100 : undefined,
    isActive: activeOnly,
  });

  return (
    <AppShell title="Find tutors">
      <Card className="rounded-3xl border border-card-border/70 bg-card shadow-sm noise-overlay">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="font-display text-2xl tracking-tight">Search the marketplace</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Filter by subject, university, and rate. Click a tutor to view details and book.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                className="rounded-xl"
                onClick={() => {
                  setSubject("");
                  setUniversity("");
                  setMinRate("");
                  setMaxRate("");
                  setActiveOnly(true);
                }}
                data-testid="tutor-filters-reset"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="ml-2">Reset</span>
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-4">
              <div className="text-xs text-muted-foreground mb-1">Subject</div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Calculus"
                  className="pl-10 rounded-xl"
                  data-testid="tutor-filter-subject"
                />
              </div>
            </div>

            <div className="md:col-span-4">
              <div className="text-xs text-muted-foreground mb-1">University</div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g., UC Berkeley"
                  className="pl-10 rounded-xl"
                  data-testid="tutor-filter-university"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="text-xs text-muted-foreground mb-1">Min $/hr</div>
              <Input
                value={minRate}
                onChange={(e) => setMinRate(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="0"
                inputMode="numeric"
                className="rounded-xl"
                data-testid="tutor-filter-minrate"
              />
            </div>

            <div className="md:col-span-2">
              <div className="text-xs text-muted-foreground mb-1">Max $/hr</div>
              <Input
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="60"
                inputMode="numeric"
                className="rounded-xl"
                data-testid="tutor-filter-maxrate"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-sm" data-testid="tutor-filter-active">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Active tutors only
            </label>
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Filter className="h-4 w-4" />
              {query.isLoading ? "Loading results…" : `${(query.data ?? []).length} results`}
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        {query.isError ? (
          <Card className="rounded-3xl border border-destructive/30 bg-card p-6 shadow-sm">
            <div className="font-display text-xl tracking-tight">Couldn’t load tutors</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {(query.error as any)?.message ?? "Unknown error"}
            </div>
            <Button
              type="button"
              className="mt-4 rounded-xl"
              onClick={() => query.refetch()}
              data-testid="tutor-search-retry"
            >
              Retry
            </Button>
          </Card>
        ) : null}

        {!query.isLoading && !query.isError && (query.data ?? []).length === 0 ? (
          <EmptyState
            icon={<Sparkles className="h-5 w-5 text-accent" />}
            title="No tutors match that yet"
            description="Try a broader subject name, remove the university filter, or widen the rate range."
            actionLabel="Reset filters"
            onAction={() => {
              setSubject("");
              setUniversity("");
              setMinRate("");
              setMaxRate("");
              setActiveOnly(true);
            }}
            data-testid="tutor-search-empty"
          />
        ) : null}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(query.data ?? []).map((t) => {
            const name =
              [t.user.firstName, t.user.lastName].filter(Boolean).join(" ") ||
              t.user.email ||
              "Tutor";

            const min =
              (t.subjects ?? []).length > 0
                ? Math.min(...t.subjects.map((s) => s.hourlyRateCents ?? 0))
                : null;

            return (
              <Link
                key={t.user.id}
                href={`/tutors/${t.user.id}`}
                className={cn(
                  "group block rounded-3xl border border-card-border/70 bg-card shadow-sm overflow-hidden",
                  "hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
                  "noise-overlay",
                )}
                data-testid={`tutor-card-${t.user.id}`}
              >
                <div className="relative p-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,hsl(var(--primary)/0.12),transparent_55%),radial-gradient(circle_at_90%_15%,hsl(var(--accent)/0.10),transparent_55%)]" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-display text-xl tracking-tight truncate">{name}</div>
                        <div className="mt-1 text-sm text-muted-foreground truncate">
                          {t.tutorProfile.university}
                          {t.tutorProfile.major ? ` • ${t.tutorProfile.major}` : ""}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-card/80 px-3 py-2">
                        <div className="text-[11px] text-muted-foreground">from</div>
                        <div className="text-sm font-semibold">{min === null ? "—" : dollars(min)}/hr</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(t.subjects ?? []).slice(0, 3).map((s) => (
                        <span
                          key={s.id}
                          className="
                            inline-flex items-center rounded-full
                            border border-border/70 bg-muted/30
                            px-3 py-1 text-xs
                          "
                        >
                          {s.subject}
                        </span>
                      ))}
                      {(t.subjects ?? []).length > 3 ? (
                        <span className="text-xs text-muted-foreground">
                          +{(t.subjects ?? []).length - 3} more
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {(t.availability ?? []).length} availability window
                        {(t.availability ?? []).length === 1 ? "" : "s"}
                      </span>
                      <span className="text-primary font-semibold group-hover:underline">
                        View profile
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
