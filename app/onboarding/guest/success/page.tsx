"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { OnboardingShell } from "@/app/onboarding/onboarding-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { onboardingConfig } from "@/lib/config/onboarding";
import { finalizeGuestOnboarding } from "@/lib/firebase/user-profile";

const NEXT_PATH = "/";
const AUTO_REDIRECT_MS = 10_000;

export default function GuestSuccessPage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!firebaseUser || hasRunRef.current) {
      return;
    }

    hasRunRef.current = true;

    void finalizeGuestOnboarding(firebaseUser.uid).catch((error) => {
      console.error("Finalize guest onboarding failed:", error);
    });

    const timeout = window.setTimeout(() => {
      router.replace(NEXT_PATH);
      router.refresh();
    }, AUTO_REDIRECT_MS);

    return () => window.clearTimeout(timeout);
  }, [firebaseUser, router]);

  return (
    <OnboardingShell title={onboardingConfig.guest.success.title} description={onboardingConfig.guest.success.description}>
      <div className="flex flex-col gap-4">
        <Alert variant="success">{onboardingConfig.guest.success.alert}</Alert>

        <Button
          className="h-12 w-full rounded-2xl text-sm font-medium"
          onClick={() => {
            router.replace(NEXT_PATH);
            router.refresh();
          }}
        >
          {onboardingConfig.guest.success.cta.primary}
        </Button>
      </div>
    </OnboardingShell>
  );
}
