"use client";

import { OnboardingGuard } from "@/components/guards/onboarding-guard";
import { ReactNode } from "react";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <OnboardingGuard>{children}</OnboardingGuard>;
}
