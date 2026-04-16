"use client";

import type { AppProfile } from "@/types/user-profile";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HostListItemsProps = {
  hosts: AppProfile[];
  selectedHostId: string | null;
  onSelectHost: (hostId: string) => void;
  onHoverHost?: (hostId: string | null) => void;
  emptyMessage?: string;
};

export function HostListItems({ hosts, selectedHostId, onSelectHost, onHoverHost, emptyMessage = "No hosts found." }: HostListItemsProps) {
  if (!hosts.length) {
    return <div className="text-sm text-muted-foreground">{emptyMessage}</div>;
  }

  return (
    <div className="grid gap-4">
      {hosts.map((host) => {
        const isSelected = host.uid === selectedHostId;

        return (
          <button
            key={host.uid}
            type="button"
            onClick={() => onSelectHost(host.uid)}
            onMouseEnter={() => onHoverHost?.(host.uid)}
            onMouseLeave={() => onHoverHost?.(null)}
            className="text-left"
          >
            <Card className={cn("transition-colors hover:bg-muted/40", isSelected && "ring-2 ring-primary")}>
              <CardHeader>
                <CardTitle>{host.hostProfile?.locationName ?? "Unknown"}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {host.hostProfile?.city}
                  {host.hostProfile?.address ? ` • ${host.hostProfile.address}` : ""}
                </p>

                <p>{host.hostLocation?.description}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {host.hostLocation?.amenities?.map((amenity) => (
                    <span key={amenity} className="rounded-md border px-2 py-1 text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
