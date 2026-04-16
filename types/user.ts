import { UserRole } from "./user-profile";

export type UserProfile = {
  uid: string;
  email: string;
  name: string;
  role: UserRole | null;
  onboardingCompleted: boolean;
  onboardingStep: string | null;
  createdAt: string;
  updatedAt: string;
};
