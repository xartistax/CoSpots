import type { ReactNode } from "react";

import { OnboardingGuard } from "@/components/guards/onboarding-guard";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <OnboardingGuard>{children}</OnboardingGuard>;
}
