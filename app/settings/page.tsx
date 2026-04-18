import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, Building2, CalendarDays, CreditCard, Globe, LockKeyhole, MapPin, Settings2, Shield, UserRound } from "lucide-react";

import { getServerAuthUser } from "@/lib/auth/server-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatRoleLabel(role: "guest" | "host" | null | undefined) {
  if (role === "host") return "Host";
  if (role === "guest") return "Guest";
  return "Nicht gesetzt";
}

function formatAccessRoleLabel(accessRole: "user" | "admin" | null | undefined) {
  if (accessRole === "admin") return "Admin";
  if (accessRole === "user") return "User";
  return "Nicht gesetzt";
}

function formatAmenityLabel(value: string) {
  return value.replaceAll("-", " ");
}

function SectionCard({ title, description, icon, children }: { title: string; description?: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted">{icon}</div>

        <div className="min-w-0 space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value || "—"}</p>
    </div>
  );
}

export default async function SettingsPage() {
  const authUser = await getServerAuthUser();

  if (!authUser) {
    redirect("/auth/sign-in");
  }

  const profile = authUser.profile;

  if (!profile) {
    redirect("/");
  }

  const isHost = profile.role === "host";
  const isGuest = profile.role === "guest";
  const isAdmin = profile.accessRole === "admin";

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Account</p>
              <h1 className="text-3xl font-semibold tracking-tight">Einstellungen</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">Verwalte dein Profil, deine Rolle und die wichtigsten Angaben zu deinem Account.</p>
            </div>

            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">Zur Startseite</Link>
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard title="Konto" description="Deine Basisinformationen" icon={<UserRound className="size-4 text-muted-foreground" />}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <InfoItem label="E-Mail" value={profile.email} />
                <InfoItem label="UID" value={profile.uid} />
              </div>
            </SectionCard>

            <SectionCard title="Rollen" description="Produkt- und Zugriffsrolle" icon={<Shield className="size-4 text-muted-foreground" />}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border p-4">
                  <p className="text-sm text-muted-foreground">Produktrolle</p>
                  <div className="mt-2">
                    <Badge variant="secondary">{formatRoleLabel(profile.role)}</Badge>
                  </div>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="text-sm text-muted-foreground">Access Role</p>
                  <div className="mt-2">
                    <Badge variant={isAdmin ? "default" : "secondary"}>{formatAccessRoleLabel(profile.accessRole)}</Badge>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Status" description="Onboarding und Login" icon={<Settings2 className="size-4 text-muted-foreground" />}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <InfoItem label="Onboarding" value={profile.onboardingCompleted ? "Abgeschlossen" : "Offen"} />
                <InfoItem label="Login Methode" value={profile.authMethod ?? "e-Mail"} />
              </div>
            </SectionCard>
          </div>

          {isGuest ? (
            <SectionCard title="Guest Profil" description="Deine Angaben als Gast" icon={<Briefcase className="size-4 text-muted-foreground" />}>
              <div className="grid gap-4 md:grid-cols-2">
                <InfoItem label="Branche" value={profile.guestProfile?.industry} />
                <InfoItem label="Nutzung" value={profile.guestProfile?.purpose} />
                <InfoItem label="Networking" value={profile.guestProfile?.networking ? "Ja" : "Nein"} />
                <InfoItem label="Bio" value={profile.guestProfile?.bio} />
                <InfoItem label="LinkedIn" value={profile.guestProfile?.linkedin} />
                <InfoItem label="Website" value={profile.guestProfile?.website} />
              </div>

              <div className="mt-5">
                <Button asChild className="rounded-full">
                  <Link href="/settings/guest">Guest Profil bearbeiten</Link>
                </Button>
              </div>
            </SectionCard>
          ) : null}

          {isGuest ? (
            <SectionCard
              title="Guest Präferenzen"
              description="Was dir bei einem Spot wichtig ist"
              icon={<CalendarDays className="size-4 text-muted-foreground" />}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <InfoItem label="Stadt" value={profile.guestPreferences?.city} />
                <InfoItem label="Zeiten" value={profile.guestPreferences?.times?.join(", ")} />
                <InfoItem label="Wichtig" value={profile.guestPreferences?.important?.join(", ")} />
              </div>
            </SectionCard>
          ) : null}

          {isHost ? (
            <SectionCard title="Host Profil" description="Basisdaten zu deinem Spot" icon={<Building2 className="size-4 text-muted-foreground" />}>
              <div className="grid gap-4 md:grid-cols-2">
                <InfoItem label="Operator" value={profile.hostProfile?.operatorName} />
                <InfoItem label="Telefon" value={profile.hostProfile?.phone} />
                <InfoItem label="Location Name" value={profile.hostProfile?.locationName} />
                <InfoItem label="Adresse" value={profile.hostProfile?.address} />
                <InfoItem label="Stadt" value={profile.hostProfile?.city} />
              </div>

              <div className="mt-5">
                <Button asChild className="rounded-full">
                  <Link href="/settings/host">Host Einstellungen bearbeiten</Link>
                </Button>
              </div>
            </SectionCard>
          ) : null}

          {isHost ? (
            <div className="grid gap-4 xl:grid-cols-2">
              <SectionCard title="Location" description="Beschreibung und Links" icon={<MapPin className="size-4 text-muted-foreground" />}>
                <div className="grid gap-4">
                  <InfoItem label="Kategorie" value={profile.hostLocation?.category} />
                  <InfoItem label="Beschreibung" value={profile.hostLocation?.description} />
                  <InfoItem label="Website" value={profile.hostLocation?.website} />
                  <InfoItem label="Instagram" value={profile.hostLocation?.instagram} />

                  <div className="rounded-2xl border p-4">
                    <p className="text-sm text-muted-foreground">Ausstattung</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {profile.hostLocation?.amenities?.length ? (
                        profile.hostLocation.amenities.map((amenity) => (
                          <Badge key={amenity} variant="secondary">
                            {formatAmenityLabel(amenity)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm font-medium">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Setup & Verfügbarkeit" description="Kapazität, Preis und Zeiten" icon={<Globe className="size-4 text-muted-foreground" />}>
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoItem label="Plätze" value={profile.hostSetup?.spots} />
                  <InfoItem label="Preis" value={profile.hostSetup?.price != null ? `CHF ${profile.hostSetup.price}` : "—"} />
                  <InfoItem label="Markiert" value={profile.hostSetup?.marked ? "Ja" : "Nein"} />
                  <InfoItem label="Laptop Zone only" value={profile.hostSetup?.laptopZoneOnly ? "Ja" : "Nein"} />
                  <InfoItem label="Slot Dauer" value={profile.hostSetup?.slotDuration} />
                  <InfoItem label="Tage" value={profile.hostAvailability?.days?.join(", ")} />
                  <InfoItem label="Von" value={profile.hostAvailability?.from} />
                  <InfoItem label="Bis" value={profile.hostAvailability?.to} />
                  <InfoItem label="Recurring" value={profile.hostAvailability?.recurring ? "Ja" : "Nein"} />
                  <InfoItem label="Grace Period" value={profile.hostAvailability?.gracePeriod != null ? `${profile.hostAvailability.gracePeriod} min` : "—"} />
                  <InfoItem label="Verlängern erlaubt" value={profile.hostAvailability?.extendAllowed ? "Ja" : "Nein"} />
                </div>
              </SectionCard>
            </div>
          ) : null}

          <SectionCard title="Sicherheit" description="Account und Zugriff" icon={<LockKeyhole className="size-4 text-muted-foreground" />}>
            <div className="grid gap-4 md:grid-cols-3">
              <InfoItem label="Access Role" value={profile.accessRole} />
              <InfoItem label="Auth Method" value={profile.authMethod} />
              <InfoItem label="Zuletzt aktualisiert" value={new Date(profile.updatedAt).toLocaleString("de-CH")} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/user/bookings">Meine Buchungen</Link>
              </Button>

              {isHost || isAdmin ? (
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/host/bookings">Host Bereich</Link>
                </Button>
              ) : null}
            </div>
          </SectionCard>
        </div>
      </section>
    </main>
  );
}
