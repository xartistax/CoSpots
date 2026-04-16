import { adminDb } from "@/lib/firebase/admin";
import type { AppProfile, HostAvailabilityData, HostLocationData, HostProfileData, HostRulesData, HostSetupData } from "@/types/user-profile";

const now = new Date().toISOString();

const RULE_IDS: HostRulesData["accepted"] = ["booking-limit", "no-claim", "house-rules", "legal"];

type SeedHost = {
  uid: string;
  email: string;
  avatarUrl: string | null;
  hostProfile: HostProfileData;
  hostLocation: HostLocationData;
  hostSetup: HostSetupData;
  hostAvailability: HostAvailabilityData;
  hostRules: HostRulesData;
};

const hosts: SeedHost[] = [
  {
    uid: "seed-host-001",
    email: "hello@cafe-zuerich.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Café Zürich GmbH",
      phone: "+41 44 111 22 33",
      locationName: "Café Workspace",
      address: "Langstrasse 10",
      city: "Zürich",
    },
    hostLocation: {
      category: "cafe",
      description: "Modernes Café mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://cafe-workspace.ch",
      instagram: "https://www.instagram.com/cafe.workspace",
      amenities: ["wifi", "power", "laptop-zone", "wc"],
    },
    hostSetup: {
      spots: 12,
      price: 15,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "08:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-002",
    email: "info@bar-basel.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Bar Basel AG",
      phone: "+41 61 222 33 44",
      locationName: "Work & Drink Basel",
      address: "Clarastrasse 5",
      city: "Basel",
    },
    hostLocation: {
      category: "bar",
      description: "Entspannte Bar am Tag mit reservierten Arbeitsplätzen und guter Infrastruktur für Freelancer.",
      website: "https://workdrink-basel.ch",
      instagram: "https://www.instagram.com/workdrink.basel",
      amenities: ["wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 8,
      price: 10,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "10:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-003",
    email: "team@hotel-lounge.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Hotel Lounge Zürich",
      phone: "+41 44 333 44 55",
      locationName: "Business Lounge",
      address: "Bahnhofstrasse 20",
      city: "Zürich",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Ruhige Business Lounge mit komfortablen Sitzplätzen, WLAN und idealer Atmosphäre für produktives Arbeiten.",
      website: "https://hotel-lounge.ch",
      instagram: "https://www.instagram.com/hotel.lounge",
      amenities: ["wifi", "power", "wc", "laptop-zone"],
    },
    hostSetup: {
      spots: 20,
      price: 20,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sun"],
      from: "08:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-004",
    email: "hello@rheinblick-cafe.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Rheinblick Café GmbH",
      phone: "+41 61 400 11 04",
      locationName: "Rheinblick Café",
      address: "Rheingasse 18",
      city: "Basel",
    },
    hostLocation: {
      category: "cafe",
      description: "Charmantes Café mit WLAN, Steckdosen und klar definierten Laptop-Plätzen für fokussierte Sessions.",
      website: "https://rheinblick-cafe.ch",
      instagram: "https://www.instagram.com/rheinblick.cafe",
      amenities: ["wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 9,
      price: 12,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "thu", "fri"],
      from: "08:30",
      to: "17:30",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-005",
    email: "info@bergbar-bern.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Bergbar Bern AG",
      phone: "+41 31 500 11 05",
      locationName: "Bergbar Dayspace",
      address: "Marktgasse 42",
      city: "Bern",
    },
    hostLocation: {
      category: "bar",
      description: "Tagsüber ruhige Bar mit lockerer Atmosphäre, guten Drinks und zuverlässiger Infrastruktur für mobiles Arbeiten.",
      website: "https://bergbar-bern.ch",
      instagram: "https://www.instagram.com/bergbar.bern",
      amenities: ["wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 7,
      price: 11,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "11:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: false,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-006",
    email: "team@luzern-lounge.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Luzern Lounge AG",
      phone: "+41 41 600 11 06",
      locationName: "Lake Lounge",
      address: "Pilatusstrasse 14",
      city: "Luzern",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Hochwertige Lounge nahe Bahnhof mit diskreter Arbeitsatmosphäre und flexiblen Buchungsslots.",
      website: "https://luzern-lounge.ch",
      instagram: "https://www.instagram.com/luzern.lounge",
      amenities: ["wifi", "power", "laptop-zone", "wc"],
    },
    hostSetup: {
      spots: 16,
      price: 22,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-007",
    email: "hello@alpenkaffee-zug.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Alpenkaffee Zug GmbH",
      phone: "+41 41 700 11 07",
      locationName: "Alpenkaffee Workspace",
      address: "Baarerstrasse 31",
      city: "Zug",
    },
    hostLocation: {
      category: "cafe",
      description: "Kleines Premium-Café mit ruhigen Vormittagen, guter Beleuchtung und solider Ausstattung für Laptop-Arbeit.",
      website: "https://alpenkaffee-zug.ch",
      instagram: "https://www.instagram.com/alpenkaffee.zug",
      amenities: ["wifi", "power", "laptop-zone", "wc"],
    },
    hostSetup: {
      spots: 6,
      price: 18,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu"],
      from: "09:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-008",
    email: "info@altstadt-restaurant.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Altstadt Restaurant GmbH",
      phone: "+41 44 800 11 08",
      locationName: "Altstadt Worktables",
      address: "Niederdorfstrasse 22",
      city: "Zürich",
    },
    hostLocation: {
      category: "restaurant",
      description: "Restaurant mit separatem Tagesbereich für ruhiges Arbeiten, schnellem WLAN und komfortablen Sitzplätzen.",
      website: "https://altstadt-restaurant.ch",
      instagram: "https://www.instagram.com/altstadt.restaurant",
      amenities: ["wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 10,
      price: 14,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "09:30",
      to: "16:30",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-009",
    email: "hello@seehotel-lounge.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Seehotel Lounge AG",
      phone: "+41 91 900 11 09",
      locationName: "Seelounge Lugano",
      address: "Via Nassa 11",
      city: "Lugano",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Elegante Lounge mit Blick auf den See, ideal für konzentrierte Arbeit und flexible Tagesbuchungen.",
      website: "https://seehotel-lounge.ch",
      instagram: "https://www.instagram.com/seehotel.lounge",
      amenities: ["wifi", "power", "wc", "laptop-zone"],
    },
    hostSetup: {
      spots: 14,
      price: 21,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sun"],
      from: "08:00",
      to: "19:30",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-010",
    email: "team@dock-cafe-lausanne.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Dock Café Lausanne",
      phone: "+41 21 210 11 10",
      locationName: "Dock Café",
      address: "Rue du Port-Franc 6",
      city: "Lausanne",
    },
    hostLocation: {
      category: "cafe",
      description: "Urbanes Café mit klaren Laptop-Zonen, schneller Verbindung und angenehmer Tagesatmosphäre.",
      website: "https://dock-cafe-lausanne.ch",
      instagram: "https://www.instagram.com/dock.cafe.lausanne",
      amenities: ["wifi", "power", "laptop-zone", "wc"],
    },
    hostSetup: {
      spots: 11,
      price: 13,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "08:30",
      to: "18:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-011",
    email: "hello@quartierbar-geneve.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Quartierbar Genève SA",
      phone: "+41 22 220 11 11",
      locationName: "Quartierbar Workday",
      address: "Rue de la Confédération 9",
      city: "Genève",
    },
    hostLocation: {
      category: "bar",
      description: "Stilvolle Bar mit ruhigem Tagesbetrieb, WLAN und passenden Sitzbereichen für kurze Work-Slots.",
      website: "https://quartierbar-geneve.ch",
      instagram: "https://www.instagram.com/quartierbar.geneve",
      amenities: ["wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 8,
      price: 16,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "10:00",
      to: "18:30",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-012",
    email: "info@marktcafe-bern.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Marktcafé Bern GmbH",
      phone: "+41 31 310 11 12",
      locationName: "Marktcafé Desk",
      address: "Kramgasse 60",
      city: "Bern",
    },
    hostLocation: {
      category: "cafe",
      description: "Zentrales Café mit ruhigem Innenbereich, reservierbaren Plätzen und gutem Setup für produktive Stunden.",
      website: "https://marktcafe-bern.ch",
      instagram: "https://www.instagram.com/marktcafe.bern",
      amenities: ["wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 13,
      price: 12,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "08:00",
      to: "17:30",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-013",
    email: "team@rheinrestaurant.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Rheinrestaurant AG",
      phone: "+41 61 610 11 13",
      locationName: "Rheinrestaurant Work Lounge",
      address: "St. Johanns-Vorstadt 35",
      city: "Basel",
    },
    hostLocation: {
      category: "restaurant",
      description: "Geräumiger Tagesbereich mit gutem WLAN und ausreichend Platz für Einzelgäste und kleine Teams.",
      website: "https://rheinrestaurant.ch",
      instagram: "https://www.instagram.com/rheinrestaurant.basel",
      amenities: ["wifi", "power", "wc", "laptop-zone"],
    },
    hostSetup: {
      spots: 15,
      price: 17,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-014",
    email: "hello@alpview-lounge.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Alpview Lounge GmbH",
      phone: "+41 41 410 11 14",
      locationName: "Alpview Lounge",
      address: "Haldenstrasse 21",
      city: "Luzern",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Ruhige Hotel-Lounge mit hochwertigem Ambiente, WLAN und passenden Bereichen für Business-Gäste.",
      website: "https://alpview-lounge.ch",
      instagram: "https://www.instagram.com/alpview.lounge",
      amenities: ["wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 18,
      price: 24,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sun"],
      from: "08:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-015",
    email: "info@werkbar-stgallen.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Werkbar St. Gallen AG",
      phone: "+41 71 710 11 15",
      locationName: "Werkbar Deskhouse",
      address: "Multergasse 7",
      city: "St. Gallen",
    },
    hostLocation: {
      category: "bar",
      description: "Kreativer Tagesbetrieb mit lockerer Atmosphäre, WLAN und passenden Arbeitsplätzen für kurze bis mittlere Sessions.",
      website: "https://werkbar-stgallen.ch",
      instagram: "https://www.instagram.com/werkbar.stgallen",
      amenities: ["wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 9,
      price: 11,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "10:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-016",
    email: "hello@flusscafe-aarau.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Flusscafé Aarau GmbH",
      phone: "+41 62 620 11 16",
      locationName: "Flusscafé Aarau",
      address: "Rathausgasse 12",
      city: "Aarau",
    },
    hostLocation: {
      category: "cafe",
      description: "Helles Café mit ruhiger Atmosphäre, solider Infrastruktur und angenehmen Bedingungen für mobile Arbeit.",
      website: "https://flusscafe-aarau.ch",
      instagram: "https://www.instagram.com/flusscafe.aarau",
      amenities: ["wifi", "power", "wc", "laptop-zone"],
    },
    hostSetup: {
      spots: 10,
      price: 13,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "08:30",
      to: "17:30",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-017",
    email: "team@metrorestaurant.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Metro Restaurant SA",
      phone: "+41 22 720 11 17",
      locationName: "Metro Worktables",
      address: "Rue du Marché 4",
      city: "Genève",
    },
    hostLocation: {
      category: "restaurant",
      description: "Zentral gelegenes Restaurant mit Tagesbereich, WLAN und guter Eignung für konzentriertes Einzelarbeiten.",
      website: "https://metrorestaurant.ch",
      instagram: "https://www.instagram.com/metrorestaurant.geneve",
      amenities: ["wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 12,
      price: 16,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "09:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-018",
    email: "info@panorama-lounge.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Panorama Lounge AG",
      phone: "+41 91 810 11 18",
      locationName: "Panorama Lounge",
      address: "Via Pretorio 8",
      city: "Lugano",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Business-Lounge mit ruhigem Ambiente, WLAN und flexiblen Slots für digitale Professionals.",
      website: "https://panorama-lounge.ch",
      instagram: "https://www.instagram.com/panorama.lounge",
      amenities: ["wifi", "power", "wc", "laptop-zone"],
    },
    hostSetup: {
      spots: 17,
      price: 23,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-019",
    email: "hello@stadtcafe-winterthur.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Stadtcafé Winterthur GmbH",
      phone: "+41 52 910 11 19",
      locationName: "Stadtcafé Desk",
      address: "Marktgasse 3",
      city: "Winterthur",
    },
    hostLocation: {
      category: "cafe",
      description: "Beliebtes Stadtcafé mit ruhigen Vormittagen, WLAN und laptopfreundlichen Tischen für flexible Arbeitstage.",
      website: "https://stadtcafe-winterthur.ch",
      instagram: "https://www.instagram.com/stadtcafe.winterthur",
      amenities: ["wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 8,
      price: 12,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
  {
    uid: "seed-host-020",
    email: "info@dockbar-neuchatel.ch",
    avatarUrl: null,
    hostProfile: {
      operatorName: "Dockbar Neuchâtel SA",
      phone: "+41 32 920 11 20",
      locationName: "Dockbar Day Lounge",
      address: "Rue du Seyon 15",
      city: "Neuchâtel",
    },
    hostLocation: {
      category: "bar",
      description: "Tagesbar mit ruhiger Musik, WLAN und soliden Rahmenbedingungen für kurze Buchungen und mobiles Arbeiten.",
      website: "https://dockbar-neuchatel.ch",
      instagram: "https://www.instagram.com/dockbar.neuchatel",
      amenities: ["wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 7,
      price: 10,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["wed", "thu", "fri", "sat", "sun"],
      from: "11:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: false,
    },
    hostRules: {
      accepted: RULE_IDS,
    },
  },
];

function toAppProfile(host: SeedHost): AppProfile {
  return {
    uid: host.uid,
    email: host.email,
    avatarUrl: host.avatarUrl,
    role: "host",
    authMethod: "email",
    onboardingCompleted: true,
    onboardingStep: "/onboarding/host/success",
    createdAt: now,
    updatedAt: now,
    hostProfile: host.hostProfile,
    hostLocation: host.hostLocation,
    hostSetup: host.hostSetup,
    hostAvailability: host.hostAvailability,
    hostRules: host.hostRules,
  };
}

async function seedHosts() {
  const batch = adminDb.batch();

  for (const host of hosts) {
    const ref = adminDb.collection("users").doc(host.uid);
    batch.set(ref, toAppProfile(host), { merge: true });
  }

  await batch.commit();

  console.log(`Seeded ${hosts.length} hosts.`);
}

seedHosts().catch((error: unknown) => {
  console.error("Failed to seed hosts:", error);
  process.exit(1);
});
