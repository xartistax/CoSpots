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
const DASHBOARD_PATH = "/dashboard";

function normalizeOnboardingStep(step: string | null | undefined): string {
  if (!step) {
    return "/onboarding";
  }

  const trimmed = step.trim();

  if (!trimmed) {
    return "/onboarding";
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed}`;
}

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
}

function RedirectScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Spinner />
    </main>
  );
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { loading, firebaseUser, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const currentPath = normalizePath(pathname);
  const currentStep = normalizePath(normalizeOnboardingStep(profile?.onboardingStep));

  const isProfilePending = !loading && !!firebaseUser && !profile;
  const shouldRedirectToLogin = !loading && !firebaseUser;

  const canViewSuccessPage =
    !loading &&
    !!firebaseUser &&
    !!profile &&
    profile.onboardingCompleted &&
    ((currentStep === GUEST_SUCCESS_PATH && currentPath === GUEST_SUCCESS_PATH) || (currentStep === HOST_SUCCESS_PATH && currentPath === HOST_SUCCESS_PATH));

  const shouldRedirectCompletedUserToDashboard = !loading && !!firebaseUser && !!profile && profile.onboardingCompleted && !canViewSuccessPage;

  const shouldRedirectIncompleteUserToCurrentStep = !loading && !!firebaseUser && !!profile && !profile.onboardingCompleted && currentPath !== currentStep;

  useEffect(() => {
    if (loading || isProfilePending) {
      return;
    }

    if (shouldRedirectToLogin) {
      router.replace("/auth/sign-in");
      return;
    }

    if (shouldRedirectCompletedUserToDashboard) {
      router.replace(DASHBOARD_PATH);
      return;
    }

    if (shouldRedirectIncompleteUserToCurrentStep) {
      router.replace(currentStep);
    }
  }, [
    loading,
    isProfilePending,
    shouldRedirectToLogin,
    shouldRedirectCompletedUserToDashboard,
    shouldRedirectIncompleteUserToCurrentStep,
    currentStep,
    router,
  ]);

  if (loading || isProfilePending) {
    return <RedirectScreen />;
  }

  if (shouldRedirectToLogin || shouldRedirectCompletedUserToDashboard || shouldRedirectIncompleteUserToCurrentStep) {
    return <RedirectScreen />;
  }

  return <>{children}</>;
}
