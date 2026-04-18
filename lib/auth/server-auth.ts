import { cookies } from "next/headers";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { AppProfile } from "@/types/user-profile";

export type ServerAuthUser = {
  uid: string;
  email: string | null;
  isAdmin: boolean;
  profile: AppProfile | null;
};

const SESSION_COOKIE_NAME = "firebase_id_token";

export async function getServerAuthUser(): Promise<ServerAuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token, true);
    const profileSnapshot = await adminDb.collection("users").doc(decoded.uid).get();
    const profile = profileSnapshot.exists ? (profileSnapshot.data() as AppProfile) : null;

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      isAdmin: decoded.admin === true || profile?.accessRole === "admin",
      profile,
    };
  } catch (error) {
    console.error("getServerAuthUser error:", error);
    return null;
  }
}

export async function requireServerAuth() {
  const user = await getServerAuthUser();

  if (!user) {
    throw new Error("Nicht autorisiert.");
  }

  return user;
}

export async function requireAdminOrHostOwner(hostId: string) {
  const user = await requireServerAuth();

  if (user.isAdmin) {
    return user;
  }

  if (user.uid !== hostId) {
    throw new Error("Keine Berechtigung.");
  }

  return user;
}
