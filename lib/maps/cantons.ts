export type CantonName =
  | "Aargau"
  | "Appenzell Ausserrhoden"
  | "Appenzell Innerrhoden"
  | "Basel-Landschaft"
  | "Basel-Stadt"
  | "Bern / Berne"
  | "Fribourg"
  | "Genève"
  | "Glarus"
  | "Graubünden"
  | "Jura"
  | "Luzern"
  | "Neuchâtel"
  | "Nidwalden"
  | "Obwalden"
  | "Schaffhausen"
  | "Schwyz"
  | "Solothurn"
  | "St. Gallen"
  | "Thurgau"
  | "Ticino"
  | "Uri"
  | "Vaud"
  | "Valais"
  | "Zug"
  | "Zürich";

const CITY_TO_CANTON_NAME: Record<string, CantonName> = {
  aarau: "Aargau",
  appenzell: "Appenzell Innerrhoden",
  herisau: "Appenzell Ausserrhoden",
  bern: "Bern / Berne",
  biel: "Bern / Berne",
  thun: "Bern / Berne",
  liestal: "Basel-Landschaft",
  basel: "Basel-Stadt",
  fribourg: "Fribourg",
  freiburg: "Fribourg",
  geneve: "Genève",
  genève: "Genève",
  geneva: "Genève",
  glarus: "Glarus",
  chur: "Graubünden",
  delemont: "Jura",
  delémont: "Jura",
  luzern: "Luzern",
  lucerne: "Luzern",
  neuchatel: "Neuchâtel",
  neuchâtel: "Neuchâtel",
  stans: "Nidwalden",
  sarnen: "Obwalden",
  "st. gallen": "St. Gallen",
  "st gallen": "St. Gallen",
  "sankt gallen": "St. Gallen",
  schaffhausen: "Schaffhausen",
  solothurn: "Solothurn",
  schwyz: "Schwyz",
  frauenfeld: "Thurgau",
  lugano: "Ticino",
  bellinzona: "Ticino",
  altdorf: "Uri",
  lausanne: "Vaud",
  montreux: "Vaud",
  vevey: "Vaud",
  sion: "Valais",
  brig: "Valais",
  zug: "Zug",
  zürich: "Zürich",
  zurich: "Zürich",
  winterthur: "Zürich",
};

export function getCantonFromCity(city: string | null | undefined): CantonName | null {
  if (!city) {
    return null;
  }

  return CITY_TO_CANTON_NAME[city.trim().toLowerCase()] ?? null;
}
