import type { CantonName } from "@/lib/maps/cantons";

export const CITY_TO_CANTON: Record<string, CantonName> = {
  zürich: "Zürich",
  basel: "Basel-Stadt",
  bern: "Bern / Berne",
  luzern: "Luzern",
  lugano: "Ticino",
  lausanne: "Vaud",
  genève: "Genève",
  geneve: "Genève",
  zug: "Zug",
  "st. gallen": "St. Gallen",
  "st gallen": "St. Gallen",
  winterthur: "Zürich",
  neuchâtel: "Neuchâtel",
  neuchatel: "Neuchâtel",
  aarau: "Aargau",
};

export function normalizeMapValue(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getCantonForCity(city: string | null | undefined): CantonName | null {
  const normalizedCity = normalizeMapValue(city);

  if (!normalizedCity) {
    return null;
  }

  return CITY_TO_CANTON[normalizedCity] ?? null;
}
