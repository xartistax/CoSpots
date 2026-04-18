"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import { Spinner } from "@/components/ui/spinner";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;

    setLoading(true);

    try {
      await fetch("/api/auth/session", {
        method: "DELETE",
      });

      await signOut(auth);

      router.replace("/auth/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="outline" onClick={handleLogout} disabled={loading} className="min-w-28">
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Spinner />
          Abmelden...
        </span>
      ) : (
        "Logout"
      )}
    </Button>
  );
}
