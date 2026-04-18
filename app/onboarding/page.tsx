"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, UserRound } from "lucide-react";

import { OnboardingShell } from "./onboarding-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Spinner />
      </main>
    );
  }

  return (
    <OnboardingShell title={onboardingConfig.welcome.title} description={onboardingConfig.welcome.description}>
      <div className="space-y-4">
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleRoleSelect("guest")}
          className="w-full rounded-[24px] border bg-background p-5 text-left transition hover:border-foreground/20 hover:bg-muted/30 disabled:pointer-events-none disabled:opacity-60"
        >
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
              <UserRound className="size-5" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold tracking-tight">{onboardingConfig.welcome.cta.guest}</p>
              <p className="text-sm leading-6 text-muted-foreground">Finde CoSpots, buche flexible Slots und arbeite dort, wo es für dich am besten passt.</p>
            </div>
          </div>
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={() => handleRoleSelect("host")}
          className="w-full rounded-[24px] border bg-background p-5 text-left transition hover:border-foreground/20 hover:bg-muted/30 disabled:pointer-events-none disabled:opacity-60"
        >
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
              <Briefcase className="size-5" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold tracking-tight">{onboardingConfig.welcome.cta.host}</p>
              <p className="text-sm leading-6 text-muted-foreground">
                Öffne deinen Spot für produktive Gäste, verwalte Buchungen und fülle freie Kapazitäten smarter.
              </p>
            </div>
          </div>
        </button>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="button" variant="ghost" className="h-auto w-full rounded-2xl px-4 py-3 text-sm text-muted-foreground hover:text-foreground" disabled>
          {submitting ? "Speichert..." : "Wähle eine Option, um fortzufahren"}
        </Button>
      </div>
    </OnboardingShell>
  );
}
