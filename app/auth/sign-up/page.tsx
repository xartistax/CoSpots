"use client";

import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { OnboardingShell } from "@/app/onboarding/onboarding-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authConfig } from "@/lib/config/auth";
import { auth } from "@/lib/firebase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    setLoading(true);
    setError("");

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken(true);

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Session konnte nicht gesetzt werden.");
      }

      router.replace("/onboarding");
      router.refresh();
    } catch (error) {
      console.error("Sign up error:", error);
      setError("Registrierung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingShell title={authConfig.signUp.title} description={authConfig.signUp.description}>
      <div className="flex flex-col gap-6">
        <GoogleButton>Mit Google registrieren</GoogleButton>

        <div className="relative text-center">
          <div className="absolute inset-0 top-1/2 -translate-y-1/2 border-t" />
          <span className="relative z-10 bg-background px-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">oder</span>
        </div>

        <form action={onSubmit} className="flex flex-col gap-5">
          <div className="space-y-2.5">
            <Label htmlFor={authConfig.signUp.fields.email.id} className="text-sm font-medium">
              {authConfig.signUp.fields.email.label}
            </Label>
            <Input
              id={authConfig.signUp.fields.email.id}
              name={authConfig.signUp.fields.email.id}
              type="email"
              required
              placeholder="name@beispiel.ch"
              className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={authConfig.signUp.fields.password.id} className="text-sm font-medium">
              {authConfig.signUp.fields.password.label}
            </Label>
            <Input
              id={authConfig.signUp.fields.password.id}
              name={authConfig.signUp.fields.password.id}
              type="password"
              required
              placeholder="Passwort erstellen"
              className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" disabled={loading} className="h-12 rounded-2xl text-sm font-medium">
            {loading ? "Lädt..." : "Konto erstellen"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Bereits ein Konto?{" "}
            <Link href="/auth/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </OnboardingShell>
  );
}
