import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ "data-testid": testId }: { "data-testid"?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const current = resolvedTheme || theme;

  const toggle = () => setTheme(current === "dark" ? "light" : "dark");

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={toggle}
      className="
        group rounded-xl border border-border/70
        bg-card/60 backdrop-blur
        hover:bg-card hover:shadow-sm
        transition-all duration-200
      "
      data-testid={testId ?? "theme-toggle"}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 transition-all duration-200 group-hover:-rotate-12 dark:opacity-40" />
      <Moon className="ml-2 h-4 w-4 transition-all duration-200 group-hover:rotate-12 opacity-40 dark:opacity-100" />
      <span className="ml-2 hidden sm:inline">Theme</span>
    </Button>
  );
}
