"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { OnboardingShell } from "./onboarding-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { onboardingConfig } from "@/lib/config/onboarding";
import { setUserRole } from "@/lib/firebase/user-profile";

export default function OnboardingPage() {
  const router = useRouter();
  const { loading, firebaseUser, profile } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleRoleSelect(role: "guest" | "host") {
    if (!firebaseUser) {
      setError("Nicht eingeloggt");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await setUserRole({
        uid: firebaseUser.uid,
        role,
      });

      router.push(role === "host" ? "/onboarding/host/profile" : "/onboarding/guest/profile");
    } catch (error) {
      console.error("Role select error:", error);
      setError("Rolle konnte nicht gespeichert werden");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !firebaseUser || !profile) {
    return null;
  }

  return (
    <OnboardingShell title={onboardingConfig.welcome.title} description={onboardingConfig.welcome.description}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Button type="button" size="lg" className="w-full" disabled={submitting} onClick={() => handleRoleSelect("guest")}>
            {onboardingConfig.welcome.cta.guest}
          </Button>

          <Button type="button" size="lg" variant="outline" className="w-full" disabled={submitting} onClick={() => handleRoleSelect("host")}>
            {onboardingConfig.welcome.cta.host}
          </Button>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </OnboardingShell>
  );
}
