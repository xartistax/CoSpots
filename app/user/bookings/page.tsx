import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, Clock3, Search, Ticket } from "lucide-react";

import { adminDb } from "@/lib/firebase/admin";
import { getServerAuthUser } from "@/lib/auth/server-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CancelBookingButton } from "@/components/bookings/cancel-booking-button";
import type { BookingData } from "@/types/booking";

async function getOwnBookings(uid: string): Promise<BookingData[]> {
  const snapshot = await adminDb.collection("bookings").where("guestUid", "==", uid).get();

  return snapshot.docs.map((doc) => doc.data() as BookingData).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function getStatusLabel(status: BookingData["status"]) {
  switch (status) {
    case "confirmed":
      return "Bestätigt";
    case "cancelled":
      return "Storniert";
    default:
      return "Ausstehend";
  }
}

function getStatusVariant(status: BookingData["status"]) {
  switch (status) {
    case "confirmed":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}

function getBookingDateTimeValue(booking: BookingData): number {
  return new Date(`${booking.date}T${booking.startTime}:00`).getTime();
}

function isUpcomingBooking(booking: BookingData): boolean {
  if (booking.status === "cancelled") {
    return false;
  }

  return getBookingDateTimeValue(booking) >= Date.now();
}

function formatCreatedAt(value: string): string {
  return new Date(value).toLocaleString("de-CH");
}

function DashboardStatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-muted">{icon}</div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: BookingData }) {
  const canCancel = booking.status === "pending" || booking.status === "confirmed";

  return (
    <article className="rounded-3xl border bg-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold tracking-tight">{booking.hostName}</h3>

            <Badge variant={getStatusVariant(booking.status)}>{getStatusLabel(booking.status)}</Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            {booking.date} · {booking.startTime} – {booking.endTime}
          </p>
        </div>

        <CancelBookingButton bookingId={booking.id} disabled={!canCancel} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border p-4">
          <p className="text-sm text-muted-foreground">Gast</p>
          <p className="mt-1 font-medium">{booking.guestName}</p>
          <p className="mt-1 text-sm text-muted-foreground">{booking.guestEmail}</p>
        </div>

        <div className="rounded-2xl border p-4">
          <p className="text-sm text-muted-foreground">Slot</p>
          <p className="mt-1 font-medium">
            {booking.startTime} – {booking.endTime}
          </p>
        </div>

        <div className="rounded-2xl border p-4">
          <p className="text-sm text-muted-foreground">Erstellt</p>
          <p className="mt-1 font-medium">{formatCreatedAt(booking.createdAt)}</p>
        </div>
      </div>

      {booking.notes ? (
        <div className="mt-4 rounded-2xl border p-4">
          <p className="text-sm text-muted-foreground">Nachricht</p>
          <p className="mt-1 text-sm leading-6">{booking.notes}</p>
        </div>
      ) : null}
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[32px] border border-dashed bg-card p-8 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
        <Search className="size-5 text-muted-foreground" />
      </div>

      <div className="mt-4 space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Noch keine Buchungen</h2>
        <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
          Entdecke verfügbare CoSpots und buche deinen nächsten Arbeitsplatz in wenigen Klicks.
        </p>
      </div>

      <div className="mt-6">
        <Button asChild size="lg" className="rounded-full">
          <Link href="/">CoSpots entdecken</Link>
        </Button>
      </div>
    </div>
  );
}

export default async function UserBookingsPage() {
  const authUser = await getServerAuthUser();

  if (!authUser) {
    redirect("/auth/sign-in");
  }

  if (authUser.profile?.role !== "guest") {
    redirect("/");
  }

  const bookings = await getOwnBookings(authUser.uid);

  const upcomingBookings = bookings.filter(isUpcomingBooking);
  const pastBookings = bookings.filter((booking) => !isUpcomingBooking(booking));
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed").length;
  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Mein Bereich</p>
              <h1 className="text-3xl font-semibold tracking-tight">Meine Buchungen</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Behalte deine nächsten CoSpots im Blick, verwalte Buchungen und finde schnell zurück zu neuen Workspaces.
              </p>
            </div>

            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">Neue CoSpots entdecken</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardStatCard label="Gesamt" value={bookings.length} icon={<Ticket className="size-4 text-muted-foreground" />} />
            <DashboardStatCard label="Kommend" value={upcomingBookings.length} icon={<CalendarDays className="size-4 text-muted-foreground" />} />
            <DashboardStatCard label="Bestätigt" value={confirmedBookings} icon={<Clock3 className="size-4 text-muted-foreground" />} />
            <DashboardStatCard label="Ausstehend" value={pendingBookings} icon={<Ticket className="size-4 text-muted-foreground" />} />
          </div>

          {!bookings.length ? (
            <EmptyState />
          ) : (
            <div className="grid gap-8">
              <section className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight">Nächste Buchungen</h2>
                  <p className="text-sm text-muted-foreground">Alles, was bald ansteht.</p>
                </div>

                {!upcomingBookings.length ? (
                  <div className="rounded-3xl border border-dashed bg-card p-8 text-sm text-muted-foreground">Keine kommenden Buchungen vorhanden.</div>
                ) : (
                  <div className="grid gap-4">
                    {upcomingBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight">Vergangene & stornierte Buchungen</h2>
                  <p className="text-sm text-muted-foreground">Deine bisherigen Sessions im Überblick.</p>
                </div>

                {!pastBookings.length ? (
                  <div className="rounded-3xl border border-dashed bg-card p-8 text-sm text-muted-foreground">
                    Noch keine vergangenen oder stornierten Buchungen.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pastBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
