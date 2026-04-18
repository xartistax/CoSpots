import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, Clock3, Filter, Inbox, Shield, Store, Ticket } from "lucide-react";

import { adminDb } from "@/lib/firebase/admin";
import { getServerAuthUser } from "@/lib/auth/server-auth";
import { SystemCleanCard } from "@/components/admin/system-clean-card";
import { BookingStatusActions } from "@/components/bookings/booking-status-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BookingData } from "@/types/booking";

type HostBookingsPageProps = {
  searchParams: Promise<{
    hostId?: string;
  }>;
};

async function getBookings(params: { currentUid: string; isAdmin: boolean; hostId?: string }): Promise<BookingData[]> {
  let query = adminDb.collection("bookings") as FirebaseFirestore.Query;

  if (params.isAdmin) {
    if (params.hostId) {
      query = query.where("hostId", "==", params.hostId);
    }
  } else {
    query = query.where("hostId", "==", params.currentUid);
  }

  const snapshot = await query.get();

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

function formatCreatedAt(value: string): string {
  return new Date(value).toLocaleString("de-CH");
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

function EmptyState({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="rounded-[32px] border border-dashed bg-card p-8 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
        <Inbox className="size-5 text-muted-foreground" />
      </div>

      <div className="mt-4 space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Keine Buchungen gefunden</h2>
        <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
          {isAdmin
            ? "Aktuell sind keine Buchungen vorhanden oder dein Filter liefert keine Resultate."
            : "Sobald Gäste deinen Spot buchen, erscheinen ihre Anfragen hier."}
        </p>
      </div>

      {isAdmin ? (
        <div className="mt-6">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/host/bookings">Filter zurücksetzen</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function BookingCard({ booking, isAdmin }: { booking: BookingData; isAdmin: boolean }) {
  return (
    <article className="rounded-3xl border bg-card p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold tracking-tight">{booking.hostName}</h3>

            <Badge variant={getStatusVariant(booking.status)}>{getStatusLabel(booking.status)}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{booking.guestName}</span>
            <span>·</span>
            <span>{booking.guestEmail}</span>

            {isAdmin ? (
              <>
                <span>·</span>
                <Link href={`/host/bookings?hostId=${booking.hostId}`} className="text-foreground underline-offset-4 hover:underline">
                  Nur diesen Host anzeigen
                </Link>
              </>
            ) : null}
          </div>
        </div>

        <BookingStatusActions bookingId={booking.id} hostId={booking.hostId} currentStatus={booking.status} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border p-4">
          <p className="text-sm text-muted-foreground">Datum</p>
          <p className="mt-1 font-medium">{booking.date}</p>
        </div>

        <div className="rounded-2xl border p-4">
          <p className="text-sm text-muted-foreground">Slot</p>
          <p className="mt-1 font-medium">
            {booking.startTime} – {booking.endTime}
          </p>
        </div>

        <div className="rounded-2xl border p-4">
          <p className="text-sm text-muted-foreground">Host ID</p>
          <p className="mt-1 truncate font-medium">{booking.hostId}</p>
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

export default async function HostBookingsPage({ searchParams }: HostBookingsPageProps) {
  const authUser = await getServerAuthUser();

  if (!authUser) {
    redirect("/auth/sign-in");
  }

  const canAccessHostArea = authUser.isAdmin || authUser.profile?.role === "host";

  if (!canAccessHostArea) {
    redirect("/");
  }

  const { hostId } = await searchParams;

  const bookings = await getBookings({
    currentUid: authUser.uid,
    isAdmin: authUser.isAdmin,
    hostId,
  });

  const pendingBookings = bookings.filter((booking) => booking.status === "pending");
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed");
  const cancelledBookings = bookings.filter((booking) => booking.status === "cancelled");
  const upcomingBookings = bookings.filter(isUpcomingBooking);

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="space-y-8">
          {authUser.isAdmin ? <SystemCleanCard /> : null}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{authUser.isAdmin ? "Admin Dashboard" : "Host Dashboard"}</p>

              <h1 className="text-3xl font-semibold tracking-tight">Buchungen</h1>

              <p className="max-w-2xl text-sm text-muted-foreground">
                {authUser.isAdmin
                  ? hostId
                    ? `Admin-Filter aktiv für Host: ${hostId}`
                    : "Admin sieht alle Buchungen und kann Status direkt verwalten."
                  : "Verwalte neue Anfragen, bestätigte Buchungen und vergangene Sessions an einem Ort."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {authUser.isAdmin ? (
                <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground">
                  <Shield className="size-4" />
                  Admin Zugriff
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground">
                  <Store className="size-4" />
                  Eigene Host-Buchungen
                </div>
              )}

              {authUser.isAdmin && hostId ? (
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/host/bookings">
                    <Filter className="mr-2 size-4" />
                    Filter zurücksetzen
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardStatCard label="Gesamt" value={bookings.length} icon={<Ticket className="size-4 text-muted-foreground" />} />
            <DashboardStatCard label="Ausstehend" value={pendingBookings.length} icon={<Inbox className="size-4 text-muted-foreground" />} />
            <DashboardStatCard label="Bestätigt" value={confirmedBookings.length} icon={<Clock3 className="size-4 text-muted-foreground" />} />
            <DashboardStatCard label="Kommend" value={upcomingBookings.length} icon={<CalendarDays className="size-4 text-muted-foreground" />} />
          </div>

          {!bookings.length ? (
            <EmptyState isAdmin={authUser.isAdmin} />
          ) : (
            <div className="grid gap-8">
              <section className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight">Offene & kommende Buchungen</h2>
                  <p className="text-sm text-muted-foreground">Fokus auf alles, was jetzt relevant ist.</p>
                </div>

                {![...pendingBookings, ...confirmedBookings].length ? (
                  <div className="rounded-3xl border border-dashed bg-card p-8 text-sm text-muted-foreground">
                    Keine offenen oder bestätigten Buchungen vorhanden.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {[...pendingBookings, ...confirmedBookings]
                      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                      .map((booking) => (
                        <BookingCard key={booking.id} booking={booking} isAdmin={authUser.isAdmin} />
                      ))}
                  </div>
                )}
              </section>

              {!!cancelledBookings.length ? (
                <section className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight">Stornierte Buchungen</h2>
                    <p className="text-sm text-muted-foreground">Vergangene Stornos und abgeschlossene Fälle.</p>
                  </div>

                  <div className="grid gap-4">
                    {cancelledBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} isAdmin={authUser.isAdmin} />
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
