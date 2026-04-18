"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Star, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppProfile, HostGalleryImage, HostReviewData } from "@/types/user-profile";
import { AMENITY_ICONS } from "@/lib/amenities-icons";
import { useAuth } from "../providers/auth-provider";

type HostDetailsPanelProps = {
  host: AppProfile;
  onClose: () => void;
};

const defaultImages: HostGalleryImage[] = [
  {
    id: "default-1",
    url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop",
    alt: "Workspace",
  },
  {
    id: "default-2",
    url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
    alt: "Desk area",
  },
  {
    id: "default-3",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    alt: "Seating area",
  },
];

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, index) => {
    const filled = index < rating;

    return <Star key={index} className={cn("size-4", filled ? "fill-foreground text-foreground" : "text-muted-foreground")} />;
  });
}

function HostImageGallery({ images, title }: { images: HostGalleryImage[]; title: string }) {
  const normalizedImages = useMemo(() => {
    const base = images.length ? images : defaultImages;
    const padded = [...base];

    while (padded.length < 3) {
      padded.push({
        id: `placeholder-${padded.length + 1}`,
        url: "",
        alt: "",
      });
    }

    return padded.slice(0, 3);
  }, [images]);

  const selectableImages = normalizedImages.filter((image) => image.url);
  const [activeImageId, setActiveImageId] = useState(selectableImages[0]?.id ?? null);
  const activeImage = selectableImages.find((image) => image.id === activeImageId) ?? selectableImages[0] ?? null;

  return (
    <div className="grid gap-4 lg:grid-cols-[96px_minmax(0,1fr)] lg:h-[304px]">
      <div className="hidden lg:block">
        <div className="grid gap-2">
          {normalizedImages.map((image, index) => {
            if (!image.url) {
              return <div key={image.id} className="h-24 rounded-xl border border-transparent" aria-hidden="true" />;
            }

            const isActive = image.id === activeImage?.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImageId(image.id)}
                onMouseEnter={() => setActiveImageId(image.id)}
                className={cn(
                  "overflow-hidden rounded-xl border transition-all",
                  isActive ? "border-foreground ring-1 ring-foreground" : "border-border hover:border-foreground/30",
                )}
                aria-label={`Bild ${index + 1} anzeigen`}
              >
                <img src={image.url} alt={image.alt} className="h-24 w-full object-cover" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl bg-muted lg:h-[304px]">
          {activeImage ? (
            <Image src={activeImage.url} alt={activeImage.alt || title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 600px" priority />
          ) : null}
        </div>

        <div className="grid grid-cols-3 gap-2 lg:hidden">
          {selectableImages.map((image, index) => {
            const isActive = image.id === activeImage?.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImageId(image.id)}
                className={cn(
                  "overflow-hidden rounded-xl border transition-all",
                  isActive ? "border-foreground ring-1 ring-foreground" : "border-border hover:border-foreground/30",
                )}
                aria-label={`Bild ${index + 1} anzeigen`}
              >
                <div className="relative h-20 w-full">
                  <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="120px" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Reviews({ reviews }: { reviews: HostReviewData[] }) {
  if (!reviews.length) {
    return <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">Noch keine Reviews vorhanden.</div>;
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-2xl border p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">{review.author}</p>
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
                <span className="ml-1 text-xs text-muted-foreground">{review.date}</span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.text}</p>
        </div>
      ))}
    </div>
  );
}

function HostMetaRow({ host }: { host: AppProfile }) {
  const visibleAmenities = host.hostLocation?.amenities?.slice(0, 4) ?? [];

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
      <span>{host.hostProfile?.operatorName}</span>
      {visibleAmenities.length ? <span>·</span> : null}
      {visibleAmenities.map((amenity, index) => {
        const Icon = AMENITY_ICONS[amenity as keyof typeof AMENITY_ICONS];

        return (
          <div key={amenity} className="flex items-center gap-1.5">
            {Icon ? <Icon className="size-4" /> : null}
            <span className="capitalize">{amenity.replace("-", " ")}</span>
            {index !== visibleAmenities.length - 1 ? <span className="ml-1">·</span> : null}
          </div>
        );
      })}
    </div>
  );
}

export function HostDetailsPanel({ host, onClose }: HostDetailsPanelProps) {
  const images = host.hostContent?.gallery ?? [];
  const reviews = host.hostContent?.reviews ?? [];
  const { profile } = useAuth();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border bg-background">
      <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">{host.hostProfile?.locationName}</h2>
          <HostMetaRow host={host} />
        </div>

        <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Details schliessen" className="rounded-full">
          <X className="size-4" />
        </Button>
      </div>

      <div className="border-b px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Preis pro CoSpot Slot</p>
            <p className="text-xl font-semibold">CHF {host.hostSetup?.price ?? 0}</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="rounded-full sm:min-w-36">
              {profile ? <Link href={`/book/${host.uid}`}>Jetzt buchen</Link> : <Link href="/auth/sign-in">Anmelden</Link>}
            </Button>

            <Button size="lg" disabled={!profile} variant="outline" className="rounded-full sm:min-w-36">
              Anfrage
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
        <HostImageGallery key={host.uid} images={images} title={host.hostProfile?.locationName ?? "Host"} />

        <section className="space-y-2">
          <h3 className="text-lg font-semibold">Über diesen Spot</h3>
          <p className="text-sm leading-6 text-muted-foreground">{host.hostLocation?.description ?? "Keine Beschreibung vorhanden."}</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border p-4">
            <p className="text-sm text-muted-foreground">Adresse</p>
            <p className="mt-1 font-medium">
              {host.hostProfile?.address}
              {host.hostProfile?.city ? `, ${host.hostProfile.city}` : ""}
            </p>
          </div>

          <div className="rounded-2xl border p-4">
            <p className="text-sm text-muted-foreground">Verfügbarkeit</p>
            <p className="mt-1 font-medium">
              {host.hostAvailability?.from} – {host.hostAvailability?.to}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{host.hostAvailability?.days?.join(", ")}</p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border p-4">
            <p className="text-sm text-muted-foreground">Plätze</p>
            <p className="mt-1 text-2xl font-semibold">{host.hostSetup?.spots ?? 0}</p>
          </div>

          <div className="rounded-2xl border p-4">
            <p className="text-sm text-muted-foreground">Slot Dauer</p>
            <p className="mt-1 text-2xl font-semibold">{host.hostSetup?.slotDuration ?? "-"}</p>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Was dich erwartet</h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {host.hostLocation?.amenities?.map((amenity) => {
              const Icon = AMENITY_ICONS[amenity as keyof typeof AMENITY_ICONS];

              return (
                <div key={amenity} className="flex items-center gap-3 rounded-2xl border px-4 py-3">
                  {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
                  <span className="text-sm font-medium capitalize">{amenity.replace("-", " ")}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Bewertungen</h3>
            <p className="text-sm text-muted-foreground">Eindrücke von Gästen und Work Sessions.</p>
          </div>

          <Reviews reviews={reviews} />
        </section>

        {(host.hostLocation?.website || host.hostLocation?.instagram) && (
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Mehr erfahren</h3>

            <div className="flex flex-col gap-3 text-sm">
              {host.hostLocation.website ? (
                <a href={host.hostLocation.website} target="_blank" rel="noreferrer" className="rounded-2xl border px-4 py-3 transition-colors hover:bg-muted">
                  Website
                </a>
              ) : null}

              {host.hostLocation.instagram ? (
                <a
                  href={host.hostLocation.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border px-4 py-3 transition-colors hover:bg-muted"
                >
                  Instagram
                </a>
              ) : null}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
