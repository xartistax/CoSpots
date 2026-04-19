"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Globe, ImageIcon, Link as LucidLink, MapPin, Sparkles } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { locationAmenityOptions, locationCategoryOptions, slotDurationOptions, weekdayOptions } from "@/lib/constants/onboarding";
import { saveHostAvailability, saveHostContent, saveHostLocation, saveHostProfile, saveHostSetup } from "@/lib/firebase/user-profile";

type HostSettingsFormState = {
  operatorName: string;
  phone: string;
  locationName: string;
  address: string;
  city: string;
  category: string;
  description: string;
  website: string;
  instagram: string;
  amenities: string[];
  spots: string;
  price: string;
  marked: boolean;
  laptopZoneOnly: boolean;
  slotDuration: string;
  days: string[];
  from: string;
  to: string;
  recurring: boolean;
  gracePeriod: string;
  extendAllowed: boolean;
  gallery: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
};

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function toNullableString(value: string): string | null {
  const normalized = value.trim();
  return normalized === "" ? null : normalized;
}

function normalizeGallery(
  uid: string,
  locationName: string,
  gallery: Array<{ id?: string; url?: string; alt?: string }> | undefined,
): HostSettingsFormState["gallery"] {
  const base = Array.from({ length: 3 }, (_, index) => {
    const image = gallery?.[index];

    return {
      id: image?.id ?? `${uid}-image-${index + 1}`,
      url: image?.url ?? "",
      alt: image?.alt ?? `${locationName || "Host"} Bild ${index + 1}`,
    };
  });

  return base;
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-card p-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function HostSettingsPage() {
  const router = useRouter();
  const { loading, firebaseUser, profile } = useAuth();

  const [form, setForm] = useState<HostSettingsFormState>({
    operatorName: "",
    phone: "",
    locationName: "",
    address: "",
    city: "",
    category: "",
    description: "",
    website: "",
    instagram: "",
    amenities: [],
    spots: "1",
    price: "0",
    marked: false,
    laptopZoneOnly: false,
    slotDuration: "",
    days: [],
    from: "",
    to: "",
    recurring: true,
    gracePeriod: "0",
    extendAllowed: false,
    gallery: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canAccess = useMemo(() => profile?.role === "host", [profile?.role]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!firebaseUser || !profile) {
      router.replace("/auth/sign-in");
      return;
    }

    if (profile.role !== "host") {
      router.replace("/settings");
      return;
    }

    const locationName = profile.hostProfile?.locationName ?? "";

    setForm({
      operatorName: profile.hostProfile?.operatorName ?? "",
      phone: profile.hostProfile?.phone ?? "",
      locationName,
      address: profile.hostProfile?.address ?? "",
      city: profile.hostProfile?.city ?? "",
      category: profile.hostLocation?.category ?? "",
      description: profile.hostLocation?.description ?? "",
      website: profile.hostLocation?.website ?? "",
      instagram: profile.hostLocation?.instagram ?? "",
      amenities: profile.hostLocation?.amenities ?? [],
      spots: String(profile.hostSetup?.spots ?? 1),
      price: String(profile.hostSetup?.price ?? 0),
      marked: profile.hostSetup?.marked ?? false,
      laptopZoneOnly: profile.hostSetup?.laptopZoneOnly ?? false,
      slotDuration: profile.hostSetup?.slotDuration ?? "",
      days: profile.hostAvailability?.days ?? [],
      from: profile.hostAvailability?.from ?? "",
      to: profile.hostAvailability?.to ?? "",
      recurring: profile.hostAvailability?.recurring ?? true,
      gracePeriod: String(profile.hostAvailability?.gracePeriod ?? 0),
      extendAllowed: profile.hostAvailability?.extendAllowed ?? false,
      gallery: normalizeGallery(firebaseUser.uid, locationName, profile.hostContent?.gallery),
    });
  }, [firebaseUser, loading, profile, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!firebaseUser || !profile) {
      setError("Nicht eingeloggt");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const nextLocationName = form.locationName.trim();

      await saveHostProfile({
        uid: firebaseUser.uid,
        hostProfile: {
          operatorName: form.operatorName.trim(),
          phone: form.phone.trim(),
          locationName: nextLocationName,
          address: form.address.trim(),
          city: form.city.trim(),
        },
      });

      await saveHostLocation({
        uid: firebaseUser.uid,
        hostLocation: {
          category: form.category.trim() as "cafe" | "bar" | "restaurant" | "hotel-lounge" | "other",
          description: form.description.trim(),
          website: toNullableString(form.website) ?? "",
          instagram: toNullableString(form.instagram) ?? "",
          amenities: form.amenities,
        },
      });

      await saveHostSetup({
        uid: firebaseUser.uid,
        hostSetup: {
          spots: Number(form.spots) || 1,
          price: Number(form.price) || 0,
          marked: form.marked,
          laptopZoneOnly: form.laptopZoneOnly,
          slotDuration: form.slotDuration,
        },
      });

      await saveHostAvailability({
        uid: firebaseUser.uid,
        hostAvailability: {
          days: form.days as Array<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun">,
          from: form.from,
          to: form.to,
          recurring: form.recurring,
          gracePeriod: Number(form.gracePeriod) || 0,
          extendAllowed: form.extendAllowed,
        },
      });

      await saveHostContent({
        uid: firebaseUser.uid,
        hostContent: {
          gallery: form.gallery
            .map((image, index) => ({
              id: image.id || `${firebaseUser.uid}-image-${index + 1}`,
              url: image.url.trim(),
              alt: image.alt.trim() || `${nextLocationName || "Host"} Bild ${index + 1}`,
            }))
            .filter((image) => image.url),
          reviews: profile.hostContent?.reviews ?? [],
        },
      });

      setSuccess("Host Einstellungen gespeichert.");
      router.refresh();
    } catch (submitError) {
      console.error("Host settings save error:", submitError);
      setError("Host Einstellungen konnten nicht gespeichert werden.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !firebaseUser || !profile || !canAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-sm text-muted-foreground"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Settings</p>
              <h1 className="text-3xl font-semibold tracking-tight">Host Einstellungen bearbeiten</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">Aktualisiere Profil, Spot, Setup, Verfügbarkeit und Bilder an einem Ort.</p>
            </div>

            <Button asChild variant="outline" className="rounded-full">
              <Link href="/settings">Zurück zu Einstellungen</Link>
            </Button>
          </div>

          <SectionCard title="Host Profil" description="Basisdaten zu deinem Spot">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Operator</Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={form.operatorName}
                    onChange={(event) => setForm((current) => ({ ...current, operatorName: event.target.value }))}
                    className="h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Telefon</Label>
                <Input
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Location Name</Label>
                <Input
                  value={form.locationName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      locationName: event.target.value,
                      gallery: current.gallery.map((image, index) => ({
                        ...image,
                        alt:
                          image.alt.startsWith(current.locationName || "Host") || image.alt.includes(" Bild ")
                            ? `${event.target.value || "Host"} Bild ${index + 1}`
                            : image.alt,
                      })),
                    }))
                  }
                  className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Stadt</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={form.city}
                    onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                    className="h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <Label className="text-sm font-medium">Adresse</Label>
              <Input
                value={form.address}
                onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
              />
            </div>
          </SectionCard>

          <SectionCard title="Location" description="Beschreibung, Links und Ausstattung">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Kategorie</Label>
                <select
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none"
                >
                  <option value="">Kategorie wählen</option>
                  {locationCategoryOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Website</Label>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={form.website}
                    onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
                    className="h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <Label className="text-sm font-medium">Instagram</Label>
              <div className="relative">
                <LucidLink className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={form.instagram}
                  onChange={(event) => setForm((current) => ({ ...current, instagram: event.target.value }))}
                  className="h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none"
                />
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <Label className="text-sm font-medium">Beschreibung</Label>
              <div className="relative">
                <Sparkles className="pointer-events-none absolute left-4 top-4 size-4 text-muted-foreground" />
                <Textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="min-h-32 rounded-2xl border-border/80 pl-11 pr-4 pt-3 shadow-none"
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <Label className="text-sm font-medium">Ausstattung</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {locationAmenityOptions.map((item) => {
                  const checked = form.amenities.includes(item.id);

                  return (
                    <label key={item.id} className="flex items-center gap-3 rounded-[20px] border p-4 transition hover:border-foreground/20 hover:bg-muted/30">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => setForm((current) => ({ ...current, amenities: toggleValue(current.amenities, item.id) }))}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Bilder" description="Passe die Galerie deines Spots an">
            <div className="grid gap-5">
              {form.gallery.map((image, index) => (
                <div key={image.id} className="rounded-[24px] border p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-muted">
                      <ImageIcon className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Bild {index + 1}</p>
                      <p className="text-sm text-muted-foreground">URL und Alternativtext</p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_240px]">
                    <div className="space-y-5">
                      <div className="space-y-2.5">
                        <Label className="text-sm font-medium">Bild URL</Label>
                        <Input
                          value={image.url}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              gallery: current.gallery.map((item, itemIndex) => (itemIndex === index ? { ...item, url: event.target.value } : item)),
                            }))
                          }
                          placeholder="https://..."
                          className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
                        />
                      </div>

                      <div className="space-y-2.5">
                        <Label className="text-sm font-medium">Alt Text</Label>
                        <Input
                          value={image.alt}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              gallery: current.gallery.map((item, itemIndex) => (itemIndex === index ? { ...item, alt: event.target.value } : item)),
                            }))
                          }
                          placeholder={`${form.locationName || "Host"} Bild ${index + 1}`}
                          className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
                        />
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border bg-muted">
                      {image.url ? (
                        <img src={image.url} alt={image.alt || `${form.locationName || "Host"} Bild ${index + 1}`} className="h-48 w-full object-cover" />
                      ) : (
                        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">Kein Bild</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Setup & Verfügbarkeit" description="Preis, Plätze und Zeiten">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Plätze</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.spots}
                  onChange={(event) => setForm((current) => ({ ...current, spots: event.target.value }))}
                  className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Preis</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                  className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Slot Dauer</Label>
                <select
                  value={form.slotDuration}
                  onChange={(event) => setForm((current) => ({ ...current, slotDuration: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none"
                >
                  <option value="">Dauer wählen</option>
                  {slotDurationOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Grace Period</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.gracePeriod}
                  onChange={(event) => setForm((current) => ({ ...current, gracePeriod: event.target.value }))}
                  className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="rounded-[24px] border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Markiert</Label>
                    <p className="text-sm leading-6 text-muted-foreground">Zeigt an, ob dein Spot speziell markiert werden soll.</p>
                  </div>

                  <Switch checked={form.marked} onCheckedChange={(checked) => setForm((current) => ({ ...current, marked: checked }))} />
                </div>
              </div>

              <div className="rounded-[24px] border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Laptop Zone only</Label>
                    <p className="text-sm leading-6 text-muted-foreground">Nur laptop-freundliche Nutzung an diesem Spot.</p>
                  </div>

                  <Switch checked={form.laptopZoneOnly} onCheckedChange={(checked) => setForm((current) => ({ ...current, laptopZoneOnly: checked }))} />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Von</Label>
                <Input
                  type="time"
                  value={form.from}
                  onChange={(event) => setForm((current) => ({ ...current, from: event.target.value }))}
                  className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Bis</Label>
                <Input
                  type="time"
                  value={form.to}
                  onChange={(event) => setForm((current) => ({ ...current, to: event.target.value }))}
                  className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="rounded-[24px] border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Recurring</Label>
                    <p className="text-sm leading-6 text-muted-foreground">Diese Verfügbarkeit wiederholt sich wöchentlich.</p>
                  </div>

                  <Switch checked={form.recurring} onCheckedChange={(checked) => setForm((current) => ({ ...current, recurring: checked }))} />
                </div>
              </div>

              <div className="rounded-[24px] border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Verlängern erlaubt</Label>
                    <p className="text-sm leading-6 text-muted-foreground">Gäste dürfen einen Slot verlängern.</p>
                  </div>

                  <Switch checked={form.extendAllowed} onCheckedChange={(checked) => setForm((current) => ({ ...current, extendAllowed: checked }))} />
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <Label className="text-sm font-medium">Tage</Label>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {weekdayOptions.map((day) => {
                  const checked = form.days.includes(day.id);

                  return (
                    <label key={day.id} className="flex items-center gap-3 rounded-[20px] border p-4 transition hover:border-foreground/20 hover:bg-muted/30">
                      <Checkbox checked={checked} onCheckedChange={() => setForm((current) => ({ ...current, days: toggleValue(current.days, day.id) }))} />
                      <span className="text-sm font-medium">{day.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {success ? <p className="text-sm text-green-600">{success}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving} className="rounded-full">
              {saving ? "Speichert..." : "Änderungen speichern"}
            </Button>

            <Button type="button" variant="outline" className="rounded-full" asChild>
              <Link href="/settings">Abbrechen</Link>
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
