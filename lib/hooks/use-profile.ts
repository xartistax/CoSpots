"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { AppProfile } from "@/types/user-profile";

export function useProfile(): AppProfile {
  const { profile } = useAuth();

  if (!profile) {
    throw new Error("useProfile must be used inside a protected area");
  }

  return profile;
}
