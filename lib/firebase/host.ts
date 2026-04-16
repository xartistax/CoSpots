import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import type { AppProfile } from "@/types/user-profile";

export async function getHosts(): Promise<AppProfile[]> {
  const q = query(collection(db, "users"), where("role", "==", "host"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data() as AppProfile);
}
