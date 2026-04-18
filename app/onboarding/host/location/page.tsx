"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, ImageIcon, Link as LucideLink, MapPinned, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingShell } from "../../onboarding-shell";
import { onboardingConfig } from "@/lib/config/onboarding";
import { locationAmenityOptions, locationCategoryOptions } from "@/lib/constants/onboarding";
import { useAuth } from "@/components/providers/auth-provider";
import { saveHostContent, saveHostLocation } from "@/lib/firebase/user-profile";
import { hostLocationSchema, type HostLocationFormValues } from "@/lib/validation/host-location";

export default function HostLocationPage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    clearErrors,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HostLocationFormValues>({
    resolver: zodResolver(hostLocationSchema),
    defaultValues: {
      category: "",
      description: "",
      website: "",
      instagram: "",
      amenities: [],
      gallery: [
        { url: "", alt: "" },
        { url: "", alt: "" },
        { url: "", alt: "" },
      ],
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const gallery = watch("gallery");

  const onSubmit = handleSubmit(async (values) => {
    if (!firebaseUser) {
      setError("root", {
        type: "manual",
        message: "Nicht eingeloggt",
      });
      return;
    }

    clearErrors("root");

    try {
      await saveHostLocation({
        uid: firebaseUser.uid,
        hostLocation: {
          category: values.category.trim(),
          description: values.description.trim(),
          website: values.website.trim(),
          instagram: values.instagram.trim(),
          amenities: values.amenities,
        },
      });

      await saveHostContent({
        uid: firebaseUser.uid,
        hostContent: {
          gallery: values.gallery
            .map((image, index) => ({
              id: `${firebaseUser.uid}-image-${index + 1}`,
              url: image.url.trim(),
              alt: image.alt.trim() || `Host Bild ${index + 1}`,
            }))
            .filter((image) => image.url),
          reviews: [],
        },
      });

      router.push("/onboarding/host/setup");
    } catch (error) {
      console.error("Host location step error:", error);
      setError("root", {
        type: "manual",
        message: "Location konnte nicht gespeichert werden",
      });
    }
  });

  return (
    <OnboardingShell
      title={onboardingConfig.host.location.title}
      description={onboardingConfig.host.location.description}
      step={onboardingConfig.host.location.step}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="space-y-2.5">
          <Label htmlFor={onboardingConfig.host.location.fields.category.id} className="text-sm font-medium">
            {onboardingConfig.host.location.fields.category.label}
          </Label>

          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id={onboardingConfig.host.location.fields.category.id}
                  className={["h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.category ? "border-destructive" : ""].join(" ")}
                >
                  <SelectValue placeholder={onboardingConfig.host.location.fields.category.placeholder} />
                </SelectTrigger>

                <SelectContent className="rounded-2xl">
                  {locationCategoryOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.category ? <p className="text-sm text-destructive">{errors.category.message}</p> : null}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={onboardingConfig.host.location.fields.description.id} className="text-sm font-medium">
              {onboardingConfig.host.location.fields.description.label}
            </Label>
            <span className="text-xs text-muted-foreground">Zeig die Atmosphäre</span>
          </div>

          <div className="relative">
            <Sparkles className="pointer-events-none absolute left-4 top-4 size-4 text-muted-foreground" />
            <Textarea
              id={onboardingConfig.host.location.fields.description.id}
              placeholder={onboardingConfig.host.location.fields.description.placeholder}
              className={["min-h-32 rounded-2xl border-border/80 pl-11 pr-4 pt-3 shadow-none", errors.description ? "border-destructive" : ""].join(" ")}
              {...register("description")}
            />
          </div>

          {errors.description ? <p className="text-sm text-destructive">{errors.description.message}</p> : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2.5">
            <Label htmlFor={onboardingConfig.host.location.fields.website.id} className="text-sm font-medium">
              {onboardingConfig.host.location.fields.website.label}
            </Label>

            <div className="relative">
              <Globe className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={onboardingConfig.host.location.fields.website.id}
                placeholder={onboardingConfig.host.location.fields.website.placeholder}
                className={["h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none", errors.website ? "border-destructive" : ""].join(" ")}
                {...register("website")}
              />
            </div>

            {errors.website ? <p className="text-sm text-destructive">{errors.website.message}</p> : null}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={onboardingConfig.host.location.fields.instagram.id} className="text-sm font-medium">
              {onboardingConfig.host.location.fields.instagram.label}
            </Label>

            <div className="relative">
              <LucideLink className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={onboardingConfig.host.location.fields.instagram.id}
                placeholder={onboardingConfig.host.location.fields.instagram.placeholder}
                className={["h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none", errors.instagram ? "border-destructive" : ""].join(" ")}
                {...register("instagram")}
              />
            </div>

            {errors.instagram ? <p className="text-sm text-destructive">{errors.instagram.message}</p> : null}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPinned className="size-4 text-muted-foreground" />
            <Label className="text-sm font-medium">{onboardingConfig.host.location.fields.locationAmenityOptions.label}</Label>
          </div>

          <Controller
            control={control}
            name="amenities"
            render={({ field }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                {locationAmenityOptions.map((item) => {
                  const checked = field.value.includes(item.id);

                  return (
                    <label
                      key={item.id}
                      htmlFor={item.id}
                      className="flex items-center gap-3 rounded-[20px] border p-4 transition hover:border-foreground/20 hover:bg-muted/30"
                    >
                      <Checkbox
                        id={item.id}
                        checked={checked}
                        onCheckedChange={(nextChecked) => {
                          if (nextChecked) {
                            field.onChange([...field.value, item.id]);
                            return;
                          }

                          field.onChange(field.value.filter((value) => value !== item.id));
                        }}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />

          {errors.amenities ? <p className="text-sm text-destructive">{errors.amenities.message}</p> : null}
        </div>

        <div className="space-y-4 rounded-[24px] border p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted">
              <ImageIcon className="size-4" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Galerie</h3>
              <p className="text-sm leading-6 text-muted-foreground">Füge bis zu 3 Bilder für deinen Spot hinzu.</p>
            </div>
          </div>

          <div className="grid gap-5">
            {gallery.map((image, index) => (
              <div key={`gallery-${index}`} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <Label className="text-sm font-medium">Bild {index + 1} URL</Label>
                    <Input
                      placeholder="https://..."
                      className={["h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.gallery?.[index]?.url ? "border-destructive" : ""].join(" ")}
                      {...register(`gallery.${index}.url`)}
                    />
                    {errors.gallery?.[index]?.url ? <p className="text-sm text-destructive">{errors.gallery[index]?.url?.message}</p> : null}
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-sm font-medium">Bild {index + 1} Alt-Text</Label>
                    <Input
                      placeholder={`Host Bild ${index + 1}`}
                      className={["h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.gallery?.[index]?.alt ? "border-destructive" : ""].join(" ")}
                      {...register(`gallery.${index}.alt`)}
                    />
                    {errors.gallery?.[index]?.alt ? <p className="text-sm text-destructive">{errors.gallery[index]?.alt?.message}</p> : null}
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-muted">
                  {image?.url ? (
                    <img src={image.url} alt={image.alt || `Host Bild ${index + 1}`} className="h-48 w-full object-cover" />
                  ) : (
                    <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">Kein Bild</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="h-12 w-full rounded-2xl text-sm font-medium" disabled={isSubmitting}>
          {onboardingConfig.host.location.cta.submit}
        </Button>
      </form>
    </OnboardingShell>
  );
}
