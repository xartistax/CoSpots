"use client";

import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import { createUserProfile, getUserProfile } from "@/lib/firebase/user-profile";
import { cn } from "@/lib/utils";
import { GoogleIcon } from "./icons";

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
      const user = result.user;

      const existingProfile = await getUserProfile(user.uid);

      if (!existingProfile) {
        await createUserProfile({
          uid: user.uid,
          email: user.email ?? "",
          avatarUrl: user.photoURL ?? null,
          authMethod: "google",
        });
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
    <Button type="button" variant="outline" onClick={handleLogin} disabled={loading} className={cn("w-full", className)}>
      <GoogleIcon className="mr-2" />
      {children}
    </Button>
  );
}
