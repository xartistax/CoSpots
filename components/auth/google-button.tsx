"use client";

import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import { GoogleIcon } from "../ui/icons";

type GoogleButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

export function GoogleButton({ children = "Mit Google fortfahren", className }: GoogleButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
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
      console.error("Google Login Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleLogin}
      disabled={loading}
      className={cn("h-12 w-full rounded-2xl border-border/80 bg-background text-sm font-medium shadow-none hover:bg-muted/40", className)}
    >
      <GoogleIcon className="mr-2 size-4" />
      {children}
    </Button>
  );
}
