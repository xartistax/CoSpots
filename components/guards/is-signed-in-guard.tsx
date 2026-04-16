"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { Spinner } from "../ui/spinner";

type SignedInGuardProps = {
  children: React.ReactNode;
};

export function SignedInGuard({ children }: SignedInGuardProps) {
  const { loading, firebaseUser, profile } = useAuth();
  const router = useRouter();

  const isProfilePending = !loading && !!firebaseUser && !profile;

  const shouldRedirectToOnboarding = !loading && !!firebaseUser && !!profile && !profile.onboardingCompleted;

  const shouldRedirectToDashboard = !loading && !!firebaseUser && !!profile && profile.onboardingCompleted;

  useEffect(() => {
    if (loading || isProfilePending) {
      return;
    }

    if (shouldRedirectToOnboarding) {
      router.replace(profile.onboardingStep ?? "/onboarding");
      return;
    }

    if (shouldRedirectToDashboard) {
      router.replace("/dashboard");
    }
  }, [loading, isProfilePending, shouldRedirectToOnboarding, shouldRedirectToDashboard, profile, router]);

  if (loading || isProfilePending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Spinner />
      </main>
    );
  }

  if (shouldRedirectToOnboarding || shouldRedirectToDashboard) {
    return null;
  }

  return <>{children}</>;
}
