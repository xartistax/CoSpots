import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { initializeApp, cert, getApps, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import type { AppProfile, HostAvailabilityData, HostContentData, HostLocationData, HostProfileData, HostRulesData, HostSetupData } from "@/types/user-profile";

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

const seedHosts: SeedHost[] = [
  // paste generated hosts here
  {
    uid: "seed-host-001",
    email: "hello@riverside-studio-desk-zuerich.ch",
    avatarUrl: null,
    createdAt: "2025-11-25T13:12:59.782Z",
    updatedAt: "2026-04-18T15:21:08.982Z",
    hostProfile: {
      operatorName: "Riverside Lounge Zürich AG",
      phone: "+41 31 215 67 01",
      locationName: "Riverside Studio Desk",
      address: "Rue du Rhône 5",
      city: "Zürich",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Moderner Hotel Lounge mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://riverside-studio-desk-zuerich.ch",
      instagram: "https://www.instagram.com/riverside-studio-desk-zuerich",
      amenities: ["wc", "wifi"],
    },
    hostSetup: {
      spots: 24,
      price: 30,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "10:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-001-image-1",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Studio Desk Bild 1",
        },
        {
          id: "seed-host-001-image-2",
          url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Studio Desk Bild 2",
        },
        {
          id: "seed-host-001-image-3",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Studio Desk Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-001-review-1",
          author: "Tom",
          rating: 4,
          date: "03.02.2026",
          text: "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
        },
      ],
    },
  },

  {
    uid: "seed-host-002",
    email: "hello@vista-dayspace-neuchatel.ch",
    avatarUrl: null,
    createdAt: "2026-01-17T18:57:01.765Z",
    updatedAt: "2026-04-18T15:21:08.982Z",
    hostProfile: {
      operatorName: "Vista Restaurant Neuchâtel GmbH",
      phone: "+41 31 573 35 02",
      locationName: "Vista Dayspace",
      address: "Langstrasse 48",
      city: "Neuchâtel",
    },
    hostLocation: {
      category: "restaurant",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://vista-dayspace-neuchatel.ch",
      instagram: "https://www.instagram.com/vista-dayspace-neuchatel",
      amenities: ["power", "wc"],
    },
    hostSetup: {
      spots: 14,
      price: 30,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "10:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-002-image-1",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Dayspace Bild 1",
        },
        {
          id: "seed-host-002-image-2",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Dayspace Bild 2",
        },
        {
          id: "seed-host-002-image-3",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Dayspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-002-review-1",
          author: "Lena",
          rating: 5,
          date: "13.03.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-003",
    email: "hello@urban-workspace-bern.ch",
    avatarUrl: null,
    createdAt: "2025-12-25T17:28:04.118Z",
    updatedAt: "2026-04-18T15:21:08.982Z",
    hostProfile: {
      operatorName: "Urban Bern GmbH",
      phone: "+41 31 931 26 03",
      locationName: "Urban Workspace",
      address: "Josefstrasse 115",
      city: "Bern",
    },
    hostLocation: {
      category: "other",
      description: "Moderner Workspace mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://urban-workspace-bern.ch",
      instagram: "https://www.instagram.com/urban-workspace-bern",
      amenities: ["wc", "wifi", "power"],
    },
    hostSetup: {
      spots: 19,
      price: 31,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["thu", "fri", "sat", "sun"],
      from: "10:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-003-image-1",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Workspace Bild 1",
        },
        {
          id: "seed-host-003-image-2",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Workspace Bild 2",
        },
        {
          id: "seed-host-003-image-3",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-003-review-1",
          author: "Sara",
          rating: 4,
          date: "25.01.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-004",
    email: "hello@pulse-dayspace-luzern.ch",
    avatarUrl: null,
    createdAt: "2026-02-27T00:34:08.771Z",
    updatedAt: "2026-04-18T15:21:08.982Z",
    hostProfile: {
      operatorName: "Pulse Café Luzern GmbH",
      phone: "+41 31 600 64 04",
      locationName: "Pulse Dayspace",
      address: "Clarastrasse 52",
      city: "Luzern",
    },
    hostLocation: {
      category: "cafe",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://pulse-dayspace-luzern.ch",
      instagram: "https://www.instagram.com/pulse-dayspace-luzern",
      amenities: ["power", "wc"],
    },
    hostSetup: {
      spots: 10,
      price: 19,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["thu", "fri", "sat", "sun"],
      from: "09:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-004-image-1",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Pulse Dayspace Bild 1",
        },
        {
          id: "seed-host-004-image-2",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Pulse Dayspace Bild 2",
        },
        {
          id: "seed-host-004-image-3",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Pulse Dayspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-004-review-1",
          author: "Jan",
          rating: 5,
          date: "01.04.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
        {
          id: "seed-host-004-review-2",
          author: "Nina",
          rating: 4,
          date: "20.03.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
        {
          id: "seed-host-004-review-3",
          author: "David",
          rating: 4,
          date: "08.03.2026",
          text: "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
        },
      ],
    },
  },

  {
    uid: "seed-host-005",
    email: "hello@riverside-lab-workspace-winterthur.ch",
    avatarUrl: null,
    createdAt: "2026-04-02T09:37:23.184Z",
    updatedAt: "2026-04-18T15:21:08.982Z",
    hostProfile: {
      operatorName: "Riverside Bar Winterthur AG",
      phone: "+41 52 794 40 05",
      locationName: "Riverside Lab Workspace",
      address: "Baarerstrasse 15",
      city: "Winterthur",
    },
    hostLocation: {
      category: "bar",
      description: "Moderner Bar mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://riverside-lab-workspace-winterthur.ch",
      instagram: "https://www.instagram.com/riverside-lab-workspace-winterthur",
      amenities: ["wifi", "power", "laptop-zone"],
    },
    hostSetup: {
      spots: 10,
      price: 10,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "07:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-005-image-1",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Lab Workspace Bild 1",
        },
        {
          id: "seed-host-005-image-2",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Lab Workspace Bild 2",
        },
        {
          id: "seed-host-005-image-3",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Lab Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-005-review-1",
          author: "Sofia",
          rating: 5,
          date: "20.03.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
        {
          id: "seed-host-005-review-2",
          author: "Sara",
          rating: 4,
          date: "13.02.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-006",
    email: "hello@metro-hub-space-lausanne.ch",
    avatarUrl: null,
    createdAt: "2026-03-23T23:06:33.717Z",
    updatedAt: "2026-04-18T15:21:08.982Z",
    hostProfile: {
      operatorName: "Metro Lausanne GmbH",
      phone: "+41 21 253 12 06",
      locationName: "Metro Hub Space",
      address: "Hardstrasse 14",
      city: "Lausanne",
    },
    hostLocation: {
      category: "other",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://metro-hub-space-lausanne.ch",
      instagram: "https://www.instagram.com/metro-hub-space-lausanne",
      amenities: ["power", "laptop-zone", "wifi", "wc"],
    },
    hostSetup: {
      spots: 15,
      price: 10,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-006-image-1",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Hub Space Bild 1",
        },
        {
          id: "seed-host-006-image-2",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Hub Space Bild 2",
        },
        {
          id: "seed-host-006-image-3",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Hub Space Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-006-review-1",
          author: "Noah",
          rating: 4,
          date: "15.03.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-007",
    email: "hello@south-workspace-geneve.ch",
    avatarUrl: null,
    createdAt: "2026-01-18T23:16:48.710Z",
    updatedAt: "2026-04-18T15:21:08.982Z",
    hostProfile: {
      operatorName: "South Café Genève GmbH",
      phone: "+41 52 685 89 07",
      locationName: "South Workspace",
      address: "Langstrasse 47",
      city: "Genève",
    },
    hostLocation: {
      category: "cafe",
      description: "Moderner Café mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://south-workspace-geneve.ch",
      instagram: "https://www.instagram.com/south-workspace-geneve",
      amenities: ["power", "wifi", "wc"],
    },
    hostSetup: {
      spots: 35,
      price: 15,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "07:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-007-image-1",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "South Workspace Bild 1",
        },
        {
          id: "seed-host-007-image-2",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "South Workspace Bild 2",
        },
        {
          id: "seed-host-007-image-3",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "South Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-007-review-1",
          author: "Marco",
          rating: 5,
          date: "15.03.2026",
          text: "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
        },
        {
          id: "seed-host-007-review-2",
          author: "Elin",
          rating: 4,
          date: "21.04.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-008",
    email: "hello@south-desk-club-aarau.ch",
    avatarUrl: null,
    createdAt: "2026-02-02T02:18:04.720Z",
    updatedAt: "2026-04-18T15:21:08.982Z",
    hostProfile: {
      operatorName: "South Restaurant Aarau GmbH",
      phone: "+41 31 536 97 08",
      locationName: "South Desk Club",
      address: "Hardstrasse 44",
      city: "Aarau",
    },
    hostLocation: {
      category: "restaurant",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://south-desk-club-aarau.ch",
      instagram: "https://www.instagram.com/south-desk-club-aarau",
      amenities: ["power", "wifi", "wc"],
    },
    hostSetup: {
      spots: 28,
      price: 22,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["thu", "fri", "sat", "sun"],
      from: "09:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-008-image-1",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "South Desk Club Bild 1",
        },
        {
          id: "seed-host-008-image-2",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "South Desk Club Bild 2",
        },
        {
          id: "seed-host-008-image-3",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "South Desk Club Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-008-review-1",
          author: "Lena",
          rating: 4,
          date: "10.01.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
        {
          id: "seed-host-008-review-2",
          author: "Sofia",
          rating: 5,
          date: "17.02.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
      ],
    },
  },

  {
    uid: "seed-host-009",
    email: "hello@vista-work-lounge-luzern.ch",
    avatarUrl: null,
    createdAt: "2025-11-30T08:11:10.515Z",
    updatedAt: "2026-04-18T15:21:08.982Z",
    hostProfile: {
      operatorName: "Vista Café Luzern GmbH",
      phone: "+41 31 487 92 09",
      locationName: "Vista Work Lounge",
      address: "Langstrasse 96",
      city: "Luzern",
    },
    hostLocation: {
      category: "cafe",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://vista-work-lounge-luzern.ch",
      instagram: "https://www.instagram.com/vista-work-lounge-luzern",
      amenities: ["laptop-zone", "power"],
    },
    hostSetup: {
      spots: 10,
      price: 12,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "10:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-009-image-1",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Work Lounge Bild 1",
        },
        {
          id: "seed-host-009-image-2",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Work Lounge Bild 2",
        },
        {
          id: "seed-host-009-image-3",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Work Lounge Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-009-review-1",
          author: "Jan",
          rating: 5,
          date: "08.02.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
      ],
    },
  },

  {
    uid: "seed-host-010",
    email: "hello@riverside-studio-desk-lausanne.ch",
    avatarUrl: null,
    createdAt: "2026-04-16T21:55:37.966Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Riverside Restaurant Lausanne GmbH",
      phone: "+41 22 656 80 10",
      locationName: "Riverside Studio Desk",
      address: "Hardstrasse 93",
      city: "Lausanne",
    },
    hostLocation: {
      category: "restaurant",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://riverside-studio-desk-lausanne.ch",
      instagram: "https://www.instagram.com/riverside-studio-desk-lausanne",
      amenities: ["wc", "wifi", "laptop-zone"],
    },
    hostSetup: {
      spots: 30,
      price: 10,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "10:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-010-image-1",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Studio Desk Bild 1",
        },
        {
          id: "seed-host-010-image-2",
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Studio Desk Bild 2",
        },
        {
          id: "seed-host-010-image-3",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Studio Desk Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-010-review-1",
          author: "Noah",
          rating: 4,
          date: "24.02.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
        {
          id: "seed-host-010-review-2",
          author: "Elin",
          rating: 4,
          date: "23.01.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
        {
          id: "seed-host-010-review-3",
          author: "Marco",
          rating: 4,
          date: "08.03.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
      ],
    },
  },

  {
    uid: "seed-host-011",
    email: "hello@north-cowork-spot-st-gallen.ch",
    avatarUrl: null,
    createdAt: "2026-01-22T08:13:53.062Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "North Lounge St. Gallen AG",
      phone: "+41 71 203 12 11",
      locationName: "North Cowork Spot",
      address: "Marktgasse 57",
      city: "St. Gallen",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://north-cowork-spot-st-gallen.ch",
      instagram: "https://www.instagram.com/north-cowork-spot-st-gallen",
      amenities: ["laptop-zone", "power"],
    },
    hostSetup: {
      spots: 14,
      price: 23,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "10:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-011-image-1",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "North Cowork Spot Bild 1",
        },
        {
          id: "seed-host-011-image-2",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "North Cowork Spot Bild 2",
        },
        {
          id: "seed-host-011-image-3",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "North Cowork Spot Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-012",
    email: "hello@urban-cowork-spot-zuerich.ch",
    avatarUrl: null,
    createdAt: "2026-01-27T11:47:41.848Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Urban Bar Zürich AG",
      phone: "+41 44 512 56 12",
      locationName: "Urban Cowork Spot",
      address: "Seefeldstrasse 88",
      city: "Zürich",
    },
    hostLocation: {
      category: "bar",
      description: "Moderner Bar mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://urban-cowork-spot-zuerich.ch",
      instagram: "https://www.instagram.com/urban-cowork-spot-zuerich",
      amenities: ["wifi", "wc", "power"],
    },
    hostSetup: {
      spots: 30,
      price: 14,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "07:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-012-image-1",
          url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Cowork Spot Bild 1",
        },
        {
          id: "seed-host-012-image-2",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Cowork Spot Bild 2",
        },
        {
          id: "seed-host-012-image-3",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Cowork Spot Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-012-review-1",
          author: "Nina",
          rating: 4,
          date: "06.02.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-013",
    email: "hello@south-desk-house-geneve.ch",
    avatarUrl: null,
    createdAt: "2025-11-15T00:12:55.299Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "South Lounge Genève AG",
      phone: "+41 41 618 84 13",
      locationName: "South Desk House",
      address: "Langstrasse 82",
      city: "Genève",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Moderner Hotel Lounge mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://south-desk-house-geneve.ch",
      instagram: "https://www.instagram.com/south-desk-house-geneve",
      amenities: ["laptop-zone", "wc"],
    },
    hostSetup: {
      spots: 20,
      price: 21,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["thu", "fri", "sat", "sun"],
      from: "10:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-013-image-1",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "South Desk House Bild 1",
        },
        {
          id: "seed-host-013-image-2",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "South Desk House Bild 2",
        },
        {
          id: "seed-host-013-image-3",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "South Desk House Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-013-review-1",
          author: "Jan",
          rating: 5,
          date: "11.04.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
        {
          id: "seed-host-013-review-2",
          author: "David",
          rating: 4,
          date: "01.03.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-014",
    email: "hello@alpine-cowork-spot-luzern.ch",
    avatarUrl: null,
    createdAt: "2026-02-09T21:34:36.628Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Alpine Restaurant Luzern GmbH",
      phone: "+41 41 928 90 14",
      locationName: "Alpine Cowork Spot",
      address: "Kramgasse 54",
      city: "Luzern",
    },
    hostLocation: {
      category: "restaurant",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://alpine-cowork-spot-luzern.ch",
      instagram: "https://www.instagram.com/alpine-cowork-spot-luzern",
      amenities: ["laptop-zone", "wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 10,
      price: 11,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "10:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-014-image-1",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Cowork Spot Bild 1",
        },
        {
          id: "seed-host-014-image-2",
          url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Cowork Spot Bild 2",
        },
        {
          id: "seed-host-014-image-3",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Cowork Spot Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-014-review-1",
          author: "Elin",
          rating: 4,
          date: "10.04.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
        {
          id: "seed-host-014-review-2",
          author: "Luca",
          rating: 5,
          date: "23.02.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
        {
          id: "seed-host-014-review-3",
          author: "Noah",
          rating: 5,
          date: "21.04.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-015",
    email: "hello@studio-work-lounge-geneve.ch",
    avatarUrl: null,
    createdAt: "2025-12-23T05:16:13.867Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Studio Genève GmbH",
      phone: "+41 44 995 99 15",
      locationName: "Studio Work Lounge",
      address: "Marktgasse 16",
      city: "Genève",
    },
    hostLocation: {
      category: "other",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://studio-work-lounge-geneve.ch",
      instagram: "https://www.instagram.com/studio-work-lounge-geneve",
      amenities: ["laptop-zone", "wc", "power", "wifi"],
    },
    hostSetup: {
      spots: 29,
      price: 27,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "07:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-015-image-1",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Work Lounge Bild 1",
        },
        {
          id: "seed-host-015-image-2",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Work Lounge Bild 2",
        },
        {
          id: "seed-host-015-image-3",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Work Lounge Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-015-review-1",
          author: "Elin",
          rating: 5,
          date: "11.04.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
        {
          id: "seed-host-015-review-2",
          author: "Noah",
          rating: 5,
          date: "22.02.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-016",
    email: "hello@lake-workspace-lausanne.ch",
    avatarUrl: null,
    createdAt: "2025-11-27T20:35:33.471Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Lake Lausanne GmbH",
      phone: "+41 71 182 53 16",
      locationName: "Lake Workspace",
      address: "Marktgasse 36",
      city: "Lausanne",
    },
    hostLocation: {
      category: "other",
      description: "Moderner Workspace mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://lake-workspace-lausanne.ch",
      instagram: "https://www.instagram.com/lake-workspace-lausanne",
      amenities: ["wifi", "power"],
    },
    hostSetup: {
      spots: 17,
      price: 25,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "08:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-016-image-1",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Workspace Bild 1",
        },
        {
          id: "seed-host-016-image-2",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Workspace Bild 2",
        },
        {
          id: "seed-host-016-image-3",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Workspace Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-017",
    email: "hello@urban-hub-space-zug.ch",
    avatarUrl: null,
    createdAt: "2025-10-29T22:10:10.541Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Urban Zug GmbH",
      phone: "+41 71 145 92 17",
      locationName: "Urban Hub Space",
      address: "Baarerstrasse 55",
      city: "Zug",
    },
    hostLocation: {
      category: "other",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://urban-hub-space-zug.ch",
      instagram: "https://www.instagram.com/urban-hub-space-zug",
      amenities: ["laptop-zone", "wc", "power"],
    },
    hostSetup: {
      spots: 30,
      price: 27,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "10:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-017-image-1",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Hub Space Bild 1",
        },
        {
          id: "seed-host-017-image-2",
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Hub Space Bild 2",
        },
        {
          id: "seed-host-017-image-3",
          url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Hub Space Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-018",
    email: "hello@vista-desk-house-basel.ch",
    avatarUrl: null,
    createdAt: "2025-11-07T09:33:26.351Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Vista Lounge Basel AG",
      phone: "+41 71 451 67 18",
      locationName: "Vista Desk House",
      address: "Baarerstrasse 89",
      city: "Basel",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://vista-desk-house-basel.ch",
      instagram: "https://www.instagram.com/vista-desk-house-basel",
      amenities: ["power", "wc", "wifi"],
    },
    hostSetup: {
      spots: 34,
      price: 30,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "10:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-018-image-1",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Desk House Bild 1",
        },
        {
          id: "seed-host-018-image-2",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Desk House Bild 2",
        },
        {
          id: "seed-host-018-image-3",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Desk House Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-018-review-1",
          author: "David",
          rating: 5,
          date: "02.03.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
      ],
    },
  },

  {
    uid: "seed-host-019",
    email: "hello@vista-hub-space-winterthur.ch",
    avatarUrl: null,
    createdAt: "2026-02-09T11:17:16.045Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Vista Winterthur GmbH",
      phone: "+41 41 535 22 19",
      locationName: "Vista Hub Space",
      address: "Clarastrasse 2",
      city: "Winterthur",
    },
    hostLocation: {
      category: "other",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://vista-hub-space-winterthur.ch",
      instagram: "https://www.instagram.com/vista-hub-space-winterthur",
      amenities: ["wifi", "laptop-zone", "power", "wc"],
    },
    hostSetup: {
      spots: 25,
      price: 11,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-019-image-1",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Hub Space Bild 1",
        },
        {
          id: "seed-host-019-image-2",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Hub Space Bild 2",
        },
        {
          id: "seed-host-019-image-3",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Hub Space Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-019-review-1",
          author: "Elin",
          rating: 5,
          date: "20.01.2026",
          text: "Stylisch, sauber und super für ein paar produktive Stunden.",
        },
        {
          id: "seed-host-019-review-2",
          author: "Noah",
          rating: 5,
          date: "28.02.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-020",
    email: "hello@studio-studio-desk-lugano.ch",
    avatarUrl: null,
    createdAt: "2026-02-17T20:58:56.747Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Studio Lounge Lugano AG",
      phone: "+41 52 671 27 20",
      locationName: "Studio Studio Desk",
      address: "Baarerstrasse 4",
      city: "Lugano",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://studio-studio-desk-lugano.ch",
      instagram: "https://www.instagram.com/studio-studio-desk-lugano",
      amenities: ["power", "wifi", "wc"],
    },
    hostSetup: {
      spots: 20,
      price: 19,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-020-image-1",
          url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Studio Desk Bild 1",
        },
        {
          id: "seed-host-020-image-2",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Studio Desk Bild 2",
        },
        {
          id: "seed-host-020-image-3",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Studio Desk Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-020-review-1",
          author: "Lena",
          rating: 5,
          date: "21.04.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
        {
          id: "seed-host-020-review-2",
          author: "Lena",
          rating: 5,
          date: "27.02.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
      ],
    },
  },

  {
    uid: "seed-host-021",
    email: "hello@pulse-studio-desk-st-gallen.ch",
    avatarUrl: null,
    createdAt: "2026-02-11T04:49:21.198Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Pulse Bar St. Gallen AG",
      phone: "+41 21 917 20 21",
      locationName: "Pulse Studio Desk",
      address: "Spitalgasse 35",
      city: "St. Gallen",
    },
    hostLocation: {
      category: "bar",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://pulse-studio-desk-st-gallen.ch",
      instagram: "https://www.instagram.com/pulse-studio-desk-st-gallen",
      amenities: ["laptop-zone", "wc"],
    },
    hostSetup: {
      spots: 16,
      price: 18,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "07:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-021-image-1",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Pulse Studio Desk Bild 1",
        },
        {
          id: "seed-host-021-image-2",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Pulse Studio Desk Bild 2",
        },
        {
          id: "seed-host-021-image-3",
          url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
          alt: "Pulse Studio Desk Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-021-review-1",
          author: "Nina",
          rating: 5,
          date: "13.01.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
        {
          id: "seed-host-021-review-2",
          author: "Elin",
          rating: 5,
          date: "03.02.2026",
          text: "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
        },
        {
          id: "seed-host-021-review-3",
          author: "Jan",
          rating: 4,
          date: "26.03.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
      ],
    },
  },

  {
    uid: "seed-host-022",
    email: "hello@pulse-desk-club-winterthur.ch",
    avatarUrl: null,
    createdAt: "2026-02-25T12:01:15.501Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Pulse Café Winterthur GmbH",
      phone: "+41 52 560 30 22",
      locationName: "Pulse Desk Club",
      address: "Hardstrasse 108",
      city: "Winterthur",
    },
    hostLocation: {
      category: "cafe",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://pulse-desk-club-winterthur.ch",
      instagram: "https://www.instagram.com/pulse-desk-club-winterthur",
      amenities: ["wifi", "power", "laptop-zone", "wc"],
    },
    hostSetup: {
      spots: 16,
      price: 16,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-022-image-1",
          url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
          alt: "Pulse Desk Club Bild 1",
        },
        {
          id: "seed-host-022-image-2",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Pulse Desk Club Bild 2",
        },
        {
          id: "seed-host-022-image-3",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Pulse Desk Club Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-022-review-1",
          author: "Sofia",
          rating: 5,
          date: "07.03.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
        {
          id: "seed-host-022-review-2",
          author: "Sofia",
          rating: 4,
          date: "28.04.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
      ],
    },
  },

  {
    uid: "seed-host-023",
    email: "hello@south-office-lounge-winterthur.ch",
    avatarUrl: null,
    createdAt: "2026-01-21T14:33:29.253Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "South Lounge Winterthur AG",
      phone: "+41 21 141 91 23",
      locationName: "South Office Lounge",
      address: "Clarastrasse 25",
      city: "Winterthur",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://south-office-lounge-winterthur.ch",
      instagram: "https://www.instagram.com/south-office-lounge-winterthur",
      amenities: ["laptop-zone", "wifi", "wc", "power"],
    },
    hostSetup: {
      spots: 24,
      price: 12,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "07:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-023-image-1",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "South Office Lounge Bild 1",
        },
        {
          id: "seed-host-023-image-2",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "South Office Lounge Bild 2",
        },
        {
          id: "seed-host-023-image-3",
          url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
          alt: "South Office Lounge Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-023-review-1",
          author: "Jan",
          rating: 5,
          date: "11.01.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
        {
          id: "seed-host-023-review-2",
          author: "Luca",
          rating: 5,
          date: "13.04.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
      ],
    },
  },

  {
    uid: "seed-host-024",
    email: "hello@studio-cowork-spot-basel.ch",
    avatarUrl: null,
    createdAt: "2026-02-18T16:39:38.441Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Studio Basel GmbH",
      phone: "+41 41 979 80 24",
      locationName: "Studio Cowork Spot",
      address: "Pilatusstrasse 57",
      city: "Basel",
    },
    hostLocation: {
      category: "other",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://studio-cowork-spot-basel.ch",
      instagram: "https://www.instagram.com/studio-cowork-spot-basel",
      amenities: ["power", "laptop-zone"],
    },
    hostSetup: {
      spots: 6,
      price: 14,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "07:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-024-image-1",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Cowork Spot Bild 1",
        },
        {
          id: "seed-host-024-image-2",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Cowork Spot Bild 2",
        },
        {
          id: "seed-host-024-image-3",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Cowork Spot Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-025",
    email: "hello@loft-desk-club-basel.ch",
    avatarUrl: null,
    createdAt: "2026-03-12T16:45:13.637Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Loft Restaurant Basel GmbH",
      phone: "+41 31 697 43 25",
      locationName: "Loft Desk Club",
      address: "Spitalgasse 74",
      city: "Basel",
    },
    hostLocation: {
      category: "restaurant",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://loft-desk-club-basel.ch",
      instagram: "https://www.instagram.com/loft-desk-club-basel",
      amenities: ["laptop-zone", "power"],
    },
    hostSetup: {
      spots: 27,
      price: 28,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-025-image-1",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Desk Club Bild 1",
        },
        {
          id: "seed-host-025-image-2",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Desk Club Bild 2",
        },
        {
          id: "seed-host-025-image-3",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Desk Club Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-025-review-1",
          author: "Mila",
          rating: 5,
          date: "06.02.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
      ],
    },
  },

  {
    uid: "seed-host-026",
    email: "hello@metro-hub-space-st-gallen.ch",
    avatarUrl: null,
    createdAt: "2026-03-31T19:06:51.123Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Metro St. Gallen GmbH",
      phone: "+41 91 186 65 26",
      locationName: "Metro Hub Space",
      address: "Rue du Rhône 90",
      city: "St. Gallen",
    },
    hostLocation: {
      category: "other",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://metro-hub-space-st-gallen.ch",
      instagram: "https://www.instagram.com/metro-hub-space-st-gallen",
      amenities: ["wc", "laptop-zone", "power", "wifi"],
    },
    hostSetup: {
      spots: 6,
      price: 27,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "08:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-026-image-1",
          url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Hub Space Bild 1",
        },
        {
          id: "seed-host-026-image-2",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Hub Space Bild 2",
        },
        {
          id: "seed-host-026-image-3",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Hub Space Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-026-review-1",
          author: "Elin",
          rating: 4,
          date: "11.04.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
        {
          id: "seed-host-026-review-2",
          author: "Sara",
          rating: 5,
          date: "26.02.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
        {
          id: "seed-host-026-review-3",
          author: "David",
          rating: 4,
          date: "10.02.2026",
          text: "Stylisch, sauber und super für ein paar produktive Stunden.",
        },
      ],
    },
  },

  {
    uid: "seed-host-027",
    email: "hello@south-studio-desk-geneve.ch",
    avatarUrl: null,
    createdAt: "2026-03-09T03:31:35.815Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "South Genève GmbH",
      phone: "+41 41 732 71 27",
      locationName: "South Studio Desk",
      address: "Josefstrasse 61",
      city: "Genève",
    },
    hostLocation: {
      category: "other",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://south-studio-desk-geneve.ch",
      instagram: "https://www.instagram.com/south-studio-desk-geneve",
      amenities: ["wc", "wifi", "power"],
    },
    hostSetup: {
      spots: 27,
      price: 15,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "07:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-027-image-1",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "South Studio Desk Bild 1",
        },
        {
          id: "seed-host-027-image-2",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "South Studio Desk Bild 2",
        },
        {
          id: "seed-host-027-image-3",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "South Studio Desk Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-027-review-1",
          author: "David",
          rating: 4,
          date: "25.04.2026",
          text: "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
        },
      ],
    },
  },

  {
    uid: "seed-host-028",
    email: "hello@pulse-hub-space-bern.ch",
    avatarUrl: null,
    createdAt: "2025-12-06T09:30:17.223Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Pulse Café Bern GmbH",
      phone: "+41 71 832 18 28",
      locationName: "Pulse Hub Space",
      address: "Kramgasse 93",
      city: "Bern",
    },
    hostLocation: {
      category: "cafe",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://pulse-hub-space-bern.ch",
      instagram: "https://www.instagram.com/pulse-hub-space-bern",
      amenities: ["laptop-zone", "wc"],
    },
    hostSetup: {
      spots: 16,
      price: 25,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "07:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-028-image-1",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Pulse Hub Space Bild 1",
        },
        {
          id: "seed-host-028-image-2",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Pulse Hub Space Bild 2",
        },
        {
          id: "seed-host-028-image-3",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Pulse Hub Space Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-028-review-1",
          author: "Sara",
          rating: 5,
          date: "12.04.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
        {
          id: "seed-host-028-review-2",
          author: "Jan",
          rating: 4,
          date: "07.04.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
      ],
    },
  },

  {
    uid: "seed-host-029",
    email: "hello@south-lab-workspace-lausanne.ch",
    avatarUrl: null,
    createdAt: "2026-02-26T13:34:23.212Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "South Lounge Lausanne AG",
      phone: "+41 41 111 70 29",
      locationName: "South Lab Workspace",
      address: "Spitalgasse 103",
      city: "Lausanne",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://south-lab-workspace-lausanne.ch",
      instagram: "https://www.instagram.com/south-lab-workspace-lausanne",
      amenities: ["laptop-zone", "power", "wc"],
    },
    hostSetup: {
      spots: 29,
      price: 16,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-029-image-1",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "South Lab Workspace Bild 1",
        },
        {
          id: "seed-host-029-image-2",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "South Lab Workspace Bild 2",
        },
        {
          id: "seed-host-029-image-3",
          url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
          alt: "South Lab Workspace Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-030",
    email: "hello@metro-studio-desk-zuerich.ch",
    avatarUrl: null,
    createdAt: "2026-04-06T20:08:24.624Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Metro Restaurant Zürich GmbH",
      phone: "+41 61 399 55 30",
      locationName: "Metro Studio Desk",
      address: "Marktgasse 12",
      city: "Zürich",
    },
    hostLocation: {
      category: "restaurant",
      description: "Moderner Restaurant mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://metro-studio-desk-zuerich.ch",
      instagram: "https://www.instagram.com/metro-studio-desk-zuerich",
      amenities: ["power", "wifi", "wc", "laptop-zone"],
    },
    hostSetup: {
      spots: 7,
      price: 32,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "07:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-030-image-1",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Studio Desk Bild 1",
        },
        {
          id: "seed-host-030-image-2",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Studio Desk Bild 2",
        },
        {
          id: "seed-host-030-image-3",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Studio Desk Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-030-review-1",
          author: "David",
          rating: 5,
          date: "02.03.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
      ],
    },
  },

  {
    uid: "seed-host-031",
    email: "hello@north-studio-desk-st-gallen.ch",
    avatarUrl: null,
    createdAt: "2025-10-29T20:00:13.894Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "North Lounge St. Gallen AG",
      phone: "+41 91 376 10 31",
      locationName: "North Studio Desk",
      address: "Kramgasse 85",
      city: "St. Gallen",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Moderner Hotel Lounge mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://north-studio-desk-st-gallen.ch",
      instagram: "https://www.instagram.com/north-studio-desk-st-gallen",
      amenities: ["power", "wifi", "wc", "laptop-zone"],
    },
    hostSetup: {
      spots: 33,
      price: 13,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "07:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-031-image-1",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "North Studio Desk Bild 1",
        },
        {
          id: "seed-host-031-image-2",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "North Studio Desk Bild 2",
        },
        {
          id: "seed-host-031-image-3",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "North Studio Desk Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-032",
    email: "hello@riverside-lab-workspace-geneve.ch",
    avatarUrl: null,
    createdAt: "2026-03-03T10:30:38.704Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Riverside Bar Genève AG",
      phone: "+41 21 585 63 32",
      locationName: "Riverside Lab Workspace",
      address: "Josefstrasse 112",
      city: "Genève",
    },
    hostLocation: {
      category: "bar",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://riverside-lab-workspace-geneve.ch",
      instagram: "https://www.instagram.com/riverside-lab-workspace-geneve",
      amenities: ["power", "laptop-zone"],
    },
    hostSetup: {
      spots: 22,
      price: 31,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "09:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-032-image-1",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Lab Workspace Bild 1",
        },
        {
          id: "seed-host-032-image-2",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Lab Workspace Bild 2",
        },
        {
          id: "seed-host-032-image-3",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Lab Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-032-review-1",
          author: "Lena",
          rating: 4,
          date: "22.01.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
        {
          id: "seed-host-032-review-2",
          author: "Luca",
          rating: 5,
          date: "28.04.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
        {
          id: "seed-host-032-review-3",
          author: "Noah",
          rating: 5,
          date: "25.03.2026",
          text: "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
        },
      ],
    },
  },

  {
    uid: "seed-host-033",
    email: "hello@loft-desk-club-winterthur.ch",
    avatarUrl: null,
    createdAt: "2025-11-18T11:03:48.723Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Loft Lounge Winterthur AG",
      phone: "+41 61 296 52 33",
      locationName: "Loft Desk Club",
      address: "Langstrasse 69",
      city: "Winterthur",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://loft-desk-club-winterthur.ch",
      instagram: "https://www.instagram.com/loft-desk-club-winterthur",
      amenities: ["power", "wifi", "wc"],
    },
    hostSetup: {
      spots: 29,
      price: 14,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-033-image-1",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Desk Club Bild 1",
        },
        {
          id: "seed-host-033-image-2",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Desk Club Bild 2",
        },
        {
          id: "seed-host-033-image-3",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Desk Club Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-033-review-1",
          author: "Luca",
          rating: 5,
          date: "27.03.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
        {
          id: "seed-host-033-review-2",
          author: "Tom",
          rating: 4,
          date: "17.02.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
        {
          id: "seed-host-033-review-3",
          author: "Luca",
          rating: 5,
          date: "09.04.2026",
          text: "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
        },
      ],
    },
  },

  {
    uid: "seed-host-034",
    email: "hello@urban-desk-house-bern.ch",
    avatarUrl: null,
    createdAt: "2026-04-08T11:42:10.882Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Urban Restaurant Bern GmbH",
      phone: "+41 22 316 11 34",
      locationName: "Urban Desk House",
      address: "Hardstrasse 43",
      city: "Bern",
    },
    hostLocation: {
      category: "restaurant",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://urban-desk-house-bern.ch",
      instagram: "https://www.instagram.com/urban-desk-house-bern",
      amenities: ["wc", "wifi", "laptop-zone", "power"],
    },
    hostSetup: {
      spots: 7,
      price: 10,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "08:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-034-image-1",
          url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Desk House Bild 1",
        },
        {
          id: "seed-host-034-image-2",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Desk House Bild 2",
        },
        {
          id: "seed-host-034-image-3",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Desk House Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-035",
    email: "hello@south-workspace-lausanne.ch",
    avatarUrl: null,
    createdAt: "2026-01-08T17:24:37.476Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "South Lounge Lausanne AG",
      phone: "+41 52 433 32 35",
      locationName: "South Workspace",
      address: "Langstrasse 33",
      city: "Lausanne",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://south-workspace-lausanne.ch",
      instagram: "https://www.instagram.com/south-workspace-lausanne",
      amenities: ["laptop-zone", "wifi"],
    },
    hostSetup: {
      spots: 11,
      price: 20,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-035-image-1",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "South Workspace Bild 1",
        },
        {
          id: "seed-host-035-image-2",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "South Workspace Bild 2",
        },
        {
          id: "seed-host-035-image-3",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "South Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-035-review-1",
          author: "Lena",
          rating: 4,
          date: "11.03.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-036",
    email: "hello@metro-cowork-spot-zug.ch",
    avatarUrl: null,
    createdAt: "2025-11-06T02:14:33.704Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Metro Café Zug GmbH",
      phone: "+41 41 139 33 36",
      locationName: "Metro Cowork Spot",
      address: "Seefeldstrasse 105",
      city: "Zug",
    },
    hostLocation: {
      category: "cafe",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://metro-cowork-spot-zug.ch",
      instagram: "https://www.instagram.com/metro-cowork-spot-zug",
      amenities: ["power", "wifi", "laptop-zone"],
    },
    hostSetup: {
      spots: 34,
      price: 14,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "07:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-036-image-1",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Cowork Spot Bild 1",
        },
        {
          id: "seed-host-036-image-2",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Cowork Spot Bild 2",
        },
        {
          id: "seed-host-036-image-3",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Cowork Spot Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-037",
    email: "hello@riverside-workspace-bern.ch",
    avatarUrl: null,
    createdAt: "2025-10-22T11:45:03.077Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Riverside Bar Bern AG",
      phone: "+41 44 790 29 37",
      locationName: "Riverside Workspace",
      address: "Bahnhofstrasse 106",
      city: "Bern",
    },
    hostLocation: {
      category: "bar",
      description: "Moderner Bar mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://riverside-workspace-bern.ch",
      instagram: "https://www.instagram.com/riverside-workspace-bern",
      amenities: ["wc", "wifi", "power"],
    },
    hostSetup: {
      spots: 18,
      price: 25,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "07:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-037-image-1",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Workspace Bild 1",
        },
        {
          id: "seed-host-037-image-2",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Workspace Bild 2",
        },
        {
          id: "seed-host-037-image-3",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Workspace Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-038",
    email: "hello@vista-cowork-spot-winterthur.ch",
    avatarUrl: null,
    createdAt: "2026-02-10T10:28:18.547Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Vista Restaurant Winterthur GmbH",
      phone: "+41 22 237 20 38",
      locationName: "Vista Cowork Spot",
      address: "Langstrasse 67",
      city: "Winterthur",
    },
    hostLocation: {
      category: "restaurant",
      description: "Moderner Restaurant mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://vista-cowork-spot-winterthur.ch",
      instagram: "https://www.instagram.com/vista-cowork-spot-winterthur",
      amenities: ["wifi", "laptop-zone", "wc"],
    },
    hostSetup: {
      spots: 17,
      price: 17,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "07:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-038-image-1",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Cowork Spot Bild 1",
        },
        {
          id: "seed-host-038-image-2",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Cowork Spot Bild 2",
        },
        {
          id: "seed-host-038-image-3",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Cowork Spot Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-038-review-1",
          author: "Sara",
          rating: 5,
          date: "28.04.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
      ],
    },
  },

  {
    uid: "seed-host-039",
    email: "hello@urban-desk-house-winterthur.ch",
    avatarUrl: null,
    createdAt: "2026-04-16T16:04:00.983Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Urban Restaurant Winterthur GmbH",
      phone: "+41 21 968 75 39",
      locationName: "Urban Desk House",
      address: "Rue du Rhône 96",
      city: "Winterthur",
    },
    hostLocation: {
      category: "restaurant",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://urban-desk-house-winterthur.ch",
      instagram: "https://www.instagram.com/urban-desk-house-winterthur",
      amenities: ["wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 8,
      price: 25,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-039-image-1",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Desk House Bild 1",
        },
        {
          id: "seed-host-039-image-2",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Desk House Bild 2",
        },
        {
          id: "seed-host-039-image-3",
          url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Desk House Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-039-review-1",
          author: "Marco",
          rating: 5,
          date: "24.04.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-040",
    email: "hello@dock-workspace-aarau.ch",
    avatarUrl: null,
    createdAt: "2026-02-12T09:50:06.883Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Dock Café Aarau GmbH",
      phone: "+41 61 967 31 40",
      locationName: "Dock Workspace",
      address: "Spitalgasse 120",
      city: "Aarau",
    },
    hostLocation: {
      category: "cafe",
      description: "Moderner Café mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://dock-workspace-aarau.ch",
      instagram: "https://www.instagram.com/dock-workspace-aarau",
      amenities: ["wifi", "power"],
    },
    hostSetup: {
      spots: 36,
      price: 32,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "10:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-040-image-1",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Workspace Bild 1",
        },
        {
          id: "seed-host-040-image-2",
          url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Workspace Bild 2",
        },
        {
          id: "seed-host-040-image-3",
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-040-review-1",
          author: "Lena",
          rating: 5,
          date: "19.01.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
      ],
    },
  },

  {
    uid: "seed-host-041",
    email: "hello@metro-workspace-bern.ch",
    avatarUrl: null,
    createdAt: "2026-01-16T13:13:55.044Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Metro Café Bern GmbH",
      phone: "+41 21 235 79 41",
      locationName: "Metro Workspace",
      address: "Clarastrasse 18",
      city: "Bern",
    },
    hostLocation: {
      category: "cafe",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://metro-workspace-bern.ch",
      instagram: "https://www.instagram.com/metro-workspace-bern",
      amenities: ["power", "wc", "laptop-zone"],
    },
    hostSetup: {
      spots: 30,
      price: 23,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-041-image-1",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Workspace Bild 1",
        },
        {
          id: "seed-host-041-image-2",
          url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Workspace Bild 2",
        },
        {
          id: "seed-host-041-image-3",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-041-review-1",
          author: "Sofia",
          rating: 5,
          date: "06.01.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
        {
          id: "seed-host-041-review-2",
          author: "Tom",
          rating: 5,
          date: "26.01.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-042",
    email: "hello@alpine-cowork-spot-luzern.ch",
    avatarUrl: null,
    createdAt: "2025-12-28T05:47:34.730Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Alpine Lounge Luzern AG",
      phone: "+41 31 887 71 42",
      locationName: "Alpine Cowork Spot",
      address: "Bahnhofstrasse 21",
      city: "Luzern",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://alpine-cowork-spot-luzern.ch",
      instagram: "https://www.instagram.com/alpine-cowork-spot-luzern",
      amenities: ["wc", "wifi", "laptop-zone"],
    },
    hostSetup: {
      spots: 12,
      price: 25,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-042-image-1",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Cowork Spot Bild 1",
        },
        {
          id: "seed-host-042-image-2",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Cowork Spot Bild 2",
        },
        {
          id: "seed-host-042-image-3",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Cowork Spot Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-042-review-1",
          author: "Noah",
          rating: 5,
          date: "24.04.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
        {
          id: "seed-host-042-review-2",
          author: "Luca",
          rating: 5,
          date: "02.03.2026",
          text: "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
        },
      ],
    },
  },

  {
    uid: "seed-host-043",
    email: "hello@lake-studio-desk-zuerich.ch",
    avatarUrl: null,
    createdAt: "2025-11-08T14:40:21.062Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Lake Café Zürich GmbH",
      phone: "+41 22 936 31 43",
      locationName: "Lake Studio Desk",
      address: "Langstrasse 119",
      city: "Zürich",
    },
    hostLocation: {
      category: "cafe",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://lake-studio-desk-zuerich.ch",
      instagram: "https://www.instagram.com/lake-studio-desk-zuerich",
      amenities: ["laptop-zone", "wifi", "wc", "power"],
    },
    hostSetup: {
      spots: 31,
      price: 22,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-043-image-1",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Studio Desk Bild 1",
        },
        {
          id: "seed-host-043-image-2",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Studio Desk Bild 2",
        },
        {
          id: "seed-host-043-image-3",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Studio Desk Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-043-review-1",
          author: "Jan",
          rating: 5,
          date: "04.02.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
      ],
    },
  },

  {
    uid: "seed-host-044",
    email: "hello@loft-dayspace-zug.ch",
    avatarUrl: null,
    createdAt: "2025-12-15T14:42:57.647Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Loft Zug GmbH",
      phone: "+41 41 285 45 44",
      locationName: "Loft Dayspace",
      address: "Spitalgasse 101",
      city: "Zug",
    },
    hostLocation: {
      category: "other",
      description: "Moderner Workspace mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://loft-dayspace-zug.ch",
      instagram: "https://www.instagram.com/loft-dayspace-zug",
      amenities: ["laptop-zone", "power"],
    },
    hostSetup: {
      spots: 20,
      price: 10,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-044-image-1",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Dayspace Bild 1",
        },
        {
          id: "seed-host-044-image-2",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Dayspace Bild 2",
        },
        {
          id: "seed-host-044-image-3",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Dayspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-044-review-1",
          author: "David",
          rating: 5,
          date: "06.03.2026",
          text: "Stylisch, sauber und super für ein paar produktive Stunden.",
        },
        {
          id: "seed-host-044-review-2",
          author: "Nina",
          rating: 5,
          date: "04.01.2026",
          text: "Stylisch, sauber und super für ein paar produktive Stunden.",
        },
      ],
    },
  },

  {
    uid: "seed-host-045",
    email: "hello@dock-desk-club-lugano.ch",
    avatarUrl: null,
    createdAt: "2025-11-10T22:31:11.906Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Dock Lounge Lugano AG",
      phone: "+41 41 255 45 45",
      locationName: "Dock Desk Club",
      address: "Bahnhofstrasse 63",
      city: "Lugano",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://dock-desk-club-lugano.ch",
      instagram: "https://www.instagram.com/dock-desk-club-lugano",
      amenities: ["power", "wifi"],
    },
    hostSetup: {
      spots: 27,
      price: 28,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-045-image-1",
          url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Desk Club Bild 1",
        },
        {
          id: "seed-host-045-image-2",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Desk Club Bild 2",
        },
        {
          id: "seed-host-045-image-3",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Desk Club Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-046",
    email: "hello@alpine-dayspace-zuerich.ch",
    avatarUrl: null,
    createdAt: "2025-12-20T10:16:09.645Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Alpine Bar Zürich AG",
      phone: "+41 41 242 47 46",
      locationName: "Alpine Dayspace",
      address: "Clarastrasse 115",
      city: "Zürich",
    },
    hostLocation: {
      category: "bar",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://alpine-dayspace-zuerich.ch",
      instagram: "https://www.instagram.com/alpine-dayspace-zuerich",
      amenities: ["laptop-zone", "wc", "wifi", "power"],
    },
    hostSetup: {
      spots: 29,
      price: 20,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "07:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-046-image-1",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Dayspace Bild 1",
        },
        {
          id: "seed-host-046-image-2",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Dayspace Bild 2",
        },
        {
          id: "seed-host-046-image-3",
          url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Dayspace Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-047",
    email: "hello@studio-hub-space-luzern.ch",
    avatarUrl: null,
    createdAt: "2025-10-28T19:58:07.408Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Studio Café Luzern GmbH",
      phone: "+41 61 271 65 47",
      locationName: "Studio Hub Space",
      address: "Pilatusstrasse 89",
      city: "Luzern",
    },
    hostLocation: {
      category: "cafe",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://studio-hub-space-luzern.ch",
      instagram: "https://www.instagram.com/studio-hub-space-luzern",
      amenities: ["wc", "laptop-zone", "wifi", "power"],
    },
    hostSetup: {
      spots: 21,
      price: 11,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "07:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-047-image-1",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Hub Space Bild 1",
        },
        {
          id: "seed-host-047-image-2",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Hub Space Bild 2",
        },
        {
          id: "seed-host-047-image-3",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Hub Space Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-047-review-1",
          author: "Mila",
          rating: 5,
          date: "22.04.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
        {
          id: "seed-host-047-review-2",
          author: "Tom",
          rating: 4,
          date: "05.04.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
        {
          id: "seed-host-047-review-3",
          author: "Sara",
          rating: 5,
          date: "13.02.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-048",
    email: "hello@metro-office-lounge-st-gallen.ch",
    avatarUrl: null,
    createdAt: "2026-02-23T04:55:39.654Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Metro St. Gallen GmbH",
      phone: "+41 22 258 13 48",
      locationName: "Metro Office Lounge",
      address: "Kramgasse 33",
      city: "St. Gallen",
    },
    hostLocation: {
      category: "other",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://metro-office-lounge-st-gallen.ch",
      instagram: "https://www.instagram.com/metro-office-lounge-st-gallen",
      amenities: ["wifi", "wc", "laptop-zone", "power"],
    },
    hostSetup: {
      spots: 30,
      price: 28,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["thu", "fri", "sat", "sun"],
      from: "10:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-048-image-1",
          url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Office Lounge Bild 1",
        },
        {
          id: "seed-host-048-image-2",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Office Lounge Bild 2",
        },
        {
          id: "seed-host-048-image-3",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Office Lounge Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-049",
    email: "hello@studio-desk-club-zuerich.ch",
    avatarUrl: null,
    createdAt: "2026-01-12T04:56:27.576Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Studio Bar Zürich AG",
      phone: "+41 61 815 36 49",
      locationName: "Studio Desk Club",
      address: "Kramgasse 120",
      city: "Zürich",
    },
    hostLocation: {
      category: "bar",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://studio-desk-club-zuerich.ch",
      instagram: "https://www.instagram.com/studio-desk-club-zuerich",
      amenities: ["power", "wifi"],
    },
    hostSetup: {
      spots: 31,
      price: 21,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "09:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-049-image-1",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Desk Club Bild 1",
        },
        {
          id: "seed-host-049-image-2",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Desk Club Bild 2",
        },
        {
          id: "seed-host-049-image-3",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Desk Club Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-049-review-1",
          author: "David",
          rating: 4,
          date: "15.02.2026",
          text: "Stylisch, sauber und super für ein paar produktive Stunden.",
        },
        {
          id: "seed-host-049-review-2",
          author: "Noah",
          rating: 5,
          date: "10.02.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
        {
          id: "seed-host-049-review-3",
          author: "David",
          rating: 4,
          date: "04.03.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
      ],
    },
  },

  {
    uid: "seed-host-050",
    email: "hello@alpine-workspace-zug.ch",
    avatarUrl: null,
    createdAt: "2025-11-18T16:04:12.779Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Alpine Restaurant Zug GmbH",
      phone: "+41 91 111 18 50",
      locationName: "Alpine Workspace",
      address: "Langstrasse 17",
      city: "Zug",
    },
    hostLocation: {
      category: "restaurant",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://alpine-workspace-zug.ch",
      instagram: "https://www.instagram.com/alpine-workspace-zug",
      amenities: ["power", "wc"],
    },
    hostSetup: {
      spots: 31,
      price: 8,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-050-image-1",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Workspace Bild 1",
        },
        {
          id: "seed-host-050-image-2",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Workspace Bild 2",
        },
        {
          id: "seed-host-050-image-3",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Workspace Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-051",
    email: "hello@metro-studio-desk-luzern.ch",
    avatarUrl: null,
    createdAt: "2025-10-18T18:59:41.140Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Metro Bar Luzern AG",
      phone: "+41 61 670 30 51",
      locationName: "Metro Studio Desk",
      address: "Rue du Rhône 14",
      city: "Luzern",
    },
    hostLocation: {
      category: "bar",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://metro-studio-desk-luzern.ch",
      instagram: "https://www.instagram.com/metro-studio-desk-luzern",
      amenities: ["laptop-zone", "wc", "power", "wifi"],
    },
    hostSetup: {
      spots: 19,
      price: 27,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-051-image-1",
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Studio Desk Bild 1",
        },
        {
          id: "seed-host-051-image-2",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Studio Desk Bild 2",
        },
        {
          id: "seed-host-051-image-3",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Studio Desk Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-051-review-1",
          author: "Sofia",
          rating: 5,
          date: "06.04.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
        {
          id: "seed-host-051-review-2",
          author: "Nina",
          rating: 4,
          date: "22.02.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-052",
    email: "hello@metro-desk-house-bern.ch",
    avatarUrl: null,
    createdAt: "2026-02-12T04:51:55.629Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Metro Bar Bern AG",
      phone: "+41 31 682 73 52",
      locationName: "Metro Desk House",
      address: "Spitalgasse 61",
      city: "Bern",
    },
    hostLocation: {
      category: "bar",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://metro-desk-house-bern.ch",
      instagram: "https://www.instagram.com/metro-desk-house-bern",
      amenities: ["wc", "wifi", "laptop-zone"],
    },
    hostSetup: {
      spots: 10,
      price: 31,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "08:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-052-image-1",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Desk House Bild 1",
        },
        {
          id: "seed-host-052-image-2",
          url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Desk House Bild 2",
        },
        {
          id: "seed-host-052-image-3",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Desk House Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-052-review-1",
          author: "Marco",
          rating: 5,
          date: "05.04.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-053",
    email: "hello@riverside-hub-space-aarau.ch",
    avatarUrl: null,
    createdAt: "2025-11-13T11:02:31.410Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Riverside Lounge Aarau AG",
      phone: "+41 44 570 75 53",
      locationName: "Riverside Hub Space",
      address: "Baarerstrasse 63",
      city: "Aarau",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://riverside-hub-space-aarau.ch",
      instagram: "https://www.instagram.com/riverside-hub-space-aarau",
      amenities: ["wc", "laptop-zone", "wifi"],
    },
    hostSetup: {
      spots: 26,
      price: 12,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-053-image-1",
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Hub Space Bild 1",
        },
        {
          id: "seed-host-053-image-2",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Hub Space Bild 2",
        },
        {
          id: "seed-host-053-image-3",
          url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Hub Space Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-054",
    email: "hello@alpine-office-lounge-geneve.ch",
    avatarUrl: null,
    createdAt: "2026-03-12T23:17:26.241Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Alpine Café Genève GmbH",
      phone: "+41 52 152 21 54",
      locationName: "Alpine Office Lounge",
      address: "Pilatusstrasse 49",
      city: "Genève",
    },
    hostLocation: {
      category: "cafe",
      description: "Moderner Café mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://alpine-office-lounge-geneve.ch",
      instagram: "https://www.instagram.com/alpine-office-lounge-geneve",
      amenities: ["wifi", "laptop-zone"],
    },
    hostSetup: {
      spots: 9,
      price: 16,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-054-image-1",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Office Lounge Bild 1",
        },
        {
          id: "seed-host-054-image-2",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Office Lounge Bild 2",
        },
        {
          id: "seed-host-054-image-3",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Office Lounge Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-054-review-1",
          author: "Sofia",
          rating: 5,
          date: "11.01.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
      ],
    },
  },

  {
    uid: "seed-host-055",
    email: "hello@lake-desk-house-bern.ch",
    avatarUrl: null,
    createdAt: "2026-01-06T06:08:07.056Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Lake Bern GmbH",
      phone: "+41 21 510 45 55",
      locationName: "Lake Desk House",
      address: "Langstrasse 25",
      city: "Bern",
    },
    hostLocation: {
      category: "other",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://lake-desk-house-bern.ch",
      instagram: "https://www.instagram.com/lake-desk-house-bern",
      amenities: ["wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 36,
      price: 11,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-055-image-1",
          url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Desk House Bild 1",
        },
        {
          id: "seed-host-055-image-2",
          url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Desk House Bild 2",
        },
        {
          id: "seed-host-055-image-3",
          url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Desk House Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-055-review-1",
          author: "Marco",
          rating: 5,
          date: "02.03.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
        {
          id: "seed-host-055-review-2",
          author: "Elin",
          rating: 4,
          date: "17.04.2026",
          text: "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
        },
      ],
    },
  },

  {
    uid: "seed-host-056",
    email: "hello@urban-dayspace-geneve.ch",
    avatarUrl: null,
    createdAt: "2025-10-31T08:21:34.101Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Urban Café Genève GmbH",
      phone: "+41 91 791 94 56",
      locationName: "Urban Dayspace",
      address: "Rue du Rhône 89",
      city: "Genève",
    },
    hostLocation: {
      category: "cafe",
      description: "Moderner Café mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://urban-dayspace-geneve.ch",
      instagram: "https://www.instagram.com/urban-dayspace-geneve",
      amenities: ["wifi", "wc"],
    },
    hostSetup: {
      spots: 23,
      price: 15,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "10:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-056-image-1",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Dayspace Bild 1",
        },
        {
          id: "seed-host-056-image-2",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Dayspace Bild 2",
        },
        {
          id: "seed-host-056-image-3",
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Dayspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-056-review-1",
          author: "Sara",
          rating: 4,
          date: "21.01.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
        {
          id: "seed-host-056-review-2",
          author: "David",
          rating: 5,
          date: "16.02.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
        {
          id: "seed-host-056-review-3",
          author: "Tom",
          rating: 5,
          date: "10.02.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
      ],
    },
  },

  {
    uid: "seed-host-057",
    email: "hello@metro-work-lounge-aarau.ch",
    avatarUrl: null,
    createdAt: "2025-11-26T17:20:55.886Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Metro Bar Aarau AG",
      phone: "+41 71 281 40 57",
      locationName: "Metro Work Lounge",
      address: "Pilatusstrasse 57",
      city: "Aarau",
    },
    hostLocation: {
      category: "bar",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://metro-work-lounge-aarau.ch",
      instagram: "https://www.instagram.com/metro-work-lounge-aarau",
      amenities: ["wc", "wifi"],
    },
    hostSetup: {
      spots: 28,
      price: 16,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-057-image-1",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Work Lounge Bild 1",
        },
        {
          id: "seed-host-057-image-2",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Work Lounge Bild 2",
        },
        {
          id: "seed-host-057-image-3",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Work Lounge Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-057-review-1",
          author: "Lena",
          rating: 4,
          date: "02.02.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
        {
          id: "seed-host-057-review-2",
          author: "Lena",
          rating: 5,
          date: "05.03.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
      ],
    },
  },

  {
    uid: "seed-host-058",
    email: "hello@north-lab-workspace-geneve.ch",
    avatarUrl: null,
    createdAt: "2025-10-30T23:11:35.589Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "North Café Genève GmbH",
      phone: "+41 71 105 52 58",
      locationName: "North Lab Workspace",
      address: "Rue du Rhône 86",
      city: "Genève",
    },
    hostLocation: {
      category: "cafe",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://north-lab-workspace-geneve.ch",
      instagram: "https://www.instagram.com/north-lab-workspace-geneve",
      amenities: ["power", "wifi"],
    },
    hostSetup: {
      spots: 26,
      price: 12,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "09:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-058-image-1",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "North Lab Workspace Bild 1",
        },
        {
          id: "seed-host-058-image-2",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "North Lab Workspace Bild 2",
        },
        {
          id: "seed-host-058-image-3",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "North Lab Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-058-review-1",
          author: "Lena",
          rating: 5,
          date: "06.04.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
        {
          id: "seed-host-058-review-2",
          author: "Jan",
          rating: 4,
          date: "15.03.2026",
          text: "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
        },
        {
          id: "seed-host-058-review-3",
          author: "Marco",
          rating: 5,
          date: "03.03.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
      ],
    },
  },

  {
    uid: "seed-host-059",
    email: "hello@vista-dayspace-zug.ch",
    avatarUrl: null,
    createdAt: "2025-11-15T15:31:01.334Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Vista Café Zug GmbH",
      phone: "+41 44 177 72 59",
      locationName: "Vista Dayspace",
      address: "Langstrasse 113",
      city: "Zug",
    },
    hostLocation: {
      category: "cafe",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://vista-dayspace-zug.ch",
      instagram: "https://www.instagram.com/vista-dayspace-zug",
      amenities: ["laptop-zone", "wc"],
    },
    hostSetup: {
      spots: 14,
      price: 28,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "10:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-059-image-1",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Dayspace Bild 1",
        },
        {
          id: "seed-host-059-image-2",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Dayspace Bild 2",
        },
        {
          id: "seed-host-059-image-3",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Dayspace Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-060",
    email: "hello@lake-studio-desk-lugano.ch",
    avatarUrl: null,
    createdAt: "2026-01-21T20:32:20.884Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Lake Lugano GmbH",
      phone: "+41 71 823 91 60",
      locationName: "Lake Studio Desk",
      address: "Seefeldstrasse 61",
      city: "Lugano",
    },
    hostLocation: {
      category: "other",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://lake-studio-desk-lugano.ch",
      instagram: "https://www.instagram.com/lake-studio-desk-lugano",
      amenities: ["power", "wifi", "wc", "laptop-zone"],
    },
    hostSetup: {
      spots: 7,
      price: 20,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-060-image-1",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Studio Desk Bild 1",
        },
        {
          id: "seed-host-060-image-2",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Studio Desk Bild 2",
        },
        {
          id: "seed-host-060-image-3",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Studio Desk Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-061",
    email: "hello@studio-studio-desk-winterthur.ch",
    avatarUrl: null,
    createdAt: "2026-02-26T15:27:30.240Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Studio Restaurant Winterthur GmbH",
      phone: "+41 41 781 99 61",
      locationName: "Studio Studio Desk",
      address: "Clarastrasse 67",
      city: "Winterthur",
    },
    hostLocation: {
      category: "restaurant",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://studio-studio-desk-winterthur.ch",
      instagram: "https://www.instagram.com/studio-studio-desk-winterthur",
      amenities: ["laptop-zone", "wc", "wifi", "power"],
    },
    hostSetup: {
      spots: 15,
      price: 22,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "10:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-061-image-1",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Studio Desk Bild 1",
        },
        {
          id: "seed-host-061-image-2",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Studio Desk Bild 2",
        },
        {
          id: "seed-host-061-image-3",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Studio Desk Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-062",
    email: "hello@lake-office-lounge-lausanne.ch",
    avatarUrl: null,
    createdAt: "2025-12-08T14:24:39.060Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Lake Lounge Lausanne AG",
      phone: "+41 52 137 17 62",
      locationName: "Lake Office Lounge",
      address: "Kramgasse 75",
      city: "Lausanne",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://lake-office-lounge-lausanne.ch",
      instagram: "https://www.instagram.com/lake-office-lounge-lausanne",
      amenities: ["wifi", "wc", "power"],
    },
    hostSetup: {
      spots: 8,
      price: 21,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "07:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-062-image-1",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Office Lounge Bild 1",
        },
        {
          id: "seed-host-062-image-2",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Office Lounge Bild 2",
        },
        {
          id: "seed-host-062-image-3",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Office Lounge Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-062-review-1",
          author: "Mila",
          rating: 5,
          date: "15.03.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
        {
          id: "seed-host-062-review-2",
          author: "Jan",
          rating: 4,
          date: "26.02.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-063",
    email: "hello@vista-cowork-spot-luzern.ch",
    avatarUrl: null,
    createdAt: "2026-03-14T11:13:33.141Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Vista Restaurant Luzern GmbH",
      phone: "+41 31 553 73 63",
      locationName: "Vista Cowork Spot",
      address: "Langstrasse 58",
      city: "Luzern",
    },
    hostLocation: {
      category: "restaurant",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://vista-cowork-spot-luzern.ch",
      instagram: "https://www.instagram.com/vista-cowork-spot-luzern",
      amenities: ["power", "wc", "wifi", "laptop-zone"],
    },
    hostSetup: {
      spots: 6,
      price: 10,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-063-image-1",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Cowork Spot Bild 1",
        },
        {
          id: "seed-host-063-image-2",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Cowork Spot Bild 2",
        },
        {
          id: "seed-host-063-image-3",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Cowork Spot Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-063-review-1",
          author: "Sofia",
          rating: 4,
          date: "23.01.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
        {
          id: "seed-host-063-review-2",
          author: "Sara",
          rating: 5,
          date: "05.01.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
        {
          id: "seed-host-063-review-3",
          author: "Lena",
          rating: 4,
          date: "08.02.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-064",
    email: "hello@south-hub-space-lugano.ch",
    avatarUrl: null,
    createdAt: "2026-01-17T23:04:50.144Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "South Restaurant Lugano GmbH",
      phone: "+41 22 735 77 64",
      locationName: "South Hub Space",
      address: "Clarastrasse 70",
      city: "Lugano",
    },
    hostLocation: {
      category: "restaurant",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://south-hub-space-lugano.ch",
      instagram: "https://www.instagram.com/south-hub-space-lugano",
      amenities: ["wc", "laptop-zone"],
    },
    hostSetup: {
      spots: 9,
      price: 18,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "09:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-064-image-1",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "South Hub Space Bild 1",
        },
        {
          id: "seed-host-064-image-2",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "South Hub Space Bild 2",
        },
        {
          id: "seed-host-064-image-3",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "South Hub Space Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-065",
    email: "hello@loft-lab-workspace-st-gallen.ch",
    avatarUrl: null,
    createdAt: "2025-11-02T15:07:35.201Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Loft St. Gallen GmbH",
      phone: "+41 44 562 88 65",
      locationName: "Loft Lab Workspace",
      address: "Josefstrasse 85",
      city: "St. Gallen",
    },
    hostLocation: {
      category: "other",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://loft-lab-workspace-st-gallen.ch",
      instagram: "https://www.instagram.com/loft-lab-workspace-st-gallen",
      amenities: ["wc", "wifi", "laptop-zone", "power"],
    },
    hostSetup: {
      spots: 24,
      price: 23,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-065-image-1",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Lab Workspace Bild 1",
        },
        {
          id: "seed-host-065-image-2",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Lab Workspace Bild 2",
        },
        {
          id: "seed-host-065-image-3",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Lab Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-065-review-1",
          author: "Sara",
          rating: 5,
          date: "17.02.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
        {
          id: "seed-host-065-review-2",
          author: "Mila",
          rating: 4,
          date: "14.01.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-066",
    email: "hello@vista-workspace-zug.ch",
    avatarUrl: null,
    createdAt: "2026-01-18T13:02:02.773Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Vista Zug GmbH",
      phone: "+41 91 618 68 66",
      locationName: "Vista Workspace",
      address: "Spitalgasse 58",
      city: "Zug",
    },
    hostLocation: {
      category: "other",
      description: "Moderner Workspace mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://vista-workspace-zug.ch",
      instagram: "https://www.instagram.com/vista-workspace-zug",
      amenities: ["laptop-zone", "power"],
    },
    hostSetup: {
      spots: 18,
      price: 23,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "10:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-066-image-1",
          url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Workspace Bild 1",
        },
        {
          id: "seed-host-066-image-2",
          url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Workspace Bild 2",
        },
        {
          id: "seed-host-066-image-3",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Workspace Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-067",
    email: "hello@north-office-lounge-zug.ch",
    avatarUrl: null,
    createdAt: "2025-10-28T01:40:45.984Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "North Bar Zug AG",
      phone: "+41 41 950 80 67",
      locationName: "North Office Lounge",
      address: "Spitalgasse 28",
      city: "Zug",
    },
    hostLocation: {
      category: "bar",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://north-office-lounge-zug.ch",
      instagram: "https://www.instagram.com/north-office-lounge-zug",
      amenities: ["power", "laptop-zone", "wc"],
    },
    hostSetup: {
      spots: 34,
      price: 25,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "07:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-067-image-1",
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          alt: "North Office Lounge Bild 1",
        },
        {
          id: "seed-host-067-image-2",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "North Office Lounge Bild 2",
        },
        {
          id: "seed-host-067-image-3",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "North Office Lounge Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-067-review-1",
          author: "Lena",
          rating: 5,
          date: "01.03.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
      ],
    },
  },

  {
    uid: "seed-host-068",
    email: "hello@loft-cowork-spot-zug.ch",
    avatarUrl: null,
    createdAt: "2025-12-15T07:34:58.441Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Loft Zug GmbH",
      phone: "+41 61 374 35 68",
      locationName: "Loft Cowork Spot",
      address: "Clarastrasse 85",
      city: "Zug",
    },
    hostLocation: {
      category: "other",
      description: "Moderner Workspace mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://loft-cowork-spot-zug.ch",
      instagram: "https://www.instagram.com/loft-cowork-spot-zug",
      amenities: ["power", "wifi"],
    },
    hostSetup: {
      spots: 15,
      price: 32,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "07:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-068-image-1",
          url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Cowork Spot Bild 1",
        },
        {
          id: "seed-host-068-image-2",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Cowork Spot Bild 2",
        },
        {
          id: "seed-host-068-image-3",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Cowork Spot Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-068-review-1",
          author: "David",
          rating: 5,
          date: "14.04.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
        {
          id: "seed-host-068-review-2",
          author: "Mila",
          rating: 4,
          date: "01.01.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
      ],
    },
  },

  {
    uid: "seed-host-069",
    email: "hello@north-desk-club-neuchatel.ch",
    avatarUrl: null,
    createdAt: "2026-02-04T10:07:48.981Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "North Restaurant Neuchâtel GmbH",
      phone: "+41 41 241 50 69",
      locationName: "North Desk Club",
      address: "Seefeldstrasse 113",
      city: "Neuchâtel",
    },
    hostLocation: {
      category: "restaurant",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://north-desk-club-neuchatel.ch",
      instagram: "https://www.instagram.com/north-desk-club-neuchatel",
      amenities: ["wifi", "wc", "power"],
    },
    hostSetup: {
      spots: 15,
      price: 23,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "09:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-069-image-1",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "North Desk Club Bild 1",
        },
        {
          id: "seed-host-069-image-2",
          url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
          alt: "North Desk Club Bild 2",
        },
        {
          id: "seed-host-069-image-3",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "North Desk Club Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-069-review-1",
          author: "David",
          rating: 5,
          date: "10.03.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
        {
          id: "seed-host-069-review-2",
          author: "Mila",
          rating: 5,
          date: "06.02.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
      ],
    },
  },

  {
    uid: "seed-host-070",
    email: "hello@vista-lab-workspace-bern.ch",
    avatarUrl: null,
    createdAt: "2025-11-23T19:06:37.522Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Vista Bar Bern AG",
      phone: "+41 31 334 97 70",
      locationName: "Vista Lab Workspace",
      address: "Bahnhofstrasse 72",
      city: "Bern",
    },
    hostLocation: {
      category: "bar",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://vista-lab-workspace-bern.ch",
      instagram: "https://www.instagram.com/vista-lab-workspace-bern",
      amenities: ["power", "wifi"],
    },
    hostSetup: {
      spots: 10,
      price: 15,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["thu", "fri", "sat", "sun"],
      from: "10:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-070-image-1",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Lab Workspace Bild 1",
        },
        {
          id: "seed-host-070-image-2",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Lab Workspace Bild 2",
        },
        {
          id: "seed-host-070-image-3",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Lab Workspace Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-071",
    email: "hello@lake-studio-desk-bern.ch",
    avatarUrl: null,
    createdAt: "2026-02-05T09:19:16.572Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Lake Bern GmbH",
      phone: "+41 52 851 82 71",
      locationName: "Lake Studio Desk",
      address: "Baarerstrasse 49",
      city: "Bern",
    },
    hostLocation: {
      category: "other",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://lake-studio-desk-bern.ch",
      instagram: "https://www.instagram.com/lake-studio-desk-bern",
      amenities: ["wc", "laptop-zone", "wifi"],
    },
    hostSetup: {
      spots: 35,
      price: 19,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "07:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-071-image-1",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Studio Desk Bild 1",
        },
        {
          id: "seed-host-071-image-2",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Studio Desk Bild 2",
        },
        {
          id: "seed-host-071-image-3",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Studio Desk Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-071-review-1",
          author: "Sofia",
          rating: 5,
          date: "04.04.2026",
          text: "Stylisch, sauber und super für ein paar produktive Stunden.",
        },
        {
          id: "seed-host-071-review-2",
          author: "Sara",
          rating: 4,
          date: "05.04.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
        {
          id: "seed-host-071-review-3",
          author: "Elin",
          rating: 4,
          date: "04.02.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-072",
    email: "hello@dock-lab-workspace-winterthur.ch",
    avatarUrl: null,
    createdAt: "2026-01-10T00:50:48.632Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Dock Winterthur GmbH",
      phone: "+41 71 300 37 72",
      locationName: "Dock Lab Workspace",
      address: "Clarastrasse 76",
      city: "Winterthur",
    },
    hostLocation: {
      category: "other",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://dock-lab-workspace-winterthur.ch",
      instagram: "https://www.instagram.com/dock-lab-workspace-winterthur",
      amenities: ["power", "laptop-zone", "wifi"],
    },
    hostSetup: {
      spots: 15,
      price: 23,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-072-image-1",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Lab Workspace Bild 1",
        },
        {
          id: "seed-host-072-image-2",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Lab Workspace Bild 2",
        },
        {
          id: "seed-host-072-image-3",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Lab Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-072-review-1",
          author: "Lena",
          rating: 5,
          date: "20.04.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
        {
          id: "seed-host-072-review-2",
          author: "Luca",
          rating: 5,
          date: "08.02.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
      ],
    },
  },

  {
    uid: "seed-host-073",
    email: "hello@vista-workspace-lausanne.ch",
    avatarUrl: null,
    createdAt: "2025-12-27T07:08:22.007Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Vista Bar Lausanne AG",
      phone: "+41 44 872 91 73",
      locationName: "Vista Workspace",
      address: "Rue du Rhône 116",
      city: "Lausanne",
    },
    hostLocation: {
      category: "bar",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://vista-workspace-lausanne.ch",
      instagram: "https://www.instagram.com/vista-workspace-lausanne",
      amenities: ["laptop-zone", "wifi", "power"],
    },
    hostSetup: {
      spots: 10,
      price: 31,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["thu", "fri", "sat", "sun"],
      from: "07:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-073-image-1",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Workspace Bild 1",
        },
        {
          id: "seed-host-073-image-2",
          url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Workspace Bild 2",
        },
        {
          id: "seed-host-073-image-3",
          url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
          alt: "Vista Workspace Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-074",
    email: "hello@alpine-office-lounge-geneve.ch",
    avatarUrl: null,
    createdAt: "2026-04-04T17:25:32.219Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Alpine Café Genève GmbH",
      phone: "+41 52 171 64 74",
      locationName: "Alpine Office Lounge",
      address: "Bahnhofstrasse 94",
      city: "Genève",
    },
    hostLocation: {
      category: "cafe",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://alpine-office-lounge-geneve.ch",
      instagram: "https://www.instagram.com/alpine-office-lounge-geneve",
      amenities: ["wc", "laptop-zone", "wifi", "power"],
    },
    hostSetup: {
      spots: 30,
      price: 8,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-074-image-1",
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Office Lounge Bild 1",
        },
        {
          id: "seed-host-074-image-2",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Office Lounge Bild 2",
        },
        {
          id: "seed-host-074-image-3",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Office Lounge Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-074-review-1",
          author: "Marco",
          rating: 5,
          date: "10.04.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
      ],
    },
  },

  {
    uid: "seed-host-075",
    email: "hello@metro-desk-club-aarau.ch",
    avatarUrl: null,
    createdAt: "2025-12-27T05:57:27.233Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Metro Restaurant Aarau GmbH",
      phone: "+41 91 316 91 75",
      locationName: "Metro Desk Club",
      address: "Hardstrasse 104",
      city: "Aarau",
    },
    hostLocation: {
      category: "restaurant",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://metro-desk-club-aarau.ch",
      instagram: "https://www.instagram.com/metro-desk-club-aarau",
      amenities: ["laptop-zone", "wifi", "power"],
    },
    hostSetup: {
      spots: 14,
      price: 27,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "10:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-075-image-1",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Desk Club Bild 1",
        },
        {
          id: "seed-host-075-image-2",
          url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Desk Club Bild 2",
        },
        {
          id: "seed-host-075-image-3",
          url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Desk Club Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-076",
    email: "hello@urban-cowork-spot-winterthur.ch",
    avatarUrl: null,
    createdAt: "2026-01-07T05:16:32.006Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Urban Bar Winterthur AG",
      phone: "+41 31 619 26 76",
      locationName: "Urban Cowork Spot",
      address: "Marktgasse 7",
      city: "Winterthur",
    },
    hostLocation: {
      category: "bar",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://urban-cowork-spot-winterthur.ch",
      instagram: "https://www.instagram.com/urban-cowork-spot-winterthur",
      amenities: ["laptop-zone", "wc", "wifi"],
    },
    hostSetup: {
      spots: 26,
      price: 32,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-076-image-1",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Cowork Spot Bild 1",
        },
        {
          id: "seed-host-076-image-2",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Cowork Spot Bild 2",
        },
        {
          id: "seed-host-076-image-3",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Cowork Spot Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-076-review-1",
          author: "Luca",
          rating: 4,
          date: "01.01.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
        {
          id: "seed-host-076-review-2",
          author: "Jan",
          rating: 4,
          date: "06.03.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
      ],
    },
  },

  {
    uid: "seed-host-077",
    email: "hello@north-work-lounge-zuerich.ch",
    avatarUrl: null,
    createdAt: "2025-10-30T01:24:27.500Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "North Restaurant Zürich GmbH",
      phone: "+41 22 952 86 77",
      locationName: "North Work Lounge",
      address: "Rue du Rhône 97",
      city: "Zürich",
    },
    hostLocation: {
      category: "restaurant",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://north-work-lounge-zuerich.ch",
      instagram: "https://www.instagram.com/north-work-lounge-zuerich",
      amenities: ["wc", "wifi", "power", "laptop-zone"],
    },
    hostSetup: {
      spots: 11,
      price: 13,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "07:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-077-image-1",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "North Work Lounge Bild 1",
        },
        {
          id: "seed-host-077-image-2",
          url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
          alt: "North Work Lounge Bild 2",
        },
        {
          id: "seed-host-077-image-3",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "North Work Lounge Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-077-review-1",
          author: "Tom",
          rating: 5,
          date: "23.03.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
        {
          id: "seed-host-077-review-2",
          author: "Marco",
          rating: 4,
          date: "11.04.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
        {
          id: "seed-host-077-review-3",
          author: "Mila",
          rating: 5,
          date: "07.02.2026",
          text: "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
        },
      ],
    },
  },

  {
    uid: "seed-host-078",
    email: "hello@riverside-desk-club-luzern.ch",
    avatarUrl: null,
    createdAt: "2026-04-11T03:01:08.466Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Riverside Restaurant Luzern GmbH",
      phone: "+41 31 575 56 78",
      locationName: "Riverside Desk Club",
      address: "Baarerstrasse 20",
      city: "Luzern",
    },
    hostLocation: {
      category: "restaurant",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://riverside-desk-club-luzern.ch",
      instagram: "https://www.instagram.com/riverside-desk-club-luzern",
      amenities: ["wc", "power", "laptop-zone"],
    },
    hostSetup: {
      spots: 22,
      price: 9,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "07:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-078-image-1",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Desk Club Bild 1",
        },
        {
          id: "seed-host-078-image-2",
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Desk Club Bild 2",
        },
        {
          id: "seed-host-078-image-3",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Desk Club Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-078-review-1",
          author: "Lena",
          rating: 4,
          date: "12.02.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-079",
    email: "hello@loft-desk-club-lausanne.ch",
    avatarUrl: null,
    createdAt: "2026-04-07T06:41:08.220Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Loft Café Lausanne GmbH",
      phone: "+41 41 572 57 79",
      locationName: "Loft Desk Club",
      address: "Pilatusstrasse 40",
      city: "Lausanne",
    },
    hostLocation: {
      category: "cafe",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://loft-desk-club-lausanne.ch",
      instagram: "https://www.instagram.com/loft-desk-club-lausanne",
      amenities: ["power", "laptop-zone"],
    },
    hostSetup: {
      spots: 13,
      price: 17,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "09:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-079-image-1",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Desk Club Bild 1",
        },
        {
          id: "seed-host-079-image-2",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Desk Club Bild 2",
        },
        {
          id: "seed-host-079-image-3",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Desk Club Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-079-review-1",
          author: "Tom",
          rating: 5,
          date: "23.03.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
        {
          id: "seed-host-079-review-2",
          author: "Nina",
          rating: 5,
          date: "20.04.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
      ],
    },
  },

  {
    uid: "seed-host-080",
    email: "hello@urban-cowork-spot-basel.ch",
    avatarUrl: null,
    createdAt: "2025-12-14T11:56:11.185Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Urban Basel GmbH",
      phone: "+41 52 326 83 80",
      locationName: "Urban Cowork Spot",
      address: "Pilatusstrasse 41",
      city: "Basel",
    },
    hostLocation: {
      category: "other",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://urban-cowork-spot-basel.ch",
      instagram: "https://www.instagram.com/urban-cowork-spot-basel",
      amenities: ["laptop-zone", "wc"],
    },
    hostSetup: {
      spots: 28,
      price: 22,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["thu", "fri", "sat", "sun"],
      from: "10:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-080-image-1",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Cowork Spot Bild 1",
        },
        {
          id: "seed-host-080-image-2",
          url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Cowork Spot Bild 2",
        },
        {
          id: "seed-host-080-image-3",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Cowork Spot Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-080-review-1",
          author: "Sofia",
          rating: 5,
          date: "09.04.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-081",
    email: "hello@dock-lab-workspace-neuchatel.ch",
    avatarUrl: null,
    createdAt: "2025-11-26T15:33:09.229Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Dock Restaurant Neuchâtel GmbH",
      phone: "+41 22 491 73 81",
      locationName: "Dock Lab Workspace",
      address: "Pilatusstrasse 24",
      city: "Neuchâtel",
    },
    hostLocation: {
      category: "restaurant",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://dock-lab-workspace-neuchatel.ch",
      instagram: "https://www.instagram.com/dock-lab-workspace-neuchatel",
      amenities: ["wc", "laptop-zone", "power", "wifi"],
    },
    hostSetup: {
      spots: 14,
      price: 11,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["thu", "fri", "sat", "sun"],
      from: "07:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-081-image-1",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Lab Workspace Bild 1",
        },
        {
          id: "seed-host-081-image-2",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Lab Workspace Bild 2",
        },
        {
          id: "seed-host-081-image-3",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Lab Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-081-review-1",
          author: "Noah",
          rating: 5,
          date: "09.04.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
        {
          id: "seed-host-081-review-2",
          author: "Tom",
          rating: 5,
          date: "08.03.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
        {
          id: "seed-host-081-review-3",
          author: "David",
          rating: 4,
          date: "14.04.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
      ],
    },
  },

  {
    uid: "seed-host-082",
    email: "hello@south-cowork-spot-luzern.ch",
    avatarUrl: null,
    createdAt: "2026-02-10T03:33:59.272Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "South Luzern GmbH",
      phone: "+41 31 291 67 82",
      locationName: "South Cowork Spot",
      address: "Baarerstrasse 24",
      city: "Luzern",
    },
    hostLocation: {
      category: "other",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://south-cowork-spot-luzern.ch",
      instagram: "https://www.instagram.com/south-cowork-spot-luzern",
      amenities: ["wc", "laptop-zone", "power"],
    },
    hostSetup: {
      spots: 18,
      price: 25,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "07:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-082-image-1",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "South Cowork Spot Bild 1",
        },
        {
          id: "seed-host-082-image-2",
          url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
          alt: "South Cowork Spot Bild 2",
        },
        {
          id: "seed-host-082-image-3",
          url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
          alt: "South Cowork Spot Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-082-review-1",
          author: "Jan",
          rating: 4,
          date: "13.01.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
        {
          id: "seed-host-082-review-2",
          author: "Sofia",
          rating: 4,
          date: "22.02.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-083",
    email: "hello@alpine-workspace-bern.ch",
    avatarUrl: null,
    createdAt: "2025-12-08T19:37:49.888Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Alpine Restaurant Bern GmbH",
      phone: "+41 41 560 98 83",
      locationName: "Alpine Workspace",
      address: "Hardstrasse 9",
      city: "Bern",
    },
    hostLocation: {
      category: "restaurant",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://alpine-workspace-bern.ch",
      instagram: "https://www.instagram.com/alpine-workspace-bern",
      amenities: ["wc", "power", "wifi"],
    },
    hostSetup: {
      spots: 10,
      price: 11,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["thu", "fri", "sat", "sun"],
      from: "10:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-083-image-1",
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Workspace Bild 1",
        },
        {
          id: "seed-host-083-image-2",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Workspace Bild 2",
        },
        {
          id: "seed-host-083-image-3",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "Alpine Workspace Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-084",
    email: "hello@urban-dayspace-luzern.ch",
    avatarUrl: null,
    createdAt: "2026-01-12T05:37:56.875Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Urban Bar Luzern AG",
      phone: "+41 61 241 85 84",
      locationName: "Urban Dayspace",
      address: "Marktgasse 20",
      city: "Luzern",
    },
    hostLocation: {
      category: "bar",
      description: "Moderner Bar mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://urban-dayspace-luzern.ch",
      instagram: "https://www.instagram.com/urban-dayspace-luzern",
      amenities: ["laptop-zone", "wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 31,
      price: 24,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-084-image-1",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Dayspace Bild 1",
        },
        {
          id: "seed-host-084-image-2",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Dayspace Bild 2",
        },
        {
          id: "seed-host-084-image-3",
          url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Dayspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-084-review-1",
          author: "Tom",
          rating: 4,
          date: "04.03.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
        {
          id: "seed-host-084-review-2",
          author: "Mila",
          rating: 4,
          date: "26.03.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-085",
    email: "hello@riverside-work-lounge-luzern.ch",
    avatarUrl: null,
    createdAt: "2025-12-06T17:42:24.396Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Riverside Restaurant Luzern GmbH",
      phone: "+41 41 717 30 85",
      locationName: "Riverside Work Lounge",
      address: "Kramgasse 94",
      city: "Luzern",
    },
    hostLocation: {
      category: "restaurant",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://riverside-work-lounge-luzern.ch",
      instagram: "https://www.instagram.com/riverside-work-lounge-luzern",
      amenities: ["wc", "power"],
    },
    hostSetup: {
      spots: 19,
      price: 21,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "07:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-085-image-1",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Work Lounge Bild 1",
        },
        {
          id: "seed-host-085-image-2",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Work Lounge Bild 2",
        },
        {
          id: "seed-host-085-image-3",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Work Lounge Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-085-review-1",
          author: "Lena",
          rating: 4,
          date: "21.01.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
        {
          id: "seed-host-085-review-2",
          author: "Marco",
          rating: 5,
          date: "25.02.2026",
          text: "Stylisch, sauber und super für ein paar produktive Stunden.",
        },
      ],
    },
  },

  {
    uid: "seed-host-086",
    email: "hello@riverside-workspace-neuchatel.ch",
    avatarUrl: null,
    createdAt: "2026-01-27T13:23:40.788Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Riverside Lounge Neuchâtel AG",
      phone: "+41 41 520 81 86",
      locationName: "Riverside Workspace",
      address: "Seefeldstrasse 3",
      city: "Neuchâtel",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://riverside-workspace-neuchatel.ch",
      instagram: "https://www.instagram.com/riverside-workspace-neuchatel",
      amenities: ["wifi", "power", "wc", "laptop-zone"],
    },
    hostSetup: {
      spots: 35,
      price: 23,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "07:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-086-image-1",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Workspace Bild 1",
        },
        {
          id: "seed-host-086-image-2",
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Workspace Bild 2",
        },
        {
          id: "seed-host-086-image-3",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-086-review-1",
          author: "David",
          rating: 5,
          date: "04.01.2026",
          text: "Stylisch, sauber und super für ein paar produktive Stunden.",
        },
        {
          id: "seed-host-086-review-2",
          author: "Nina",
          rating: 5,
          date: "28.01.2026",
          text: "Gute Location für fokussierte Sessions. Kaffee war auch top.",
        },
        {
          id: "seed-host-086-review-3",
          author: "Marco",
          rating: 4,
          date: "25.03.2026",
          text: "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
        },
      ],
    },
  },

  {
    uid: "seed-host-087",
    email: "hello@loft-work-lounge-winterthur.ch",
    avatarUrl: null,
    createdAt: "2025-12-02T06:36:59.602Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Loft Lounge Winterthur AG",
      phone: "+41 71 596 58 87",
      locationName: "Loft Work Lounge",
      address: "Clarastrasse 9",
      city: "Winterthur",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Moderner Hotel Lounge mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://loft-work-lounge-winterthur.ch",
      instagram: "https://www.instagram.com/loft-work-lounge-winterthur",
      amenities: ["laptop-zone", "power", "wifi"],
    },
    hostSetup: {
      spots: 17,
      price: 18,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "10:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-087-image-1",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Work Lounge Bild 1",
        },
        {
          id: "seed-host-087-image-2",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Work Lounge Bild 2",
        },
        {
          id: "seed-host-087-image-3",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Work Lounge Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-087-review-1",
          author: "Lena",
          rating: 5,
          date: "22.01.2026",
          text: "Stylisch, sauber und super für ein paar produktive Stunden.",
        },
        {
          id: "seed-host-087-review-2",
          author: "David",
          rating: 4,
          date: "21.02.2026",
          text: "Stylisch, sauber und super für ein paar produktive Stunden.",
        },
      ],
    },
  },

  {
    uid: "seed-host-088",
    email: "hello@riverside-hub-space-lausanne.ch",
    avatarUrl: null,
    createdAt: "2026-03-01T13:46:36.418Z",
    updatedAt: "2026-04-18T15:21:08.983Z",
    hostProfile: {
      operatorName: "Riverside Lounge Lausanne AG",
      phone: "+41 41 139 57 88",
      locationName: "Riverside Hub Space",
      address: "Clarastrasse 66",
      city: "Lausanne",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Moderner Hotel Lounge mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://riverside-hub-space-lausanne.ch",
      instagram: "https://www.instagram.com/riverside-hub-space-lausanne",
      amenities: ["wc", "wifi", "power"],
    },
    hostSetup: {
      spots: 18,
      price: 16,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["thu", "fri", "sat", "sun"],
      from: "08:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-088-image-1",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Hub Space Bild 1",
        },
        {
          id: "seed-host-088-image-2",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Hub Space Bild 2",
        },
        {
          id: "seed-host-088-image-3",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Hub Space Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-088-review-1",
          author: "Mila",
          rating: 5,
          date: "21.04.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
        {
          id: "seed-host-088-review-2",
          author: "Tom",
          rating: 5,
          date: "28.04.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-089",
    email: "hello@urban-studio-desk-luzern.ch",
    avatarUrl: null,
    createdAt: "2025-12-29T20:31:19.770Z",
    updatedAt: "2026-04-18T15:21:08.984Z",
    hostProfile: {
      operatorName: "Urban Luzern GmbH",
      phone: "+41 61 234 54 89",
      locationName: "Urban Studio Desk",
      address: "Josefstrasse 119",
      city: "Luzern",
    },
    hostLocation: {
      category: "other",
      description: "Moderner Workspace mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://urban-studio-desk-luzern.ch",
      instagram: "https://www.instagram.com/urban-studio-desk-luzern",
      amenities: ["wc", "laptop-zone"],
    },
    hostSetup: {
      spots: 17,
      price: 11,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "19:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-089-image-1",
          url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Studio Desk Bild 1",
        },
        {
          id: "seed-host-089-image-2",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Studio Desk Bild 2",
        },
        {
          id: "seed-host-089-image-3",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Studio Desk Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-089-review-1",
          author: "Lena",
          rating: 5,
          date: "23.04.2026",
          text: "Stylisch, sauber und super für ein paar produktive Stunden.",
        },
      ],
    },
  },

  {
    uid: "seed-host-090",
    email: "hello@metro-studio-desk-lugano.ch",
    avatarUrl: null,
    createdAt: "2026-04-03T17:34:02.440Z",
    updatedAt: "2026-04-18T15:21:08.984Z",
    hostProfile: {
      operatorName: "Metro Lounge Lugano AG",
      phone: "+41 52 256 24 90",
      locationName: "Metro Studio Desk",
      address: "Pilatusstrasse 43",
      city: "Lugano",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Stilvoller Arbeitsort mit flexiblen Slots, Steckdosen und ruhigem Innenbereich.",
      website: "https://metro-studio-desk-lugano.ch",
      instagram: "https://www.instagram.com/metro-studio-desk-lugano",
      amenities: ["laptop-zone", "wifi", "wc", "power"],
    },
    hostSetup: {
      spots: 30,
      price: 10,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "08:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-090-image-1",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Studio Desk Bild 1",
        },
        {
          id: "seed-host-090-image-2",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Studio Desk Bild 2",
        },
        {
          id: "seed-host-090-image-3",
          url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Studio Desk Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-090-review-1",
          author: "Elin",
          rating: 4,
          date: "04.02.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
        {
          id: "seed-host-090-review-2",
          author: "Noah",
          rating: 5,
          date: "24.04.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
        {
          id: "seed-host-090-review-3",
          author: "Elin",
          rating: 4,
          date: "19.04.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
      ],
    },
  },

  {
    uid: "seed-host-091",
    email: "hello@urban-hub-space-st-gallen.ch",
    avatarUrl: null,
    createdAt: "2026-03-22T10:32:19.475Z",
    updatedAt: "2026-04-18T15:21:08.984Z",
    hostProfile: {
      operatorName: "Urban Lounge St. Gallen AG",
      phone: "+41 21 177 87 91",
      locationName: "Urban Hub Space",
      address: "Pilatusstrasse 71",
      city: "St. Gallen",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://urban-hub-space-st-gallen.ch",
      instagram: "https://www.instagram.com/urban-hub-space-st-gallen",
      amenities: ["wifi", "wc", "power"],
    },
    hostSetup: {
      spots: 31,
      price: 29,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "07:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-091-image-1",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Hub Space Bild 1",
        },
        {
          id: "seed-host-091-image-2",
          url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Hub Space Bild 2",
        },
        {
          id: "seed-host-091-image-3",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Hub Space Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-091-review-1",
          author: "Noah",
          rating: 4,
          date: "24.02.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-092",
    email: "hello@metro-workspace-lugano.ch",
    avatarUrl: null,
    createdAt: "2026-02-25T13:10:14.256Z",
    updatedAt: "2026-04-18T15:21:08.984Z",
    hostProfile: {
      operatorName: "Metro Lounge Lugano AG",
      phone: "+41 61 610 78 92",
      locationName: "Metro Workspace",
      address: "Marktgasse 73",
      city: "Lugano",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://metro-workspace-lugano.ch",
      instagram: "https://www.instagram.com/metro-workspace-lugano",
      amenities: ["wifi", "wc", "laptop-zone", "power"],
    },
    hostSetup: {
      spots: 32,
      price: 23,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "07:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-092-image-1",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Workspace Bild 1",
        },
        {
          id: "seed-host-092-image-2",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Workspace Bild 2",
        },
        {
          id: "seed-host-092-image-3",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Metro Workspace Bild 3",
        },
      ],
      reviews: [],
    },
  },

  {
    uid: "seed-host-093",
    email: "hello@urban-desk-house-lausanne.ch",
    avatarUrl: null,
    createdAt: "2026-01-28T22:52:45.479Z",
    updatedAt: "2026-04-18T15:21:08.984Z",
    hostProfile: {
      operatorName: "Urban Bar Lausanne AG",
      phone: "+41 61 199 43 93",
      locationName: "Urban Desk House",
      address: "Clarastrasse 107",
      city: "Lausanne",
    },
    hostLocation: {
      category: "bar",
      description: "Moderner Bar mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://urban-desk-house-lausanne.ch",
      instagram: "https://www.instagram.com/urban-desk-house-lausanne",
      amenities: ["laptop-zone", "wifi"],
    },
    hostSetup: {
      spots: 14,
      price: 9,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-093-image-1",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Desk House Bild 1",
        },
        {
          id: "seed-host-093-image-2",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Desk House Bild 2",
        },
        {
          id: "seed-host-093-image-3",
          url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
          alt: "Urban Desk House Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-093-review-1",
          author: "Sara",
          rating: 5,
          date: "11.01.2026",
          text: "Ideal für konzentriertes Arbeiten ohne viel Ablenkung.",
        },
        {
          id: "seed-host-093-review-2",
          author: "Mila",
          rating: 4,
          date: "15.04.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
        {
          id: "seed-host-093-review-3",
          author: "Sara",
          rating: 5,
          date: "18.01.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
      ],
    },
  },

  {
    uid: "seed-host-094",
    email: "hello@studio-desk-club-neuchatel.ch",
    avatarUrl: null,
    createdAt: "2025-12-11T06:22:34.452Z",
    updatedAt: "2026-04-18T15:21:08.984Z",
    hostProfile: {
      operatorName: "Studio Restaurant Neuchâtel GmbH",
      phone: "+41 91 558 42 94",
      locationName: "Studio Desk Club",
      address: "Baarerstrasse 14",
      city: "Neuchâtel",
    },
    hostLocation: {
      category: "restaurant",
      description: "Moderner Restaurant mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://studio-desk-club-neuchatel.ch",
      instagram: "https://www.instagram.com/studio-desk-club-neuchatel",
      amenities: ["laptop-zone", "wifi", "wc"],
    },
    hostSetup: {
      spots: 8,
      price: 26,
      marked: false,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "08:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-094-image-1",
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Desk Club Bild 1",
        },
        {
          id: "seed-host-094-image-2",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Desk Club Bild 2",
        },
        {
          id: "seed-host-094-image-3",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Desk Club Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-094-review-1",
          author: "Marco",
          rating: 5,
          date: "08.04.2026",
          text: "Top Mischung aus Komfort, WLAN und guter Lage.",
        },
        {
          id: "seed-host-094-review-2",
          author: "Sofia",
          rating: 5,
          date: "10.01.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-095",
    email: "hello@south-desk-house-zug.ch",
    avatarUrl: null,
    createdAt: "2025-12-08T04:01:16.126Z",
    updatedAt: "2026-04-18T15:21:08.984Z",
    hostProfile: {
      operatorName: "South Bar Zug AG",
      phone: "+41 21 445 75 95",
      locationName: "South Desk House",
      address: "Clarastrasse 17",
      city: "Zug",
    },
    hostLocation: {
      category: "bar",
      description: "Laptop-freundlicher Spot mit entspannter Stimmung und solider Infrastruktur für Remote Work.",
      website: "https://south-desk-house-zug.ch",
      instagram: "https://www.instagram.com/south-desk-house-zug",
      amenities: ["power", "wc", "laptop-zone"],
    },
    hostSetup: {
      spots: 14,
      price: 16,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "20:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: true,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-095-image-1",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "South Desk House Bild 1",
        },
        {
          id: "seed-host-095-image-2",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "South Desk House Bild 2",
        },
        {
          id: "seed-host-095-image-3",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
          alt: "South Desk House Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-095-review-1",
          author: "David",
          rating: 4,
          date: "01.03.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
        {
          id: "seed-host-095-review-2",
          author: "Mila",
          rating: 5,
          date: "10.03.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
      ],
    },
  },

  {
    uid: "seed-host-096",
    email: "hello@loft-workspace-lausanne.ch",
    avatarUrl: null,
    createdAt: "2025-12-22T08:41:04.735Z",
    updatedAt: "2026-04-18T15:21:08.984Z",
    hostProfile: {
      operatorName: "Loft Bar Lausanne AG",
      phone: "+41 31 674 13 96",
      locationName: "Loft Workspace",
      address: "Seefeldstrasse 29",
      city: "Lausanne",
    },
    hostLocation: {
      category: "bar",
      description: "Moderner Bar mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://loft-workspace-lausanne.ch",
      instagram: "https://www.instagram.com/loft-workspace-lausanne",
      amenities: ["wifi", "power"],
    },
    hostSetup: {
      spots: 22,
      price: 30,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["thu", "fri", "sat", "sun"],
      from: "07:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-096-image-1",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Workspace Bild 1",
        },
        {
          id: "seed-host-096-image-2",
          url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Workspace Bild 2",
        },
        {
          id: "seed-host-096-image-3",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Loft Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-096-review-1",
          author: "Noah",
          rating: 4,
          date: "15.04.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
        {
          id: "seed-host-096-review-2",
          author: "David",
          rating: 5,
          date: "03.01.2026",
          text: "Sehr angenehme Atmosphäre, schnelles WLAN und genug Ruhe zum Arbeiten.",
        },
        {
          id: "seed-host-096-review-3",
          author: "Noah",
          rating: 5,
          date: "09.02.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
      ],
    },
  },

  {
    uid: "seed-host-097",
    email: "hello@lake-dayspace-bern.ch",
    avatarUrl: null,
    createdAt: "2026-01-08T17:27:24.779Z",
    updatedAt: "2026-04-18T15:21:08.984Z",
    hostProfile: {
      operatorName: "Lake Lounge Bern AG",
      phone: "+41 61 168 34 97",
      locationName: "Lake Dayspace",
      address: "Seefeldstrasse 119",
      city: "Bern",
    },
    hostLocation: {
      category: "hotel-lounge",
      description: "Moderner Hotel Lounge mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://lake-dayspace-bern.ch",
      instagram: "https://www.instagram.com/lake-dayspace-bern",
      amenities: ["wc", "power", "laptop-zone"],
    },
    hostSetup: {
      spots: 6,
      price: 12,
      marked: true,
      laptopZoneOnly: false,
      slotDuration: "4h",
    },
    hostAvailability: {
      days: ["mon", "wed", "thu", "fri", "sat"],
      from: "09:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 15,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-097-image-1",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Dayspace Bild 1",
        },
        {
          id: "seed-host-097-image-2",
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Dayspace Bild 2",
        },
        {
          id: "seed-host-097-image-3",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Lake Dayspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-097-review-1",
          author: "Mila",
          rating: 4,
          date: "06.04.2026",
          text: "Die Stimmung war entspannt und das Team vor Ort sehr freundlich.",
        },
        {
          id: "seed-host-097-review-2",
          author: "Sara",
          rating: 4,
          date: "16.04.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-098",
    email: "hello@riverside-lab-workspace-winterthur.ch",
    avatarUrl: null,
    createdAt: "2026-03-02T07:34:34.416Z",
    updatedAt: "2026-04-18T15:21:08.984Z",
    hostProfile: {
      operatorName: "Riverside Restaurant Winterthur GmbH",
      phone: "+41 31 732 75 98",
      locationName: "Riverside Lab Workspace",
      address: "Seefeldstrasse 3",
      city: "Winterthur",
    },
    hostLocation: {
      category: "restaurant",
      description: "Moderner Restaurant mit stabiler Internetverbindung und ruhiger Arbeitszone für konzentriertes Arbeiten.",
      website: "https://riverside-lab-workspace-winterthur.ch",
      instagram: "https://www.instagram.com/riverside-lab-workspace-winterthur",
      amenities: ["power", "wc", "laptop-zone", "wifi"],
    },
    hostSetup: {
      spots: 21,
      price: 29,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "2h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "09:00",
      to: "17:00",
      recurring: true,
      gracePeriod: 10,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-098-image-1",
          url: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Lab Workspace Bild 1",
        },
        {
          id: "seed-host-098-image-2",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Lab Workspace Bild 2",
        },
        {
          id: "seed-host-098-image-3",
          url: "https://images.unsplash.com/photo-1523942839745-7848d9caa4a4?q=80&w=1200&auto=format&fit=crop",
          alt: "Riverside Lab Workspace Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-098-review-1",
          author: "Sara",
          rating: 4,
          date: "28.03.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-099",
    email: "hello@studio-desk-house-neuchatel.ch",
    avatarUrl: null,
    createdAt: "2026-02-23T07:34:14.120Z",
    updatedAt: "2026-04-18T15:21:08.984Z",
    hostProfile: {
      operatorName: "Studio Neuchâtel GmbH",
      phone: "+41 41 590 93 99",
      locationName: "Studio Desk House",
      address: "Baarerstrasse 44",
      city: "Neuchâtel",
    },
    hostLocation: {
      category: "other",
      description: "Angenehme Location für produktive Sessions mit zuverlässigem WLAN und guter Tagesatmosphäre.",
      website: "https://studio-desk-house-neuchatel.ch",
      instagram: "https://www.instagram.com/studio-desk-house-neuchatel",
      amenities: ["wc", "wifi", "power", "laptop-zone"],
    },
    hostSetup: {
      spots: 21,
      price: 26,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["mon", "tue", "wed"],
      from: "10:00",
      to: "18:00",
      recurring: true,
      gracePeriod: 20,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-099-image-1",
          url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Desk House Bild 1",
        },
        {
          id: "seed-host-099-image-2",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Desk House Bild 2",
        },
        {
          id: "seed-host-099-image-3",
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          alt: "Studio Desk House Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-099-review-1",
          author: "Luca",
          rating: 4,
          date: "08.03.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
        {
          id: "seed-host-099-review-2",
          author: "Sara",
          rating: 5,
          date: "02.04.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },

  {
    uid: "seed-host-100",
    email: "hello@dock-hub-space-lugano.ch",
    avatarUrl: null,
    createdAt: "2025-11-05T03:22:20.820Z",
    updatedAt: "2026-04-18T15:21:08.984Z",
    hostProfile: {
      operatorName: "Dock Restaurant Lugano GmbH",
      phone: "+41 31 402 45 100",
      locationName: "Dock Hub Space",
      address: "Bahnhofstrasse 72",
      city: "Lugano",
    },
    hostLocation: {
      category: "restaurant",
      description: "Beliebter Treffpunkt für Freelancer und Professionals mit klaren Arbeitsbereichen.",
      website: "https://dock-hub-space-lugano.ch",
      instagram: "https://www.instagram.com/dock-hub-space-lugano",
      amenities: ["laptop-zone", "wifi", "power", "wc"],
    },
    hostSetup: {
      spots: 24,
      price: 20,
      marked: true,
      laptopZoneOnly: true,
      slotDuration: "3h",
    },
    hostAvailability: {
      days: ["tue", "wed", "thu", "fri", "sat"],
      from: "10:00",
      to: "21:00",
      recurring: true,
      gracePeriod: 5,
      extendAllowed: false,
    },
    hostRules: {
      accepted: ["booking-limit", "no-claim", "house-rules", "legal"],
    },
    hostContent: {
      gallery: [
        {
          id: "seed-host-100-image-1",
          url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Hub Space Bild 1",
        },
        {
          id: "seed-host-100-image-2",
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Hub Space Bild 2",
        },
        {
          id: "seed-host-100-image-3",
          url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          alt: "Dock Hub Space Bild 3",
        },
      ],
      reviews: [
        {
          id: "seed-host-100-review-1",
          author: "Jan",
          rating: 4,
          date: "24.01.2026",
          text: "Würde ich jederzeit wieder buchen.",
        },
        {
          id: "seed-host-100-review-2",
          author: "Marco",
          rating: 5,
          date: "21.01.2026",
          text: "Hat alles, was man für Remote Work braucht.",
        },
      ],
    },
  },
];

function getServiceAccount(): ServiceAccount {
  const serviceAccountPath = resolve(process.cwd(), "lib/firebase/serviceAccountKey.json");
  const file = readFileSync(serviceAccountPath, "utf8");
  return JSON.parse(file) as ServiceAccount;
}

function getDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert(getServiceAccount()),
    });
  }

  return getFirestore();
}

function toAppProfile(host: SeedHost): AppProfile {
  return {
    uid: host.uid,
    email: host.email,
    avatarUrl: host.avatarUrl,
    role: "host",
    accessRole: "user",
    authMethod: "email",
    onboardingCompleted: true,
    onboardingStep: "/",
    createdAt: host.createdAt,
    updatedAt: host.updatedAt,
    hostProfile: host.hostProfile,
    hostLocation: host.hostLocation,
    hostSetup: host.hostSetup,
    hostAvailability: host.hostAvailability,
    hostRules: host.hostRules,
    hostContent: host.hostContent,
  };
}

async function seedHostsToFirestore() {
  const db = getDb();

  if (!seedHosts.length) {
    console.log("No seed hosts found.");
    return;
  }

  for (const host of seedHosts) {
    const profile = toAppProfile(host);

    await db.collection("users").doc(profile.uid).set(profile, { merge: true });
    console.log(`Seeded host: ${profile.uid}`);
  }

  console.log(`Done. Seeded ${seedHosts.length} hosts.`);
}

void seedHostsToFirestore();
