import * as React from "react";
import { Link, useLocation } from "wouter";
import {
  CalendarClock,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Search,
  Settings2,
} from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/BrandMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, testId: "nav-dashboard" },
  { href: "/find-tutors", label: "Find tutors", icon: Search, testId: "nav-find-tutors" },
  { href: "/sessions", label: "Sessions", icon: CalendarClock, testId: "nav-sessions" },
  { href: "/profile", label: "Profile", icon: GraduationCap, testId: "nav-profile" },
];

function TopBar({ title, right }: { title?: string; right?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-30">
      <div className="mesh-campus">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="
              flex items-center justify-between gap-3
              py-4
            "
          >
            <div className="min-w-0">
              <div className="font-display text-xl tracking-tight sm:text-2xl">
                {title ?? "StudyBuddy"}
              </div>
              <div className="mt-0.5 text-sm text-muted-foreground">
                A calm, campus-first marketplace for tutoring.
              </div>
            </div>
            <div className="flex items-center gap-2">{right}</div>
          </div>
        </div>
      </div>
      <div className="h-px bg-border/70" />
    </div>
  );
}

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const [location] = useLocation();
  const { user, logout, isLoggingOut } = useAuth();

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Student";

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[auto_1fr]">
        <Sidebar
          className="
            border-r border-sidebar-border/70
            bg-sidebar/70 backdrop-blur supports-[backdrop-filter]:bg-sidebar/55
          "
          data-testid="app-sidebar"
        >
          <SidebarHeader className="p-4">
            <BrandMark subtitle="Campus tutoring marketplace" />
          </SidebarHeader>

          <SidebarContent className="px-2 pb-2">
            <SidebarMenu>
              {nav.map((item) => {
                const active =
                  location === item.href ||
                  (item.href !== "/" && location.startsWith(item.href));

                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                          "hover:bg-sidebar-accent/70 hover:shadow-sm",
                          active &&
                            "bg-sidebar-accent ring-1 ring-sidebar-border shadow-sm",
                        )}
                        data-testid={item.testId}
                      >
                        <span
                          className={cn(
                            "grid h-9 w-9 place-items-center rounded-xl border border-sidebar-border/60",
                            "bg-card/60 group-hover:bg-card transition-colors duration-200",
                            active && "bg-card",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

            <div className="mt-6 px-2">
              <div className="glass noise-overlay rounded-2xl p-4 ring-soft">
                <div className="text-xs text-muted-foreground">Signed in as</div>
                <div className="mt-1 font-medium truncate" data-testid="sidebar-user-name">
                  {displayName}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <ThemeToggle data-testid="sidebar-theme-toggle" />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => (window.location.href = "/api/logout")}
                    disabled={isLoggingOut}
                    className="
                      rounded-xl border border-border/70 bg-card/60
                      hover:bg-card hover:shadow-sm transition-all duration-200
                    "
                    data-testid="sidebar-logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="p-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => alert("Settings coming soon.")}
              className="w-full justify-start rounded-xl hover:bg-sidebar-accent/70"
              data-testid="sidebar-settings"
            >
              <Settings2 className="h-4 w-4" />
              <span className="ml-2">Settings</span>
            </Button>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <main className="min-w-0">
          <TopBar
            title={title}
            right={
              <>
                <ThemeToggle data-testid="top-theme-toggle" />
                <Button
                  type="button"
                  onClick={() => logout()}
                  variant="secondary"
                  className="
                    rounded-xl border border-border/70 bg-card/60 backdrop-blur
                    hover:bg-card hover:shadow-sm transition-all duration-200
                  "
                  disabled={isLoggingOut}
                  data-testid="top-logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </span>
                </Button>
              </>
            }
          />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <div className="animate-enter">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
