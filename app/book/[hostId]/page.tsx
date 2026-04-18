import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";

import { BookingForm } from "@/components/bookings/booking-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminDb } from "@/lib/firebase/admin";
import { AMENITY_ICONS } from "@/lib/amenities-icons";
import type { AppProfile } from "@/types/user-profile";

type BookingPageProps = {
  params: Promise<{
    hostId: string;
  }>;
};

async function getHost(hostId: string): Promise<AppProfile | null> {
  const snapshot = await adminDb.collection("users").doc(hostId).get();

  if (!snapshot.exists) {
    return null;
  }

  const host = snapshot.data() as AppProfile;

  if (host.role !== "host") {
    return null;
  }

  return host;
}

function formatAmenityLabel(value: string) {
  return value.replaceAll("-", " ");
}

function InfoCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 text-base font-semibold">{value}</p>
    </div>
  );
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { hostId } = await params;
  const host = await getHost(hostId);

  if (!host) {
    notFound();
  }

  const title = host.hostProfile?.locationName ?? "Host";
  const address = [host.hostProfile?.address, host.hostProfile?.city].filter(Boolean).join(", ");
  const description = host.hostLocation?.description ?? "Keine Beschreibung vorhanden.";
  const price = host.hostSetup?.price ?? 0;
  const spots = host.hostSetup?.spots ?? 0;
  const slotDuration = host.hostSetup?.slotDuration ?? "-";
  const availabilityDays = host.hostAvailability?.days?.join(", ") ?? "—";
  const availabilityTime = host.hostAvailability?.from && host.hostAvailability?.to ? `${host.hostAvailability.from} – ${host.hostAvailability.to}` : "—";
  const amenities = host.hostLocation?.amenities ?? [];
  const gallery = host.hostContent?.gallery?.filter((image) => image.url) ?? [];
  const previewImage = gallery[0]?.url ?? null;

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <Button asChild variant="ghost" className="rounded-full px-0 hover:bg-transparent">
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                Zurück
              </Link>
            </Button>

            <Badge variant="secondary" className="rounded-full px-3 py-1">
              Buchung
            </Badge>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[28px] border bg-card">
                {previewImage ? (
                  <div className="grid gap-3 p-3 md:grid-cols-[minmax(0,1fr)_160px]">
                    <div className="overflow-hidden rounded-3xl bg-muted">
                      <img src={previewImage} alt={gallery[0]?.alt || title} className="h-[280px] w-full object-cover md:h-[360px]" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                      {gallery.slice(1, 3).map((image) => (
                        <div key={image.id} className="overflow-hidden rounded-2xl bg-muted">
                          <img src={image.url} alt={image.alt || title} className="h-28 w-full object-cover md:h-[174px]" />
                        </div>
                      ))}

                      {gallery.length < 3
                        ? Array.from({ length: Math.max(0, 2 - gallery.slice(1, 3).length) }).map((_, index) => (
                            <div key={`placeholder-${index}`} className="rounded-2xl bg-muted md:h-[174px]" aria-hidden="true" />
                          ))
                        : null}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[280px] items-center justify-center bg-muted text-sm text-muted-foreground">Kein Bild vorhanden</div>
                )}
              </div>

              <div className="rounded-[28px] border bg-card p-6 sm:p-8">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Spot buchen</p>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                    {address ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-4" />
                        {address}
                      </span>
                    ) : null}

                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="size-4" />
                      {host.hostLocation?.category?.replaceAll("-", " ") || "CoSpot"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <InfoCard label="Preis" value={`CHF ${price}`} icon={<Sparkles className="size-4 text-muted-foreground" />} />
                  <InfoCard label="Plätze pro Slot" value={spots} icon={<Users className="size-4 text-muted-foreground" />} />
                  <InfoCard label="Slot Dauer" value={slotDuration} icon={<Clock3 className="size-4 text-muted-foreground" />} />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="size-4" />
                      <span>Verfügbarkeit</span>
                    </div>
                    <p className="mt-2 font-medium">{availabilityTime}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{availabilityDays}</p>
                  </div>

                  <div className="rounded-2xl border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ShieldCheck className="size-4" />
                      <span>Hinweis</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Wähle zuerst Datum und Slot. Verfügbare Zeiten werden dir direkt im Formular angezeigt.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h2 className="text-lg font-semibold">Über diesen Spot</h2>
                  <p className="text-sm leading-7 text-muted-foreground">{description}</p>
                </div>

                {amenities.length ? (
                  <div className="mt-6 space-y-3">
                    <h2 className="text-lg font-semibold">Was dich erwartet</h2>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {amenities.map((amenity) => {
                        const Icon = AMENITY_ICONS[amenity as keyof typeof AMENITY_ICONS];

                        return (
                          <div key={amenity} className="flex items-center gap-3 rounded-2xl border px-4 py-3">
                            {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
                            <span className="text-sm font-medium capitalize">{formatAmenityLabel(amenity)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <aside className="xl:sticky xl:top-24 xl:self-start">
              <div className="rounded-[28px] border bg-card p-6 shadow-sm sm:p-8">
                <div className="mb-6 space-y-2">
                  <p className="text-sm text-muted-foreground">Deine Buchung</p>
                  <h2 className="text-2xl font-semibold tracking-tight">Slot auswählen</h2>
                  <p className="text-sm text-muted-foreground">Wähle ein Datum und einen freien Slot. Danach kannst du deine Buchung direkt abschicken.</p>
                </div>

                <BookingForm host={host} />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
