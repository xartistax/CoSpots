import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import {
  AppProfile,
  AuthMethod,
  GuestPreferencesData,
  GuestProfileData,
  GuestRulesData,
  HostAvailabilityData,
  HostLocationData,
  HostProfileData,
  HostRulesData,
  HostSetupData,
  UserRole,
} from "@/types/user-profile";

export async function getUserProfile(uid: string): Promise<AppProfile | null> {
  const ref = doc(db, "users", uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as AppProfile;
}

export async function createUserProfile(params: { uid: string; email: string; avatarUrl: string | null; authMethod: AuthMethod }) {
  const now = new Date().toISOString();

  const profile: AppProfile = {
    uid: params.uid,
    email: params.email,
    avatarUrl: params.avatarUrl ?? null,
    role: null,
    authMethod: params.authMethod,
    onboardingCompleted: false,
    onboardingStep: "/onboarding",
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, "users", params.uid), profile);
}

export async function setUserRole(params: { uid: string; role: UserRole }) {
  const onboardingStep = params.role === "host" ? "/onboarding/host/profile" : "/onboarding/guest/profile";

  await updateDoc(doc(db, "users", params.uid), {
    role: params.role,
    onboardingStep,
    updatedAt: new Date().toISOString(),
  } satisfies Partial<AppProfile>);
}

export async function saveGuestProfile(params: { uid: string; guestProfile: GuestProfileData }) {
  await updateDoc(doc(db, "users", params.uid), {
    guestProfile: params.guestProfile,
    onboardingStep: "/onboarding/guest/preferences",
    updatedAt: new Date().toISOString(),
  } satisfies Partial<AppProfile>);
}

export async function saveGuestPreferences(params: { uid: string; guestPreferences: GuestPreferencesData }) {
  await updateDoc(doc(db, "users", params.uid), {
    guestPreferences: params.guestPreferences,
    onboardingStep: "/onboarding/guest/rules",
    updatedAt: new Date().toISOString(),
  } satisfies Partial<AppProfile>);
}

export async function saveGuestRules(params: { uid: string; guestRules: GuestRulesData }) {
  await updateDoc(doc(db, "users", params.uid), {
    guestRules: params.guestRules,
    onboardingCompleted: true,
    onboardingStep: "/onboarding/guest/success",
    updatedAt: new Date().toISOString(),
  } satisfies Partial<AppProfile>);
}

export async function saveHostProfile(params: { uid: string; hostProfile: HostProfileData }) {
  await updateDoc(doc(db, "users", params.uid), {
    hostProfile: params.hostProfile,
    onboardingStep: "/onboarding/host/location",
    updatedAt: new Date().toISOString(),
  } satisfies Partial<AppProfile>);
}

export async function saveHostLocation(params: { uid: string; hostLocation: HostLocationData }) {
  await updateDoc(doc(db, "users", params.uid), {
    hostLocation: params.hostLocation,
    onboardingStep: "/onboarding/host/setup",
    updatedAt: new Date().toISOString(),
  } satisfies Partial<AppProfile>);
}

export async function saveHostSetup(params: { uid: string; hostSetup: HostSetupData }) {
  await updateDoc(doc(db, "users", params.uid), {
    hostSetup: params.hostSetup,
    onboardingStep: "/onboarding/host/availability",
    updatedAt: new Date().toISOString(),
  } satisfies Partial<AppProfile>);
}

export async function saveHostAvailability(params: { uid: string; hostAvailability: HostAvailabilityData }) {
  await updateDoc(doc(db, "users", params.uid), {
    hostAvailability: params.hostAvailability,
    onboardingStep: "/onboarding/host/rules",
    updatedAt: new Date().toISOString(),
  } satisfies Partial<AppProfile>);
}

export async function saveHostRules(params: { uid: string; hostRules: HostRulesData }) {
  await updateDoc(doc(db, "users", params.uid), {
    hostRules: params.hostRules,
    onboardingCompleted: true,
    onboardingStep: "/onboarding/host/success",
    updatedAt: new Date().toISOString(),
  } satisfies Partial<AppProfile>);
}
