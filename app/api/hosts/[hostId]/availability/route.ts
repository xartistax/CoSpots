import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase/admin";
import { getAvailableSlots } from "@/lib/booking/slots";
import type { AppProfile } from "@/types/user-profile";
import type { BookingData } from "@/types/booking";

type RouteContext = {
  params: Promise<{
    hostId: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { hostId } = await context.params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date")?.trim() ?? "";

    if (!hostId || !date) {
      return NextResponse.json({ message: "hostId und date sind erforderlich." }, { status: 400 });
    }

    const hostSnapshot = await adminDb.collection("users").doc(hostId).get();

    if (!hostSnapshot.exists) {
      return NextResponse.json({ message: "Host wurde nicht gefunden." }, { status: 404 });
    }

    const host = hostSnapshot.data() as AppProfile;

    if (host.role !== "host") {
      return NextResponse.json({ message: "Ungültiger Host." }, { status: 400 });
    }

    const bookingsSnapshot = await adminDb.collection("bookings").where("hostId", "==", hostId).where("date", "==", date).get();

    const bookings = bookingsSnapshot.docs.map((doc) => doc.data() as BookingData);

    const slots = getAvailableSlots({
      date,
      availability: host.hostAvailability,
      setup: host.hostSetup,
      bookings,
    });

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Host availability error:", error);

    return NextResponse.json({ message: "Verfügbarkeit konnte nicht geladen werden." }, { status: 500 });
  }
}
