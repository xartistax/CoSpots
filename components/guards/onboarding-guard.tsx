"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { Spinner } from "@/components/ui/spinner";

type OnboardingGuardProps = {
  children: ReactNode;
};

const GUEST_SUCCESS_PATH = "/onboarding/guest/success";
const HOST_SUCCESS_PATH = "/onboarding/host/success";
const DEFAULT_ONBOARDING_PATH = "/onboarding";
const APP_HOME_PATH = "/";

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
}

function normalizeStep(step: string | null | undefined): string {
  if (!step) {
    return DEFAULT_ONBOARDING_PATH;
  }

  const trimmed = step.trim();

  if (!trimmed) {
    return DEFAULT_ONBOARDING_PATH;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Spinner />
    </main>
  );
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, firebaseUser, profile } = useAuth();

  const currentPath = normalizePath(pathname);
  const currentStep = normalizePath(normalizeStep(profile?.onboardingStep));
  const isSuccessPath = currentPath === GUEST_SUCCESS_PATH || currentPath === HOST_SUCCESS_PATH;
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
      if (currentPath !== currentStep) {
        router.replace(currentStep);
      }
      return;
    }

    if (isSuccessPath) {
      return;
    }

    router.replace(APP_HOME_PATH);
  }, [loading, isProfilePending, firebaseUser, profile, currentPath, currentStep, isSuccessPath, router]);

  if (loading || isProfilePending) {
    return <LoadingScreen />;
  }

  if (!firebaseUser || !profile) {
    return <LoadingScreen />;
  }

  if (!profile.onboardingCompleted && currentPath !== currentStep) {
    return <LoadingScreen />;
  }

  if (profile.onboardingCompleted && !isSuccessPath) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
