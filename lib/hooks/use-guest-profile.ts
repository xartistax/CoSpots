"use client";

import { useProfile } from "@/lib/hooks/use-profile";

export function useGuestProfile() {
  const profile = useProfile();

  if (profile.role !== "guest") {
    throw new Error("Guest profile not available");
  }

  return {
    profile,
    guestProfile: profile.guestProfile,
    guestPreferences: profile.guestPreferences,
    guestRules: profile.guestRules,
  };
}
