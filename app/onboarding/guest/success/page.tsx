"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";

import { OnboardingShell } from "@/app/onboarding/onboarding-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase/client";
import { onboardingConfig } from "@/lib/config/onboarding";

const DASHBOARD_PATH = "/dashboard";

export default function GuestSuccessPage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const hasCommittedRef = useRef(false);

  useEffect(() => {
    if (!firebaseUser || hasCommittedRef.current) {
      return;
    }

    hasCommittedRef.current = true;

    const commitSuccess = async () => {
      try {
        await updateDoc(doc(db, "users", firebaseUser.uid), {
          onboardingStep: DASHBOARD_PATH,
        });
      } catch (error) {
        console.error("Failed to finalize onboarding success step:", error);
      }
    };

    void commitSuccess();

    const timeout = window.setTimeout(() => {
      router.replace(DASHBOARD_PATH);
    }, 6000);

    return () => window.clearTimeout(timeout);
  }, [firebaseUser, router]);

  return (
    <OnboardingShell title={onboardingConfig.guest.success.title} description={onboardingConfig.guest.success.description}>
      <div className="flex flex-col gap-4">
        <Alert variant="success">{onboardingConfig.guest.success.alert}</Alert>

        <Button className="w-full" onClick={() => router.replace(DASHBOARD_PATH)}>
          {onboardingConfig.guest.success.cta.primary}
        </Button>
      </div>
    </OnboardingShell>
  );
}
