"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, Map, Search, SlidersHorizontal, X } from "lucide-react";

import { MapView } from "@/components/discovery/map-view";
import { HostDetailsPanel } from "@/components/hosts/host-details-panel";
import { HostListItems } from "@/components/hosts/host-list-items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DiscoveryFilters } from "@/lib/discovery/filter-hosts";
import { getCantonForCity } from "@/lib/maps/city-to-canton";
import type { CantonName } from "@/lib/maps/cantons";
import type { AppProfile } from "@/types/user-profile";

type DiscoveryShellProps = {
  hosts: AppProfile[];
  initialFilters: DiscoveryFilters;
};

const CATEGORY_OPTIONS = [
  { id: "", label: "Alle Kategorien" },
  { id: "cafe", label: "Café" },
  { id: "bar", label: "Bar" },
  { id: "restaurant", label: "Restaurant" },
  { id: "hotel-lounge", label: "Hotel Lounge" },
  { id: "other", label: "Other" },
] as const;

const SLOT_DURATION_OPTIONS = [
  { id: "", label: "Alle Slots" },
  { id: "2h", label: "2h" },
  { id: "3h", label: "3h" },
  { id: "4h", label: "4h" },
] as const;

const AMENITY_OPTIONS = [
  { id: "wifi", label: "WLAN" },
  { id: "power", label: "Strom" },
  { id: "laptop-zone", label: "Laptop Zone" },
  { id: "wc", label: "WC" },
] as const;

const CANTON_OPTIONS: CantonName[] = [
  "Aargau",
  "Basel-Stadt",
  "Bern / Berne",
  "Genève",
  "Luzern",
  "Neuchâtel",
  "St. Gallen",
  "Ticino",
  "Vaud",
  "Zug",
  "Zürich",
];

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function buildQuery(filters: DiscoveryFilters): string {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.city) params.set("city", filters.city);
  if (filters.canton) params.set("canton", filters.canton);
  if (filters.category) params.set("category", filters.category);
  if (filters.slotDuration) params.set("slotDuration", filters.slotDuration);
  if (filters.priceMax !== null) params.set("priceMax", String(filters.priceMax));
  if (filters.amenities.length) params.set("amenities", filters.amenities.join(","));
  if (filters.map) params.set("map", "1");

  return params.toString();
}

export function DiscoveryShell({ hosts, initialFilters }: DiscoveryShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [draft, setDraft] = useState<DiscoveryFilters>(initialFilters);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const selectedHost = useMemo(() => {
    if (!selectedHostId) {
      return null;
    }

    return hosts.find((host) => host.uid === selectedHostId) ?? null;
  }, [hosts, selectedHostId]);

  const selectedCanton = useMemo<CantonName | null>(() => {
    if (draft.canton) {
      return draft.canton;
    }

    if (draft.city) {
      return getCantonForCity(draft.city);
    }

    return null;
  }, [draft.canton, draft.city]);

  function applyFilters(next: DiscoveryFilters) {
    const query = buildQuery(next);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function resetFilters() {
    const next: DiscoveryFilters = {
      q: "",
      city: "",
      canton: "",
      category: "",
      amenities: [],
      priceMax: null,
      slotDuration: "",
      map: draft.map,
    };

    setDraft(next);
    applyFilters(next);
  }

  function handleSelectCanton(canton: CantonName | null) {
    const next: DiscoveryFilters = {
      ...draft,
      canton: canton ?? "",
      city: "",
      map: true,
    };

    setDraft(next);
    setSelectedHostId(null);
    applyFilters(next);
  }

  const activeFilterCount =
    Number(Boolean(searchParams.get("q"))) +
    Number(Boolean(searchParams.get("city"))) +
    Number(Boolean(searchParams.get("canton"))) +
    Number(Boolean(searchParams.get("category"))) +
    Number(Boolean(searchParams.get("slotDuration"))) +
    Number(Boolean(searchParams.get("priceMax"))) +
    Number(Boolean(searchParams.get("amenities")));

  return (
    <div className="mx-auto flex h-[calc(100svh-4rem)] max-w-7xl flex-col px-4">
      <div className="border-b py-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={draft.q}
                onChange={(event) => setDraft((current) => ({ ...current, q: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    applyFilters(draft);
                  }
                }}
                placeholder="Suche nach Stadt, Spot oder Beschreibung"
                className="h-12 rounded-full border-border/80 pl-11 pr-4 shadow-none"
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="h-12 rounded-full lg:hidden" onClick={() => setShowMobileFilters(true)}>
                <SlidersHorizontal className="mr-2 size-4" />
                Filter
                {activeFilterCount ? <span className="ml-2 rounded-full bg-foreground px-2 py-0.5 text-xs text-background">{activeFilterCount}</span> : null}
              </Button>

              <Button type="button" className="h-12 rounded-full" onClick={() => applyFilters(draft)}>
                Anwenden
              </Button>
            </div>
          </div>

          <div className="hidden flex-wrap gap-2 lg:flex">
            <select
              value={draft.city}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  city: event.target.value,
                  canton: "",
                }))
              }
              className="h-11 rounded-full border bg-background px-4 text-sm"
            >
              <option value="">Alle Städte</option>
              {[...new Set(hosts.map((host) => host.hostProfile?.city).filter(Boolean))].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={draft.canton}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  canton: event.target.value as CantonName | "",
                  city: "",
                }))
              }
              className="h-11 rounded-full border bg-background px-4 text-sm"
            >
              <option value="">Alle Kantone</option>
              {CANTON_OPTIONS.map((canton) => (
                <option key={canton} value={canton}>
                  {canton}
                </option>
              ))}
            </select>

            <select
              value={draft.category}
              onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
              className="h-11 rounded-full border bg-background px-4 text-sm"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={draft.slotDuration}
              onChange={(event) => setDraft((current) => ({ ...current, slotDuration: event.target.value }))}
              className="h-11 rounded-full border bg-background px-4 text-sm"
            >
              {SLOT_DURATION_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            <Input
              type="number"
              min={0}
              value={draft.priceMax ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  priceMax: event.target.value ? Number(event.target.value) : null,
                }))
              }
              placeholder="Max. Preis"
              className="h-11 w-36 rounded-full border-border/80 px-4 shadow-none"
            />

            {AMENITY_OPTIONS.map((amenity) => {
              const active = draft.amenities.includes(amenity.id);

              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      amenities: toggleValue(current.amenities, amenity.id),
                    }))
                  }
                  className={`h-11 rounded-full border px-4 text-sm transition ${
                    active ? "border-foreground bg-foreground text-background" : "bg-background hover:bg-muted"
                  }`}
                >
                  {amenity.label}
                </button>
              );
            })}

            <Button type="button" variant="ghost" className="h-11 rounded-full" onClick={resetFilters}>
              Filter löschen
            </Button>

            <Button
              type="button"
              variant={draft.map ? "default" : "outline"}
              className="h-11 rounded-full"
              onClick={() => {
                const next = { ...draft, map: !draft.map };
                setDraft(next);
                applyFilters(next);
              }}
            >
              <Map className="mr-2 size-4" />
              Map View
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 py-4">
        <div className="grid h-full gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="min-h-0 overflow-y-auto rounded-3xl border bg-card p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Explore</p>
                <h2 className="text-xl font-semibold tracking-tight">{hosts.length} Spots</h2>
              </div>

              {activeFilterCount ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  <Filter className="size-3.5" />
                  {activeFilterCount} Filter
                </div>
              ) : null}
            </div>

            <HostListItems
              hosts={hosts}
              selectedHostId={selectedHostId}
              onSelectHost={(hostId) => {
                setSelectedHostId(hostId);

                if (draft.map) {
                  const next = { ...draft, map: false };
                  setDraft(next);
                  applyFilters(next);
                }
              }}
              emptyMessage="Keine Spots für diese Filter gefunden."
            />
          </div>

          <div className="min-h-0 overflow-hidden rounded-3xl border bg-card">
            {draft.map ? (
              <MapView hosts={hosts} selectedCanton={selectedCanton} onSelectCanton={handleSelectCanton} />
            ) : selectedHost ? (
              <HostDetailsPanel host={selectedHost} onClose={() => setSelectedHostId(null)} />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold tracking-tight">Wähle einen Spot</h3>
                  <p className="text-sm text-muted-foreground">Klicke links auf einen Eintrag oder aktiviere die Map View.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMobileFilters ? (
        <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur lg:hidden">
          <div className="absolute inset-x-0 bottom-0 rounded-t-[32px] border bg-background p-5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">Filter</h3>
              <button type="button" onClick={() => setShowMobileFilters(false)} className="rounded-full border p-2">
                <X className="size-4" />
              </button>
            </div>

            <div className="grid gap-4">
              <Input
                value={draft.city}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    city: event.target.value,
                    canton: "",
                  }))
                }
                placeholder="Stadt"
                className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
              />

              <select
                value={draft.canton}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    canton: event.target.value as CantonName | "",
                    city: "",
                  }))
                }
                className="h-12 rounded-2xl border bg-background px-4 text-sm"
              >
                <option value="">Alle Kantone</option>
                {CANTON_OPTIONS.map((canton) => (
                  <option key={canton} value={canton}>
                    {canton}
                  </option>
                ))}
              </select>

              <select
                value={draft.category}
                onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
                className="h-12 rounded-2xl border bg-background px-4 text-sm"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={draft.slotDuration}
                onChange={(event) => setDraft((current) => ({ ...current, slotDuration: event.target.value }))}
                className="h-12 rounded-2xl border bg-background px-4 text-sm"
              >
                {SLOT_DURATION_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Input
                type="number"
                min={0}
                value={draft.priceMax ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    priceMax: event.target.value ? Number(event.target.value) : null,
                  }))
                }
                placeholder="Max. Preis"
                className="h-12 rounded-2xl border-border/80 px-4 shadow-none"
              />

              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map((amenity) => {
                  const active = draft.amenities.includes(amenity.id);

                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          amenities: toggleValue(current.amenities, amenity.id),
                        }))
                      }
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        active ? "border-foreground bg-foreground text-background" : "bg-background hover:bg-muted"
                      }`}
                    >
                      {amenity.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <Button type="button" variant="outline" className="h-12 flex-1 rounded-full" onClick={resetFilters}>
                Zurücksetzen
              </Button>
              <Button
                type="button"
                className="h-12 flex-1 rounded-full"
                onClick={() => {
                  applyFilters(draft);
                  setShowMobileFilters(false);
                }}
              >
                Anwenden
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
