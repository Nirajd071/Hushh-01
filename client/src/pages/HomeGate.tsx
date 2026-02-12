import * as React from "react";
import { Redirect } from "wouter";
import { useMe } from "@/hooks/use-me";
import LandingPage from "@/pages/LandingPage";

export default function HomeGate() {
  const me = useMe();

  if (me.isLoading) {
    return <LandingPage />;
  }

  if (!me.data) {
    return <LandingPage />;
  }

  return <Redirect to="/dashboard" />;
}
