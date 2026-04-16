"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { Spinner } from "../ui/spinner";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { loading, firebaseUser, profile } = useAuth();

  const isProfilePending = !loading && !!firebaseUser && !profile;

  useEffect(() => {
    if (loading || isProfilePending) {
      return;
    }

    if (!firebaseUser) {
      router.replace("/auth/sign-in");
      return;
    }

    if (!profile) {
      return;
    }

    if (!profile.onboardingCompleted) {
      router.replace(profile.onboardingStep ?? "/onboarding");
    }
  }, [loading, isProfilePending, firebaseUser, profile, router]);

  if (loading || isProfilePending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Spinner />
      </main>
    );
  }

  if (!firebaseUser || !profile || !profile.onboardingCompleted) {
    return null;
  }

  return <>{children}</>;
}
