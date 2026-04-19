"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Link as LucidLink, MapPin, Sparkles, Users } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveGuestPreferences, saveGuestProfile } from "@/lib/firebase/user-profile";
import { industryOptions, preferenceOptions, purposeOptions, timeOptions } from "@/lib/constants/onboarding";

type GuestSettingsFormState = {
  industry: string;
  purpose: string;
  networking: boolean;
  bio: string;
  linkedin: string;
  website: string;
  city: string;
  times: string[];
  important: string[];
};

function toNullableString(value: string): string | null {
  const normalized = value.trim();
  return normalized === "" ? null : normalized;
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
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

export default function GuestSettingsPage() {
  const router = useRouter();
  const { loading, firebaseUser, profile } = useAuth();

  const [form, setForm] = useState<GuestSettingsFormState>({
    industry: "",
    purpose: "",
    networking: false,
    bio: "",
    linkedin: "",
    website: "",
    city: "",
    times: [],
    important: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canAccess = useMemo(() => profile?.role === "guest", [profile?.role]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!firebaseUser || !profile) {
      router.replace("/auth/sign-in");
      return;
    }

    console.log({
      loading,
      firebaseUser: !!firebaseUser,
      role: profile?.role,
      accessRole: profile?.accessRole,
    });

    if (profile.role !== "guest") {
      router.replace("/settings");
      return;
    }

    setForm({
      industry: profile.guestProfile?.industry ?? "",
      purpose: profile.guestProfile?.purpose ?? "",
      networking: profile.guestProfile?.networking ?? false,
      bio: profile.guestProfile?.bio ?? "",
      linkedin: profile.guestProfile?.linkedin ?? "",
      website: profile.guestProfile?.website ?? "",
      city: profile.guestPreferences?.city ?? "",
      times: profile.guestPreferences?.times ?? [],
      important: profile.guestPreferences?.important ?? [],
    });
  }, [firebaseUser, loading, profile, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!firebaseUser) {
      setError("Nicht eingeloggt");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveGuestProfile({
        uid: firebaseUser.uid,
        guestProfile: {
          industry: form.industry.trim(),
          purpose: form.purpose.trim(),
          networking: form.networking,
          bio: form.bio.trim(),
          linkedin: toNullableString(form.linkedin),
          website: toNullableString(form.website),
        },
      });

      await saveGuestPreferences({
        uid: firebaseUser.uid,
        guestPreferences: {
          city: form.city.trim(),
          times: form.times,
          important: form.important,
        },
      });

      setSuccess("Guest Profil gespeichert.");
      router.refresh();
    } catch (submitError) {
      console.error("Guest settings save error:", submitError);
      setError("Guest Profil konnte nicht gespeichert werden.");
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
      <section className="mx-auto max-w-5xl px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Settings</p>
              <h1 className="text-3xl font-semibold tracking-tight">Guest Profil bearbeiten</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">Aktualisiere deine Angaben und Präferenzen für bessere Spot-Empfehlungen.</p>
            </div>

            <Button asChild variant="outline" className="rounded-full">
              <Link href="/settings">Zurück zu Einstellungen</Link>
            </Button>
          </div>

          <SectionCard title="Profil" description="Wie du dich als Gast präsentierst">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Branche</Label>
                <select
                  value={form.industry}
                  onChange={(event) => setForm((current) => ({ ...current, industry: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm shadow-none outline-none"
                >
                  <option value="">Branche wählen</option>
                  {industryOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Nutzung</Label>
                <select
                  value={form.purpose}
                  onChange={(event) => setForm((current) => ({ ...current, purpose: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm shadow-none outline-none"
                >
                  <option value="">Nutzung wählen</option>
                  {purposeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted">
                    <Users className="size-4" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Networking</Label>
                    <p className="text-sm leading-6 text-muted-foreground">Zeige, ob du offen für Gespräche und neue Kontakte bist.</p>
                  </div>
                </div>

                <Switch checked={form.networking} onCheckedChange={(checked) => setForm((current) => ({ ...current, networking: checked }))} />
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium">Bio</Label>
                <span className="text-xs text-muted-foreground">Kurz und ehrlich</span>
              </div>

              <div className="relative">
                <Sparkles className="pointer-events-none absolute left-4 top-4 size-4 text-muted-foreground" />
                <Textarea
                  value={form.bio}
                  onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                  placeholder="Erzähl kurz, wie du arbeitest oder wonach du suchst."
                  className="min-h-32 rounded-2xl border-border/80 pl-11 pr-4 pt-3 shadow-none"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2.5">
                <Label className="text-sm font-medium">LinkedIn</Label>
                <div className="relative">
                  <LucidLink className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={form.linkedin}
                    onChange={(event) => setForm((current) => ({ ...current, linkedin: event.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                    className="h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Website</Label>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={form.website}
                    onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
                    placeholder="https://..."
                    className="h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none"
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Präferenzen" description="Was dir bei einem CoSpot wichtig ist">
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">Stadt</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={form.city}
                  onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                  placeholder="Zürich"
                  className="h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none"
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <Label className="text-sm font-medium">Bevorzugte Zeiten</Label>

              <div className="grid gap-3 sm:grid-cols-2">
                {timeOptions.map((option) => {
                  const checked = form.times.includes(option.id);

                  return (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 rounded-[20px] border p-4 transition hover:border-foreground/20 hover:bg-muted/30"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => setForm((current) => ({ ...current, times: toggleValue(current.times, option.id) }))}
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <Label className="text-sm font-medium">Wichtig für dich</Label>

              <div className="grid gap-3 sm:grid-cols-2">
                {preferenceOptions.map((option) => {
                  const checked = form.important.includes(option.id);

                  return (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 rounded-[20px] border p-4 transition hover:border-foreground/20 hover:bg-muted/30"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => setForm((current) => ({ ...current, important: toggleValue(current.important, option.id) }))}
                      />
                      <span className="text-sm font-medium">{option.label}</span>
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
