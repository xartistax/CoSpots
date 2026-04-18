import type { CantonName } from "@/lib/maps/cantons";

export const CANTON_CENTERS: Partial<Record<CantonName, [number, number]>> = {
  Aargau: [8.05, 47.39],
  "Basel-Stadt": [7.59, 47.56],
  "Bern / Berne": [7.45, 46.95],
  Genève: [6.14, 46.2],
  Luzern: [8.31, 47.05],
  Neuchâtel: [6.93, 46.99],
  "St. Gallen": [9.37, 47.42],
  Ticino: [8.8, 46.32],
  Vaud: [6.64, 46.52],
  Zug: [8.52, 47.17],
  Zürich: [8.54, 47.37],
};
