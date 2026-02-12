import * as React from "react";
import { Link } from "wouter";
import { ArrowRight, BadgeCheck, CalendarClock, GraduationCap, Search, Shield } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="
        inline-flex items-center gap-2 rounded-full
        border border-border/70 bg-card/60 px-3 py-1
        text-xs text-muted-foreground backdrop-blur
        shadow-sm
      "
    >
      {children}
    </span>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-campus">
      <header className="sticky top-0 z-30">
        <div className="glass">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <BrandMark subtitle="Clean, campus-first tutoring." />
              <div className="flex items-center gap-2">
                <ThemeToggle data-testid="landing-theme-toggle" />
                <Button
                  type="button"
                  onClick={() => (window.location.href = "/api/login")}
                  className="
                    rounded-xl px-5
                    bg-gradient-to-r from-primary to-primary/80
                    text-primary-foreground shadow-lg shadow-primary/20
                    hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5
                    active:translate-y-0 active:shadow-md
                    transition-all duration-200
                  "
                  data-testid="landing-login"
                >
                  Sign in <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="h-px bg-border/70" />
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 animate-enter">
            <div className="flex flex-wrap gap-2">
              <Pill>
                <BadgeCheck className="h-4 w-4 text-primary" />
                Free to start
              </Pill>
              <Pill>
                <Shield className="h-4 w-4 text-accent" />
                Session-based workflow
              </Pill>
              <Pill>
                <CalendarClock className="h-4 w-4 text-[hsl(var(--chart-3))]" />
                Clear availability
              </Pill>
            </div>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              A calm marketplace for{" "}
              <span className="text-primary">campus tutoring</span>—built for weeknight study sessions.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl">
              Find the right tutor by subject and rate. Build a profile that reads like a syllabus.
              Book sessions with a clean timeline from request → confirmation → completion.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={() => (window.location.href = "/api/login")}
                className="
                  rounded-xl px-6 py-6 sm:py-5 text-base
                  bg-gradient-to-r from-primary to-primary/85
                  text-primary-foreground shadow-lg shadow-primary/20
                  hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5
                  active:translate-y-0 active:shadow-md
                  transition-all duration-200
                "
                data-testid="landing-cta-primary"
              >
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link
                href="/find-tutors"
                className="
                  inline-flex items-center justify-center rounded-xl border border-border/70
                  bg-card/60 px-6 py-4 text-sm font-semibold
                  hover:bg-card hover:shadow-sm hover:-translate-y-0.5
                  transition-all duration-200
                "
                data-testid="landing-cta-secondary"
              >
                Explore tutors <Search className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="rounded-2xl border border-card-border/70 bg-card/70 backdrop-blur shadow-sm noise-overlay">
                <div className="p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-border/60 bg-muted/50">
                    <Search className="h-4 w-4" />
                  </div>
                  <div className="mt-3 font-medium">Search fast</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Subject + rate filters that feel like a marketplace.
                  </div>
                </div>
              </Card>
              <Card className="rounded-2xl border border-card-border/70 bg-card/70 backdrop-blur shadow-sm noise-overlay">
                <div className="p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-border/60 bg-muted/50">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div className="mt-3 font-medium">Profiles that convert</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Subjects, proficiency, and clean availability windows.
                  </div>
                </div>
              </Card>
              <Card className="rounded-2xl border border-card-border/70 bg-card/70 backdrop-blur shadow-sm noise-overlay">
                <div className="p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-border/60 bg-muted/50">
                    <CalendarClock className="h-4 w-4" />
                  </div>
                  <div className="mt-3 font-medium">Session timeline</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Request, confirm, meet, complete—no confusion.
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-5 animate-enter" style={{ animationDelay: "120ms" }}>
            <div className="relative rounded-3xl border border-card-border/70 bg-card/70 backdrop-blur shadow-lg noise-overlay overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,hsl(var(--primary)/0.18),transparent_45%),radial-gradient(circle_at_85%_25%,hsl(var(--accent)/0.16),transparent_50%)]" />
              <div className="relative p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Preview</div>
                  <span className="rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-xs">
                    Marketplace card
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-border/70 bg-background/70 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-display text-2xl tracking-tight">Calculus Tutor</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        “Proof-friendly explanations. Clean structure. Real problem sets.”
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-card px-3 py-2">
                      <div className="text-xs text-muted-foreground">from</div>
                      <div className="font-semibold">$25/hr</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-xs">
                      <div className="text-muted-foreground">Availability</div>
                      <div className="font-medium">Tue • Thu</div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-xs">
                      <div className="text-muted-foreground">Proficiency</div>
                      <div className="font-medium">Expert</div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => (window.location.href = "/api/login")}
                    className="
                      mt-4 w-full rounded-xl
                      bg-gradient-to-r from-primary to-primary/80
                      text-primary-foreground shadow-lg shadow-primary/20
                      hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5
                      transition-all duration-200
                    "
                    data-testid="landing-preview-cta"
                  >
                    Sign in to book
                  </Button>
                </div>

                <div className="mt-5 text-xs text-muted-foreground">
                  Built for week 1: profiles, tutor discovery, and sessions. Payments later.
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>© {new Date().getFullYear()} StudyBuddy</span>
              <button
                type="button"
                onClick={() => alert("Privacy policy coming soon.")}
                className="hover:text-foreground transition-colors"
                data-testid="landing-privacy"
              >
                Privacy
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
