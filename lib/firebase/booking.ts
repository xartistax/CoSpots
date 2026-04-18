import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import type { BookingData } from "@/types/booking";

export async function getHostBookingsByDate(params: { hostId: string; date: string }): Promise<BookingData[]> {
  const q = query(collection(db, "bookings"), where("hostId", "==", params.hostId), where("date", "==", params.date));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data() as BookingData);
}
