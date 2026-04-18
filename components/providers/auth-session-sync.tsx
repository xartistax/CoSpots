"use client";

import { useEffect } from "react";
import { onIdTokenChanged } from "firebase/auth";

import { auth } from "@/lib/firebase/client";

export function AuthSessionSync() {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      try {
        if (!user) {
          await fetch("/api/auth/session", {
            method: "DELETE",
          });
          return;
        }

        const token = await user.getIdToken();

        await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
      } catch (error) {
        console.error("AuthSessionSync error:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
