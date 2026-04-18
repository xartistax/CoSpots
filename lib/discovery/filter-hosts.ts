import { getCantonForCity } from "@/lib/maps/city-to-canton";
import type { CantonName } from "@/lib/maps/cantons";
import type { AppProfile } from "@/types/user-profile";

export type DiscoveryFilters = {
  q: string;
  city: string;
  canton: CantonName | "";
  category: string;
  amenities: string[];
  priceMax: number | null;
  slotDuration: string;
  map: boolean;
};

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function includesText(haystack: string | null | undefined, needle: string): boolean {
  return normalize(haystack).includes(normalize(needle));
}

export function filterHosts(hosts: AppProfile[], filters: DiscoveryFilters): AppProfile[] {
  return hosts.filter((host) => {
    const locationName = host.hostProfile?.locationName ?? "";
    const city = host.hostProfile?.city ?? "";
    const address = host.hostProfile?.address ?? "";
    const description = host.hostLocation?.description ?? "";
    const category = host.hostLocation?.category ?? "";
    const amenities = host.hostLocation?.amenities ?? [];
    const price = host.hostSetup?.price ?? 0;
    const slotDuration = host.hostSetup?.slotDuration ?? "";
    const canton = getCantonForCity(city);

    if (filters.q) {
      const matchesQuery =
        includesText(locationName, filters.q) || includesText(city, filters.q) || includesText(address, filters.q) || includesText(description, filters.q);

      if (!matchesQuery) {
        return false;
      }
    }

    if (filters.city && normalize(city) !== normalize(filters.city)) {
      return false;
    }

    if (filters.canton && canton !== filters.canton) {
      return false;
    }

    if (filters.category && normalize(category) !== normalize(filters.category)) {
      return false;
    }

    if (filters.slotDuration && normalize(slotDuration) !== normalize(filters.slotDuration)) {
      return false;
    }

    if (filters.priceMax !== null && price > filters.priceMax) {
      return false;
    }

    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity) => amenities.includes(amenity));

      if (!hasAllAmenities) {
        return false;
      }
    }

    return true;
  });
}
