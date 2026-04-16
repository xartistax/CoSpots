"use client";

import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

import { OnboardingShell } from "@/app/onboarding/onboarding-shell";
import { GoogleButton } from "@/components/ui/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authConfig } from "@/lib/config/auth";
import { auth } from "@/lib/firebase/client";
import { createUserProfile } from "@/lib/firebase/user-profile";
import { useState } from "react";

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

      await createUserProfile({
        uid: result.user.uid,
        email,
        avatarUrl: null,
      });

      router.push("/onboarding");
    } catch {
      setError("Registrierung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingShell title={authConfig.signUp.title} description={authConfig.signUp.description}>
      <div className="flex flex-col gap-6">
        <GoogleButton />

        <div className="relative text-center text-sm">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">oder</span>
          <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 border-t" />
        </div>

        <form action={onSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor={authConfig.signUp.fields.email.id}>{authConfig.signUp.fields.email.label}</Label>
            <Input id={authConfig.signUp.fields.email.id} name={authConfig.signUp.fields.email.id} type="email" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={authConfig.signUp.fields.password.id}>{authConfig.signUp.fields.password.label}</Label>
            <Input id={authConfig.signUp.fields.password.id} name={authConfig.signUp.fields.password.id} type="password" required />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" disabled={loading}>
            {loading ? "Lädt..." : "Registrieren"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Bereits ein Konto?{" "}
            <Link href="/auth/sign-in" className="underline underline-offset-4">
              Login
            </Link>
          </p>
        </form>
      </div>
    </OnboardingShell>
  );
}
