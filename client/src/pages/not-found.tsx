import { Link } from "wouter";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen mesh-campus grid place-items-center px-4">
      <Card className="w-full max-w-xl rounded-3xl border border-card-border/70 bg-card shadow-lg noise-overlay">
        <div className="p-7 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-3xl border border-border/70 bg-muted/40">
              <AlertTriangle className="h-5 w-5 text-[hsl(var(--chart-3))]" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-2xl tracking-tight">Page not found</div>
              <div className="mt-1 text-sm text-muted-foreground">
                The link may be broken—or the page has moved.
              </div>
              <div className="mt-5 flex flex-col sm:flex-row gap-2">
                <Link
                  href="/"
                  className="inline-flex"
                  data-testid="notfound-home"
                >
                  <Button className="rounded-xl">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="ml-2">Go home</span>
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => (window.location.href = "/api/login")}
                  data-testid="notfound-login"
                >
                  Sign in
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
