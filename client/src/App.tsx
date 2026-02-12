import * as React from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import HomeGate from "@/pages/HomeGate";
import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import FindTutorsPage from "@/pages/FindTutorsPage";
import TutorDetailPage from "@/pages/TutorDetailPage";
import SessionsPage from "@/pages/SessionsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeGate} />
      <Route path="/landing" component={LandingPage} />

      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/find-tutors" component={FindTutorsPage} />
      <Route path="/tutors/:tutorId" component={TutorDetailPage} />
      <Route path="/sessions" component={SessionsPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
