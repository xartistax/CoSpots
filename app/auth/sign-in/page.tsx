"use client";

import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

import { OnboardingShell } from "@/app/onboarding/onboarding-shell";
import { GoogleButton } from "@/components/ui/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authConfig } from "@/lib/config/auth";
import { auth } from "@/lib/firebase/client";
import { getUserProfile } from "@/lib/firebase/user-profile";
import { useAuth } from "@/components/providers/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { firebaseUser, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    setLoading(true);
    setError("");

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getUserProfile(result.user.uid);

      if (!profile) {
        router.replace("/onboarding");
        return;
      }

      if (profile.onboardingCompleted) {
        router.replace("/dashboard");
        return;
      }

      router.replace(profile.onboardingStep ?? "/onboarding");
    } catch (error) {
      console.error("Login Error:", error);
      setError("Login fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading && !firebaseUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Spinner />
      </main>
    );
  }

  // 🔥 optional: verhindert render wenn redirect kommt
  if (firebaseUser) {
    return null;
  }

  return (
    <OnboardingShell title={authConfig.login.title} description={authConfig.login.description}>
      <div className="flex flex-col gap-6">
        <GoogleButton />

        <div className="relative text-center text-sm">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">oder</span>
          <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 border-t" />
        </div>

        <form action={onSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor={authConfig.login.fields.email.id}>{authConfig.login.fields.email.label}</Label>
            <Input id={authConfig.login.fields.email.id} name={authConfig.login.fields.email.id} type="email" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={authConfig.login.fields.password.id}>{authConfig.login.fields.password.label}</Label>
            <Input id={authConfig.login.fields.password.id} name={authConfig.login.fields.password.id} type="password" required />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" disabled={loading}>
            {loading ? "Lädt..." : "Login"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Kein Konto?{" "}
            <Link href="/auth/sign-up" className="underline underline-offset-4">
              Registrieren
            </Link>
          </p>
        </form>
      </div>
    </OnboardingShell>
  );
}
