"use client";

import { signOut } from "firebase/auth";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import { Spinner } from "@/components/ui/spinner";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;

    setLoading(true);

    try {
      await signOut(auth);
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
