import { adminDb } from "@/lib/firebase/admin";
import { DiscoveryShell } from "@/components/discovery/discovery-shell";
import { filterHosts, type DiscoveryFilters } from "@/lib/discovery/filter-hosts";
import type { CantonName } from "@/lib/maps/cantons";
import type { AppProfile } from "@/types/user-profile";

type HomePageProps = {
  searchParams: Promise<{
    q?: string;
    city?: string;
    canton?: string;
    category?: string;
    amenities?: string;
    priceMax?: string;
    slotDuration?: string;
    map?: string;
  }>;
};

async function getHosts(): Promise<AppProfile[]> {
  const snapshot = await adminDb.collection("users").where("role", "==", "host").get();

  return snapshot.docs.map((doc) => doc.data() as AppProfile).filter((host) => host.onboardingCompleted);
}

function toFilters(params: Awaited<HomePageProps["searchParams"]>): DiscoveryFilters {
  return {
    q: params.q?.trim() ?? "",
    city: params.city?.trim() ?? "",
    canton: (params.canton?.trim() ?? "") as CantonName | "",
    category: params.category?.trim() ?? "",
    amenities:
      params.amenities
        ?.split(",")
        .map((value) => value.trim())
        .filter(Boolean) ?? [],
    priceMax: params.priceMax ? Number(params.priceMax) : null,
    slotDuration: params.slotDuration?.trim() ?? "",
    map: params.map === "1",
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const filters = toFilters(params);
  const hosts = await getHosts();
  const filteredHosts = filterHosts(hosts, filters);

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-background">
      <DiscoveryShell hosts={filteredHosts} initialFilters={filters} />
    </main>
  );
}
