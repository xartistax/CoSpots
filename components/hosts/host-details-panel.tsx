"use client";

import { useMemo, useState } from "react";
import { Star, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppProfile, HostGalleryImage, HostReviewData } from "@/types/user-profile";

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
              return <div key={image.id} className="h-24 rounded-lg border border-dashed border-transparent" aria-hidden="true" />;
            }

            const isActive = image.id === activeImage?.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImageId(image.id)}
                onMouseEnter={() => setActiveImageId(image.id)}
                className={cn(
                  "overflow-hidden rounded-lg border transition-all",
                  isActive ? "border-primary ring-2 ring-primary" : "border-border hover:border-foreground/20",
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
        <div className="overflow-hidden rounded-xl border lg:h-[304px]">
          {activeImage ? <img src={activeImage.url} alt={activeImage.alt || title} className="h-full w-full object-cover" /> : null}
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
                  "overflow-hidden rounded-lg border transition-all",
                  isActive ? "border-primary ring-2 ring-primary" : "border-border hover:border-foreground/20",
                )}
                aria-label={`Bild ${index + 1} anzeigen`}
              >
                <img src={image.url} alt={image.alt} className="h-20 w-full object-cover" />
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
    return <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">Noch keine Reviews vorhanden.</div>;
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-xl border p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{review.author}</p>
              <p className="text-xs text-muted-foreground">{review.date}</p>
            </div>

            <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">{review.text}</p>
        </div>
      ))}
    </div>
  );
}

export function HostDetailsPanel({ host, onClose }: HostDetailsPanelProps) {
  const images = host.hostContent?.gallery ?? [];
  const reviews = host.hostContent?.reviews ?? [];

  return (
    <div className="flex h-full flex-col rounded-xl border bg-background">
      <div className="flex items-start justify-between gap-4 border-b p-5">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">{host.hostProfile?.locationName}</h2>
          <p className="text-sm text-muted-foreground">{host.hostProfile?.operatorName}</p>
        </div>

        <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Details schliessen">
          <X className="size-4" />
        </Button>
      </div>

      <div className="border-b p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-sm text-muted-foreground">Preis pro Slot</p>
            <p className="text-lg font-semibold">CHF {host.hostSetup?.price ?? 0}</p>
          </div>

          <div className="flex gap-2">
            <Button size="lg">Jetzt buchen</Button>
            <Button variant="outline" size="lg">
              Anfrage
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <HostImageGallery key={host.uid} images={images} title={host.hostProfile?.locationName ?? "Host"} />

        <div className="space-y-1">
          <p className="text-sm font-medium">Adresse</p>
          <p className="text-sm text-muted-foreground">
            {host.hostProfile?.address}
            {host.hostProfile?.city ? `, ${host.hostProfile.city}` : ""}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Beschreibung</p>
          <p className="text-sm text-muted-foreground">{host.hostLocation?.description ?? "Keine Beschreibung vorhanden."}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Preis</p>
            <p className="mt-2 text-lg font-semibold">CHF {host.hostSetup?.price ?? 0}</p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Plätze</p>
            <p className="mt-2 text-lg font-semibold">{host.hostSetup?.spots ?? 0}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Verfügbarkeit</p>
          <p className="text-sm text-muted-foreground">{host.hostAvailability?.days?.join(", ")}</p>
          <p className="text-sm text-muted-foreground">
            {host.hostAvailability?.from} – {host.hostAvailability?.to}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Ausstattung</p>
          <div className="flex flex-wrap gap-2">
            {host.hostLocation?.amenities?.map((amenity) => (
              <span key={amenity} className="rounded-md border px-2 py-1 text-xs">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Reviews</p>
            <p className="text-sm text-muted-foreground">Eindrücke von Gästen und Work Sessions.</p>
          </div>

          <Reviews reviews={reviews} />
        </div>

        {(host.hostLocation?.website || host.hostLocation?.instagram) && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Links</p>

            <div className="flex flex-col gap-2 text-sm">
              {host.hostLocation.website ? (
                <a href={host.hostLocation.website} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
                  Website
                </a>
              ) : null}

              {host.hostLocation.instagram ? (
                <a href={host.hostLocation.instagram} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
                  Instagram
                </a>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
