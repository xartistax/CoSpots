"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, type Latitude, type Longitude } from "@vnedyalk0v/react19-simple-maps";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { CantonName } from "@/lib/maps/cantons";
import { CANTON_CENTERS } from "@/lib/maps/canton-centers";
import chCantons from "@/lib/maps/ch-cantons.json";

const center: [Longitude, Latitude] = [8.3, 46.8] as [Longitude, Latitude];

type SwitzerlandMapProps = {
  selectedCanton?: CantonName | null;
  className?: string;
  onSelectCanton?: (canton: CantonName) => void;
  cantonCounts?: Partial<Record<CantonName, number>>;
  cantonPrices?: Partial<Record<CantonName, number>>;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function SwitzerlandMap({ selectedCanton = null, className, onSelectCanton, cantonCounts = {}, cantonPrices = {} }: SwitzerlandMapProps) {
  const [isReady, setIsReady] = useState(false);
  console.log("selectedCanton", selectedCanton);
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsReady(true);
    }, 180);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  const normalizedSelectedCanton = selectedCanton ? normalize(selectedCanton) : null;

  if (!isReady) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center", className)}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={cn("h-full w-full bg-[#f7f7f7] bg-[radial-gradient(circle_at_30%_30%,#fff9db,transparent)]", className)}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center,
          scale: 9000,
        }}
        width={800}
        height={600}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={chCantons}>
          {({ geographies }) =>
            geographies.map((geo, index) => {
              const cantonName = typeof geo.properties?.name === "string" ? (geo.properties.name as CantonName) : null;

              const normalizedCantonName = cantonName ? normalize(cantonName) : null;

              const isSelected = !!normalizedSelectedCanton && !!normalizedCantonName && normalizedCantonName === normalizedSelectedCanton;

              const hasHosts = cantonName ? (cantonCounts[cantonName] ?? 0) > 0 : false;

              return (
                <Geography
                  key={geo.rsmKey ?? geo.id ?? geo.properties?.name ?? index}
                  geography={geo}
                  className="cursor-pointer outline-none"
                  tabIndex={-1}
                  onClick={() => {
                    if (cantonName) {
                      onSelectCanton?.(cantonName);
                    }
                  }}
                  onMouseUp={(event) => {
                    event.currentTarget.blur();
                  }}
                  onFocus={(event) => {
                    event.currentTarget.blur();
                  }}
                  style={{
                    default: {
                      fill: isSelected ? "#F9D02D" : hasHosts ? "#FEF3C7" : "#F1F1F1",
                      stroke: isSelected ? "#B88900" : "#D4D4D8",
                      strokeWidth: isSelected ? 1.4 : 0.9,
                      outline: "none",
                      filter: isSelected ? "drop-shadow(0 0 6px rgba(249,208,45,0.6))" : undefined,
                      transition: "all 0.2s ease",
                    },
                    hover: {
                      fill: isSelected ? "#F9D02D" : hasHosts ? "#FCE588" : "#E7E7E7",
                      stroke: isSelected ? "#A16207" : "#A1A1AA",
                      strokeWidth: isSelected ? 1.4 : 1,
                      outline: "none",
                      filter: isSelected ? "drop-shadow(0 0 6px rgba(249,208,45,0.6))" : undefined,
                      transition: "all 0.2s ease",
                    },
                    pressed: {
                      fill: "#F9D02D",
                      stroke: "#B88900",
                      strokeWidth: 1.4,
                      outline: "none",
                      filter: "drop-shadow(0 0 6px rgba(249,208,45,0.6))",
                      transition: "all 0.2s ease",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {Object.entries(CANTON_CENTERS).map(([cantonName, coordinates]) => {
          const typedCanton = cantonName as CantonName;
          const count = cantonCounts[typedCanton] ?? 0;

          if (!coordinates || count <= 0) {
            return null;
          }

          const isSelected = selectedCanton === typedCanton;
          const minPrice = cantonPrices[typedCanton] ?? null;

          return (
            <Marker key={typedCanton} coordinates={coordinates as [Longitude, Latitude]}>
              <g className="cursor-pointer" onClick={() => onSelectCanton?.(typedCanton)}>
                <foreignObject x={-36} y={-18} width={72} height={36}>
                  <div className="flex justify-center">
                    <div
                      className={cn(
                        "inline-flex min-w-[56px] items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition",
                        isSelected ? "border-[#B88900] bg-[#F9D02D] text-black" : "border-border bg-white text-foreground",
                      )}
                    >
                      {minPrice ? `CHF ${minPrice}` : count}
                    </div>
                  </div>
                </foreignObject>
              </g>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}
