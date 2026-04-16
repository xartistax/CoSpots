"use client";

import { ComposableMap, Geographies, Geography, Latitude, Longitude } from "@vnedyalk0v/react19-simple-maps";

import chCantons from "@/lib/maps/ch-cantons.json";
import { cn } from "@/lib/utils";
import { CantonName } from "@/lib/maps/cantons";

const center: [Longitude, Latitude] = [8.3, 46.8] as [Longitude, Latitude];

type SwitzerlandMapProps = {
  selectedCanton?: CantonName | null;
  className?: string;
  onSelectCanton?: (canton: CantonName) => void;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function SwitzerlandMap({ selectedCanton = null, className, onSelectCanton }: SwitzerlandMapProps) {
  const normalizedSelectedCanton = selectedCanton ? normalize(selectedCanton) : null;

  return (
    <div className={cn("h-full w-full", className)}>
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

              return (
                <Geography
                  key={geo.rsmKey ?? geo.id ?? geo.properties?.name ?? index}
                  geography={geo}
                  className="cursor-pointer outline-none"
                  onClick={() => {
                    if (cantonName) {
                      onSelectCanton?.(cantonName);
                    }
                  }}
                  style={{
                    default: {
                      fill: isSelected ? "#0f172a" : "#e5e7eb",
                      stroke: isSelected ? "#0f172a" : "#9ca3af",
                      strokeWidth: isSelected ? 1.2 : 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: isSelected ? "#0f172a" : "#cbd5e1",
                      stroke: isSelected ? "#0f172a" : "#64748b",
                      strokeWidth: isSelected ? 1.2 : 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: isSelected ? "#0f172a" : "#94a3b8",
                      stroke: isSelected ? "#0f172a" : "#475569",
                      strokeWidth: isSelected ? 1.2 : 0.75,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
