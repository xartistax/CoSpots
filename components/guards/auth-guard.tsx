"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { protectedRoutes } from "@/lib/config/protected-routes";
import { matchProtectedRoute } from "@/lib/auth/match-route";

type AuthGuardProps = {
  children: React.ReactNode;
};

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Spinner />
    </main>
  );
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { loading, firebaseUser, profile } = useAuth();

  const matchedRoute = matchProtectedRoute(pathname, protectedRoutes);
  const isProtected = !!matchedRoute;
  const isProfilePending = !loading && !!firebaseUser && !profile;

  const isAllowedByRole = !matchedRoute?.roles?.length || (!!profile?.role && matchedRoute.roles.includes(profile.role));

  const isAllowedByAccessRole = !matchedRoute?.accessRoles?.length || (!!profile?.accessRole && matchedRoute.accessRoles.includes(profile.accessRole));

  const hasRoleRestriction = !!matchedRoute?.roles?.length || !!matchedRoute?.accessRoles?.length;

  const canAccessByRoleOrAccessRole = hasRoleRestriction ? isAllowedByRole || isAllowedByAccessRole : true;

  useEffect(() => {
    if (!matchedRoute || loading || isProfilePending) {
      return;
    }

    if (matchedRoute.requireAuth && !firebaseUser) {
      router.replace("/auth/sign-in");
      return;
    }

    if (!profile) {
      return;
    }

    if (matchedRoute.requireOnboarding && !profile.onboardingCompleted) {
      router.replace(profile.onboardingStep ?? "/onboarding");
      return;
    }

    if (!canAccessByRoleOrAccessRole) {
      router.replace("/");
    }
  }, [canAccessByRoleOrAccessRole, firebaseUser, isProfilePending, loading, matchedRoute, profile, router]);

  if (!isProtected) {
    return <>{children}</>;
  }

  if (loading || isProfilePending) {
    return <LoadingScreen />;
  }

  if (!firebaseUser) {
    return null;
  }

  if (!profile) {
    return <LoadingScreen />;
  }

  if (matchedRoute?.requireOnboarding && !profile.onboardingCompleted) {
    return null;
  }

  if (!canAccessByRoleOrAccessRole) {
    return null;
  }

  return <>{children}</>;
}
