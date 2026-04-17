"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import type { AppProfile } from "@/types/user-profile";
import { AMENITY_ICONS } from "@/lib/amenities-icons";
import { cn } from "@/lib/utils";
import { title } from "process";

type HostListItemsProps = {
  hosts: AppProfile[];
  selectedHostId: string | null;
  onSelectHost: (hostId: string) => void;
  onHoverHost?: (hostId: string | null) => void;
  emptyMessage?: string;
};

function getAverageRating(host: AppProfile): number | null {
  const reviews = host.hostContent?.reviews ?? [];

  if (!reviews.length) {
    return null;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
}

function formatAmenityLabel(value: string): string {
  return value.replace("-", " ");
}

export function HostListItems({ hosts, selectedHostId, onSelectHost, onHoverHost, emptyMessage = "No hosts found." }: HostListItemsProps) {
  if (!hosts.length) {
    return <div className="text-sm text-muted-foreground">{emptyMessage}</div>;
  }

  return (
    <div className="grid gap-3">
      {hosts.map((host) => {
        const isSelected = host.uid === selectedHostId;
        const previewImage = host.hostContent?.gallery?.[0]?.url ?? null;
        const averageRating = getAverageRating(host);
        const reviewCount = host.hostContent?.reviews?.length ?? 0;
        const visibleAmenities = host.hostLocation?.amenities?.slice(0, 3) ?? [];

        return (
          <button
            key={host.uid}
            type="button"
            onClick={() => onSelectHost(host.uid)}
            onMouseEnter={() => onHoverHost?.(host.uid)}
            onMouseLeave={() => onHoverHost?.(null)}
            className="text-left"
          >
            <article
              className={cn(
                "group overflow-hidden rounded-2xl border bg-background transition-all hover:border-foreground/20 hover:bg-muted/20",
                isSelected && "border-foreground ring-1 ring-foreground",
              )}
            >
              <div className="grid gap-4 p-4 sm:grid-cols-[120px_minmax(0,1fr)]">
                <div className="overflow-hidden rounded-xl bg-muted">
                  {previewImage ? (
                    <>
                      <div className="relative h-28 w-full overflow-hidden rounded-xl sm:h-full">
                        <Image
                          src={previewImage}
                          alt={host.hostProfile?.locationName ?? "Host"}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 120px"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex h-28 items-center justify-center text-xs text-muted-foreground sm:h-full">No image</div>
                  )}
                </div>

                <div className="min-w-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold tracking-tight">{host.hostProfile?.locationName ?? "Unknown"}</h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {host.hostProfile?.city}
                        {host.hostProfile?.address ? ` · ${host.hostProfile.address}` : ""}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold">CHF {host.hostSetup?.price ?? 0}</p>
                      <p className="text-xs text-muted-foreground">pro Slot</p>
                    </div>
                  </div>

                  <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{host.hostLocation?.description}</p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                    {averageRating ? (
                      <div className="flex items-center gap-1.5">
                        <Star className="size-4 fill-foreground text-foreground" />
                        <span className="font-medium text-foreground">{averageRating.toFixed(1)}</span>
                        <span>({reviewCount})</span>
                      </div>
                    ) : (
                      <span>Neu</span>
                    )}

                    <span>·</span>

                    <span>{host.hostSetup?.spots ?? 0} Plätze</span>

                    <span>·</span>

                    <span>{host.hostSetup?.slotDuration ?? "-"}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-muted-foreground">
                    {visibleAmenities.map((amenity) => {
                      const Icon = AMENITY_ICONS[amenity as keyof typeof AMENITY_ICONS];

                      return (
                        <div key={amenity} className="flex items-center gap-1.5 text-xs">
                          {Icon ? <Icon className="size-4" /> : null}
                          <span className="capitalize">{formatAmenityLabel(amenity)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          </button>
        );
      })}
    </div>
  );
}
