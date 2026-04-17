"use client";

import { useMemo, useState } from "react";

import { HostListItems } from "./host-list-items";
import { HostDetailsPanel } from "./host-details-panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SwitzerlandMap } from "@/components/map/switzerland";

import type { AppProfile } from "@/types/user-profile";
import { CantonName, getCantonFromCity } from "@/lib/maps/cantons";

type HostsShellProps = {
  hosts: AppProfile[];
};

export function HostsShell({ hosts }: HostsShellProps) {
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [hoveredHostId, setHoveredHostId] = useState<string | null>(null);
  const [selectedMapCanton, setSelectedMapCanton] = useState<CantonName | null>(null);

  const selectedHost = useMemo(() => hosts.find((host) => host.uid === selectedHostId) ?? null, [hosts, selectedHostId]);

  const hoveredHost = useMemo(() => hosts.find((host) => host.uid === hoveredHostId) ?? null, [hosts, hoveredHostId]);

  const hoveredCanton = useMemo(() => getCantonFromCity(hoveredHost?.hostProfile?.city), [hoveredHost]);

  const filteredHosts = useMemo(() => {
    if (!selectedMapCanton) {
      return hosts;
    }

    return hosts.filter((host) => getCantonFromCity(host.hostProfile?.city) === selectedMapCanton);
  }, [hosts, selectedMapCanton]);

  function handleSelectHost(hostId: string) {
    setSelectedHostId(hostId);
  }

  function handleCloseDetails() {
    setSelectedHostId(null);
  }

  function handleSelectCanton(canton: CantonName) {
    setSelectedHostId(null);
    setSelectedMapCanton((current) => (current === canton ? null : canton));
  }

  function handleResetCantonFilter() {
    setSelectedMapCanton(null);
  }

  return (
    <section className="mx-auto h-full max-w-7xl p-4">
      <div className="h-full md:hidden">
        {selectedHost ? (
          <HostDetailsPanel host={selectedHost} onClose={handleCloseDetails} />
        ) : (
          <div className="h-full overflow-hidden rounded-3xl bg-card">
            <ScrollArea className="h-full">
              <div className="space-y-4 px-1 py-1 pr-4">
                {selectedMapCanton ? (
                  <div className="sticky top-0 z-10 border-b bg-background/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-base font-semibold">{selectedMapCanton}</p>
                      <button type="button" onClick={handleResetCantonFilter} className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                        Zurücksetzen
                      </button>
                    </div>
                  </div>
                ) : null}

                <HostListItems
                  hosts={filteredHosts}
                  selectedHostId={selectedHostId}
                  onSelectHost={handleSelectHost}
                  onHoverHost={setHoveredHostId}
                  emptyMessage="Keine Hosts gefunden."
                />
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      <div className="hidden h-full gap-6 md:grid md:grid-cols-2">
        <div className="min-h-0 overflow-hidden rounded-3xl bg-card">
          <ScrollArea className="h-full">
            <div className="space-y-4 px-1 py-1 pr-4">
              {selectedMapCanton ? (
                <div className="sticky top-0 z-10 border-b bg-background/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-semibold">{selectedMapCanton}</p>
                    <button type="button" onClick={handleResetCantonFilter} className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                      Zurücksetzen
                    </button>
                  </div>
                </div>
              ) : null}

              <HostListItems
                hosts={filteredHosts}
                selectedHostId={selectedHostId}
                onSelectHost={handleSelectHost}
                onHoverHost={setHoveredHostId}
                emptyMessage="Keine Hosts gefunden."
              />
            </div>
          </ScrollArea>
        </div>

        <div className="min-h-0 rounded-3xl bg-card">
          {selectedHost ? (
            <HostDetailsPanel host={selectedHost} onClose={handleCloseDetails} />
          ) : (
            <SwitzerlandMap selectedCanton={hoveredCanton} onSelectCanton={handleSelectCanton} />
          )}
        </div>
      </div>
    </section>
  );
}
