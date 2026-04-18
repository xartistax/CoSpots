"use server";

import { revalidatePath } from "next/cache";

import { adminDb } from "@/lib/firebase/admin";
import { requireAdminOrHostOwner, requireServerAuth } from "@/lib/auth/server-auth";
import type { BookingData, BookingStatus } from "@/types/booking";

const VALID_STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled"];

function isValidStatus(value: string): value is BookingStatus {
  return VALID_STATUSES.includes(value as BookingStatus);
}

export async function updateBookingStatusAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const hostId = String(formData.get("hostId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!bookingId || !hostId || !isValidStatus(status)) {
    throw new Error("Ungültige Buchungsdaten.");
  }

  await requireAdminOrHostOwner(hostId);

  await adminDb.collection("bookings").doc(bookingId).update({
    status,
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/host/bookings");
  revalidatePath("/user/bookings");
}

export async function cancelOwnBookingAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") ?? "").trim();

  if (!bookingId) {
    throw new Error("Ungültige Buchung.");
  }

  const authUser = await requireServerAuth();
  const bookingSnapshot = await adminDb.collection("bookings").doc(bookingId).get();

  if (!bookingSnapshot.exists) {
    throw new Error("Buchung wurde nicht gefunden.");
  }

  const booking = bookingSnapshot.data() as BookingData;

  if (!authUser.isAdmin && booking.guestUid !== authUser.uid) {
    throw new Error("Keine Berechtigung.");
  }

  await adminDb.collection("bookings").doc(bookingId).update({
    status: "cancelled",
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/user/bookings");
  revalidatePath("/host/bookings");
}
