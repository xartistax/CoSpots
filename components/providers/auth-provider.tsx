"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { auth, db } from "@/lib/firebase/client";
import { createUserProfile } from "@/lib/firebase/user-profile";
import type { AppProfile, AuthMethod } from "@/types/user-profile";

type AuthContextValue = {
  firebaseUser: User | null;
  profile: AppProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<AppProfile | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getAuthMethod(user: User): AuthMethod {
  const providerIds = user.providerData.map((provider) => provider.providerId);

  if (providerIds.includes("google.com")) {
    return "google";
  }

  return "email";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile(): Promise<AppProfile | null> {
    if (!auth.currentUser) {
      setProfile(null);
      return null;
    }

    const snapshot = await getDoc(doc(db, "users", auth.currentUser.uid));

    if (!snapshot.exists()) {
      return null;
    }

    const nextProfile = snapshot.data() as AppProfile;
    setProfile(nextProfile);
    return nextProfile;
  }

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setFirebaseUser(user);

      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const profileRef = doc(db, "users", user.uid);

      unsubscribeProfile = onSnapshot(
        profileRef,
        async (snapshot) => {
          try {
            if (!snapshot.exists()) {
              await createUserProfile({
                uid: user.uid,
                email: user.email ?? "",
                avatarUrl: user.photoURL ?? null,
                authMethod: getAuthMethod(user),
              });

              const createdSnapshot = await getDoc(profileRef);

              if (!createdSnapshot.exists()) {
                setProfile(null);
                setLoading(false);
                return;
              }

              setProfile(createdSnapshot.data() as AppProfile);
              setLoading(false);
              return;
            }

            setProfile(snapshot.data() as AppProfile);
            setLoading(false);
          } catch (error) {
            console.error("AuthProvider profile bootstrap error:", error);
            setProfile(null);
            setLoading(false);
            await signOut(auth);
          }
        },
        async (error) => {
          console.error("AuthProvider profile error:", error);
          setProfile(null);
          setLoading(false);
          await signOut(auth);
        },
      );
    });

    return () => {
      unsubscribeAuth();

      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      profile,
      loading,
      refreshProfile,
    }),
    [firebaseUser, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
