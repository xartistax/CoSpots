"use client";

import { MapPin, Sparkles } from "lucide-react";

import { getCantonForCity } from "@/lib/maps/city-to-canton";
import type { CantonName } from "@/lib/maps/cantons";
import type { AppProfile } from "@/types/user-profile";
import { SwitzerlandMap } from "../map/switzerland";

type MapViewProps = {
  hosts: AppProfile[];
  selectedCanton: CantonName | null;
  onSelectCanton: (canton: CantonName | null) => void;
};

function buildCantonCounts(hosts: AppProfile[]): Partial<Record<CantonName, number>> {
  return hosts.reduce<Partial<Record<CantonName, number>>>((acc, host) => {
    const canton = getCantonForCity(host.hostProfile?.city);

    if (!canton) {
      return acc;
    }

    acc[canton] = (acc[canton] ?? 0) + 1;
    return acc;
  }, {});
}

function buildCantonMinPrices(hosts: AppProfile[]): Partial<Record<CantonName, number>> {
  return hosts.reduce<Partial<Record<CantonName, number>>>((acc, host) => {
    const canton = getCantonForCity(host.hostProfile?.city);
    const price = host.hostSetup?.price;

    if (!canton || price == null) {
      return acc;
    }

    if (acc[canton] == null || price < acc[canton]!) {
      acc[canton] = price;
    }

    return acc;
  }, {});
}

export function MapView({ hosts, selectedCanton, onSelectCanton }: MapViewProps) {
  const cantonCounts = buildCantonCounts(hosts);
  const cantonPrices = buildCantonMinPrices(hosts);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f7f7f7]">
      <SwitzerlandMap
        selectedCanton={selectedCanton}
        onSelectCanton={(canton) => onSelectCanton(selectedCanton === canton ? null : canton)}
        cantonCounts={cantonCounts}
        cantonPrices={cantonPrices}
        className="h-full w-full"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 p-4">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2 rounded-2xl border bg-white/90 p-3 shadow-sm backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            Kanton klicken
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5" />
            {hosts.length} Spots sichtbar
          </div>

          {selectedCanton ? (
            <button
              type="button"
              onClick={() => onSelectCanton(null)}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[#F9D02D] px-3 py-1 text-xs font-medium text-black"
            >
              {selectedCanton} ×
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
