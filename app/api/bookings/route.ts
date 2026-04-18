import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase/admin";
import { getServerAuthUser } from "@/lib/auth/server-auth";
import { getAvailableSlots } from "@/lib/booking/slots";
import { bookingSchema } from "@/lib/validation/booking";
import type { BookingData } from "@/types/booking";
import type { AppProfile } from "@/types/user-profile";

export async function POST(request: Request) {
  try {
    const authUser = await getServerAuthUser();

    if (!authUser) {
      return NextResponse.json({ message: "Bitte melde dich an, um zu buchen." }, { status: 401 });
    }

    if (authUser.profile?.role !== "guest") {
      return NextResponse.json({ message: "Nur Gäste können Buchungen erstellen." }, { status: 403 });
    }

    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Ungültige Buchungsdaten.",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const values = parsed.data;

    const guestEmail = authUser.email?.trim();

    if (!guestEmail) {
      return NextResponse.json({ message: "Dein Account hat keine gültige E-Mail." }, { status: 400 });
    }

    const bookingId = randomUUID();
    const now = new Date().toISOString();

    const result = await adminDb.runTransaction(async (transaction) => {
      const hostRef = adminDb.collection("users").doc(values.hostId);
      const hostSnapshot = await transaction.get(hostRef);

      if (!hostSnapshot.exists) {
        throw new Error("HOST_NOT_FOUND");
      }

      const host = hostSnapshot.data() as AppProfile;

      if (host.role !== "host") {
        throw new Error("INVALID_HOST");
      }

      const duplicateQuery = adminDb
        .collection("bookings")
        .where("guestUid", "==", authUser.uid)
        .where("date", "==", values.date)
        .where("startTime", "==", values.startTime)
        .where("status", "in", ["pending", "confirmed"])
        .limit(1);

      const duplicateSnapshot = await transaction.get(duplicateQuery);

      if (!duplicateSnapshot.empty) {
        throw new Error("DUPLICATE_BOOKING");
      }

      const bookingsQuery = adminDb.collection("bookings").where("hostId", "==", values.hostId).where("date", "==", values.date);

      const bookingsSnapshot = await transaction.get(bookingsQuery);

      const bookings = bookingsSnapshot.docs.map((doc) => doc.data() as BookingData);

      const slots = getAvailableSlots({
        date: values.date,
        availability: host.hostAvailability,
        setup: host.hostSetup,
        bookings,
      });

      const matchingSlot = slots.find((slot) => slot.startTime === values.startTime && slot.endTime === values.endTime);

      if (!matchingSlot || matchingSlot.remainingSpots <= 0) {
        throw new Error("SLOT_UNAVAILABLE");
      }

      const booking: BookingData = {
        id: bookingId,
        hostId: values.hostId,
        hostName: host.hostProfile?.locationName ?? "Unknown",
        guestUid: authUser.uid,
        guestName: values.guestName.trim(),
        guestEmail,
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        notes: values.notes?.trim() ? values.notes.trim() : null,
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };

      const bookingRef = adminDb.collection("bookings").doc(bookingId);
      transaction.set(bookingRef, booking);

      return { bookingId };
    });

    return NextResponse.json(
      {
        message: "Buchung erfolgreich erstellt.",
        bookingId: result.bookingId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create booking error:", error);

    if (error instanceof Error) {
      if (error.message === "HOST_NOT_FOUND") {
        return NextResponse.json({ message: "Host wurde nicht gefunden." }, { status: 404 });
      }

      if (error.message === "INVALID_HOST") {
        return NextResponse.json({ message: "Ungültiger Host." }, { status: 400 });
      }

      if (error.message === "DUPLICATE_BOOKING") {
        return NextResponse.json({ message: "Diesen Slot hast du bereits gebucht." }, { status: 409 });
      }

      if (error.message === "SLOT_UNAVAILABLE") {
        return NextResponse.json({ message: "Dieser Slot ist nicht mehr verfügbar." }, { status: 409 });
      }
    }

    return NextResponse.json({ message: "Buchung konnte nicht erstellt werden." }, { status: 500 });
  }
}
