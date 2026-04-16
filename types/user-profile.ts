export type UserRole = "guest" | "host";
export type AuthMethod = "google" | "email";

export type GuestProfileData = {
  industry: string;
  purpose: string;
  networking: boolean;
  bio: string;
  linkedin: string | null;
  website: string | null;
};

export type GuestPreferencesData = {
  city: string;
  times: string[];
  important: string[];
};

export type GuestRulesData = {
  accepted: string[];
};

export type HostProfileData = {
  operatorName: string;
  phone: string;
  locationName: string;
  address: string;
  city: string;
};

export type HostLocationData = {
  category: string;
  description: string;
  website: string;
  instagram: string;
  amenities: string[];
};

export type HostSetupData = {
  spots: number;
  price: number;
  marked: boolean;
  laptopZoneOnly: boolean;
  slotDuration: string;
};

export type HostAvailabilityData = {
  days: string[];
  from: string;
  to: string;
  recurring: boolean;
  gracePeriod: number;
  extendAllowed: boolean;
};

export type HostRulesData = {
  accepted: string[];
};

export type AppProfile = {
  uid: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole | null;
  authMethod: AuthMethod | null;
  onboardingCompleted: boolean;
  onboardingStep: string | null;
  createdAt: string;
  updatedAt: string;
  guestProfile?: GuestProfileData;
  guestPreferences?: GuestPreferencesData;
  guestRules?: GuestRulesData;
  hostProfile?: HostProfileData;
  hostLocation?: HostLocationData;
  hostSetup?: HostSetupData;
  hostAvailability?: HostAvailabilityData;
  hostRules?: HostRulesData;
};
