import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import type { HostAvailabilityData, HostContentData, HostLocationData, HostProfileData, HostRulesData, HostSetupData } from "@/types/user-profile";

type SeedHost = {
  uid: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  hostProfile: HostProfileData;
  hostLocation: HostLocationData;
  hostSetup: HostSetupData;
  hostAvailability: HostAvailabilityData;
  hostRules: HostRulesData;
  hostContent: HostContentData;
};

const RULE_IDS = ["booking-limit", "no-claim", "house-rules", "legal"] as const;

const cities = [
  { city: "Zürich", prefix: "zuerich" },
  { city: "Basel", prefix: "basel" },
  { city: "Bern", prefix: "bern" },
  { city: "Luzern", prefix: "luzern" },
  { city: "Lugano", prefix: "lugano" },
  { city: "Lausanne", prefix: "lausanne" },
  { city: "Genève", prefix: "geneve" },
  { city: "Zug", prefix: "zug" },
  { city: "St. Gallen", prefix: "st-gallen" },
  { city: "Winterthur", prefix: "winterthur" },
  { city: "Neuchâtel", prefix: "neuchatel" },
  { city: "Aarau", prefix: "aarau" },
] as const;

const categories = ["cafe", "bar", "restaurant", "hotel-lounge", "other"] as const;
const amenitiesPool = ["wifi", "power", "laptop-zone", "wc"] as const;
const slotDurations = ["2h", "3h", "4h"] as const;

const weekdaySets: HostAvailabilityData["days"][] = [
  ["mon", "tue", "wed", "thu", "fri"],
  ["mon", "wed", "thu", "fri", "sat"],
  ["tue", "wed", "thu", "fri", "sat"],
  ["mon", "tue", "wed"],
  ["thu", "fri", "sat", "sun"],
  ["mon", "tue", "wed", "thu", "fri", "sat"],
];

const locationNames = [
  "Workspace",
  "Desk Club",
  "Work Lounge",
  "Dayspace",
  "Cowork Spot",
  "Studio Desk",
  "Hub Space",
  "Lab Workspace",
  "Office Lounge",
  "Desk House",
] as const;

const operatorPrefixes = ["Urban", "Lake", "Dock", "Studio", "Loft", "Pulse", "Vista", "Alpine", "Metro", "Riverside", "North", "South"] as const;

const streetNames = [
  "Langstrasse",
  "Bahnhofstrasse",
  "Hardstrasse",
  "Seefeldstrasse",
  "Kramgasse",
  "Josefstrasse",
  "Clarastrasse",
  "Pilatusstrasse",
  "Baarerstrasse",
  "Rue du Rhône",
  "Marktgasse",
  "Spitalgasse",
] as const;

const reviewAuthors = ["Lena", "Marco", "Nina", "Tom", "Sofia", "Jan", "Mila", "Noah", "Elin", "David", "Sara", "Luca"] as const;

const reviewTexts = [
  "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
  "Gute Location für fokussierte Sessions. Kaffee war auch top.",
  "Stylisch, sauber und super für ein paar produktive Stunden.",
  "Hat alles, was man für Remote Work braucht.",
  "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
  "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
  "Würde ich jederzeit wieder buchen.",
  "Top Mischung aus Komfort, WLAN und guter Lage.",
] as const;

const descriptionTemplates = [
  "Moderner %{categoryLabel} mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
  "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
  "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
  "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
  "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
] as const;

const imagePool = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
] as const;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOne<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function pickMany<T>(items: readonly T[], count: number): T[] {
  return shuffle(items).slice(0, Math.min(count, items.length));
}

function padSeedId(value: number): string {
  return String(value).padStart(3, "0");
}

function categoryLabel(category: HostLocationData["category"]): string {
  switch (category) {
    case "cafe":
      return "Café";
    case "bar":
      return "Bar";
    case "restaurant":
      return "Restaurant";
    case "hotel-lounge":
      return "Hotel Lounge";
    default:
      return "Workspace";
  }
}

function buildDescription(category: HostLocationData["category"]): string {
  const template = pickOne(descriptionTemplates);
  return template.replace("%{categoryLabel}", categoryLabel(category));
}

function buildAddress(): string {
  return `${pickOne(streetNames)} ${randomInt(1, 120)}`;
}

function buildPhone(seedIndex: number): string {
  const areaCodes = ["44", "61", "31", "41", "91", "21", "22", "71", "52"];
  const area = pickOne(areaCodes);
  return `+41 ${area} ${randomInt(100, 999)} ${randomInt(10, 99)} ${String(seedIndex).padStart(2, "0")}`;
}

function randomDateWithinLastMonths(months: number): string {
  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - months);

  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());

  return new Date(randomTime).toISOString();
}

function buildGallery(uid: string, locationName: string): HostContentData["gallery"] {
  return pickMany(imagePool, 3).map((url, index) => ({
    id: `${uid}-image-${index + 1}`,
    url,
    alt: `${locationName} Bild ${index + 1}`,
  }));
}

function buildReviews(uid: string): HostContentData["reviews"] {
  const count = randomInt(0, 3);

  return Array.from({ length: count }, (_, index) => ({
    id: `${uid}-review-${index + 1}`,
    author: pickOne(reviewAuthors),
    rating: randomInt(4, 5),
    date: `${String(randomInt(1, 28)).padStart(2, "0")}.${String(randomInt(1, 4)).padStart(2, "0")}.2026`,
    text: pickOne(reviewTexts),
  }));
}

function createHost(seedNumber: number): SeedHost {
  const id = padSeedId(seedNumber);
  const cityConfig = pickOne(cities);
  const category = pickOne(categories);
  const operatorPrefix = pickOne(operatorPrefixes);
  const locationSuffix = pickOne(locationNames);
  const locationName = `${operatorPrefix} ${locationSuffix}`;

  const operatorName =
    category === "cafe"
      ? `${operatorPrefix} Café ${cityConfig.city} GmbH`
      : category === "bar"
        ? `${operatorPrefix} Bar ${cityConfig.city} AG`
        : category === "restaurant"
          ? `${operatorPrefix} Restaurant ${cityConfig.city} GmbH`
          : category === "hotel-lounge"
            ? `${operatorPrefix} Lounge ${cityConfig.city} AG`
            : `${operatorPrefix} ${cityConfig.city} GmbH`;

  const spots = randomInt(6, 36);
  const price = randomInt(8, 32);
  const fromHour = randomInt(7, 10);
  const toHour = randomInt(17, 21);

  const uid = `seed-host-${id}`;
  const emailName = `${operatorPrefix}-${locationSuffix}-${cityConfig.prefix}`.toLowerCase().replaceAll(" ", "-");

  const createdAt = randomDateWithinLastMonths(6);
  const updatedAt = new Date().toISOString();

  return {
    uid,
    email: `hello@${emailName}.ch`,
    avatarUrl: null,
    createdAt,
    updatedAt,
    hostProfile: {
      operatorName,
      phone: buildPhone(seedNumber),
      locationName,
      address: buildAddress(),
      city: cityConfig.city,
    },
    hostLocation: {
      category,
      description: buildDescription(category),
      website: `https://${emailName}.ch`,
      instagram: `https://www.instagram.com/${emailName}`,
      amenities: pickMany(amenitiesPool, randomInt(2, 4)),
    },
    hostSetup: {
      spots,
      price,
      marked: Math.random() > 0.35,
      laptopZoneOnly: Math.random() > 0.45,
      slotDuration: pickOne(slotDurations),
    },
    hostAvailability: {
      days: pickOne(weekdaySets),
      from: `${String(fromHour).padStart(2, "0")}:00`,
      to: `${String(toHour).padStart(2, "0")}:00`,
      recurring: true,
      gracePeriod: pickOne([5, 10, 15, 20]),
      extendAllowed: Math.random() > 0.4,
    },
    hostRules: {
      accepted: [...RULE_IDS],
    },
    hostContent: {
      gallery: buildGallery(uid, locationName),
      reviews: buildReviews(uid),
    },
  };
}

function formatHost(host: SeedHost): string {
  return `{
  uid: ${JSON.stringify(host.uid)},
  email: ${JSON.stringify(host.email)},
  avatarUrl: null,
  createdAt: ${JSON.stringify(host.createdAt)},
  updatedAt: ${JSON.stringify(host.updatedAt)},
  hostProfile: {
    operatorName: ${JSON.stringify(host.hostProfile.operatorName)},
    phone: ${JSON.stringify(host.hostProfile.phone)},
    locationName: ${JSON.stringify(host.hostProfile.locationName)},
    address: ${JSON.stringify(host.hostProfile.address)},
    city: ${JSON.stringify(host.hostProfile.city)},
  },
  hostLocation: {
    category: ${JSON.stringify(host.hostLocation.category)},
    description: ${JSON.stringify(host.hostLocation.description)},
    website: ${JSON.stringify(host.hostLocation.website)},
    instagram: ${JSON.stringify(host.hostLocation.instagram)},
    amenities: ${JSON.stringify(host.hostLocation.amenities)},
  },
  hostSetup: {
    spots: ${host.hostSetup.spots},
    price: ${host.hostSetup.price},
    marked: ${String(host.hostSetup.marked)},
    laptopZoneOnly: ${String(host.hostSetup.laptopZoneOnly)},
    slotDuration: ${JSON.stringify(host.hostSetup.slotDuration)},
  },
  hostAvailability: {
    days: ${JSON.stringify(host.hostAvailability.days)},
    from: ${JSON.stringify(host.hostAvailability.from)},
    to: ${JSON.stringify(host.hostAvailability.to)},
    recurring: ${String(host.hostAvailability.recurring)},
    gracePeriod: ${host.hostAvailability.gracePeriod},
    extendAllowed: ${String(host.hostAvailability.extendAllowed)},
  },
  hostRules: {
    accepted: ${JSON.stringify([...host.hostRules.accepted])},
  },
  hostContent: {
    gallery: ${JSON.stringify(host.hostContent.gallery, null, 2)
      .replaceAll("\n", "\n      ")
      .replace(/"([^"]+)":/g, "$1:")},
    reviews: ${JSON.stringify(host.hostContent.reviews, null, 2)
      .replaceAll("\n", "\n      ")
      .replace(/"([^"]+)":/g, "$1:")},
  },
}`;
}

function main() {
  const countArg = process.argv[2];
  const count = Number.isFinite(Number(countArg)) && Number(countArg) > 0 ? Number(countArg) : 50;

  const hosts = Array.from({ length: count }, (_, index) => createHost(index + 1));
  const content = hosts.map(formatHost).join(",\n\n");
  const outputPath = resolve(process.cwd(), "scripts/generated-hosts.ts.txt");

  writeFileSync(outputPath, content, "utf8");

  console.log(`Generated ${hosts.length} hosts.`);
  console.log(`Saved to ${outputPath}`);
}

main();
