"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { Spinner } from "@/components/ui/spinner";

type SignedInGuardProps = {
  children: ReactNode;
};

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Spinner />
    </main>
  );
}

export function SignedInGuard({ children }: SignedInGuardProps) {
  const router = useRouter();
  const { loading, firebaseUser, profile } = useAuth();
  const isProfilePending = !loading && !!firebaseUser && !profile;

  useEffect(() => {
    if (loading || isProfilePending) {
      return;
    }

    if (!firebaseUser) {
      return;
    }

    if (!profile) {
      return;
    }

    if (profile.onboardingCompleted) {
      router.replace("/");
      return;
    }

    router.replace(profile.onboardingStep ?? "/onboarding");
  }, [loading, isProfilePending, firebaseUser, profile, router]);

  if (loading || isProfilePending) {
    return <LoadingScreen />;
  }

  if (firebaseUser) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
