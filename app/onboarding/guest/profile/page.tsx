"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Globe, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingShell } from "../../onboarding-shell";
import { onboardingConfig } from "@/lib/config/onboarding";
import { industryOptions, purposeOptions } from "@/lib/constants/onboarding";
import { useAuth } from "@/components/providers/auth-provider";
import { saveGuestProfile } from "@/lib/firebase/user-profile";
import { guestProfileSchema, type GuestProfileFormValues } from "@/lib/validation/guest-profile";

function toNullableString(value: string): string | null {
  const normalized = value.trim();
  return normalized === "" ? null : normalized;
}

export default function GuestProfilePage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<GuestProfileFormValues>({
    resolver: zodResolver(guestProfileSchema),
    defaultValues: {
      industry: "",
      purpose: "",
      networking: false,
      bio: "",
      linkedin: "",
      website: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

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
      await saveGuestProfile({
        uid: firebaseUser.uid,
        guestProfile: {
          industry: values.industry.trim(),
          networking: values.networking,
          purpose: values.purpose.trim(),
          bio: values.bio.trim(),
          linkedin: toNullableString(values.linkedin),
          website: toNullableString(values.website),
        },
      });

      router.push("/onboarding/guest/preferences");
    } catch (error) {
      console.error("Guest profile step error:", error);
      setError("root", {
        type: "manual",
        message: "Profil konnte nicht gespeichert werden",
      });
    }
  });

  return (
    <OnboardingShell
      title={onboardingConfig.guest.profile.title}
      description={onboardingConfig.guest.profile.description}
      step={onboardingConfig.guest.profile.step}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="space-y-2.5">
          <Label htmlFor={onboardingConfig.guest.profile.fields.industry.id} className="text-sm font-medium">
            {onboardingConfig.guest.profile.fields.industry.label}
          </Label>

          <Controller
            control={control}
            name="industry"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id={onboardingConfig.guest.profile.fields.industry.id}
                  className={["h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.industry ? "border-destructive" : ""].join(" ")}
                >
                  <SelectValue placeholder={onboardingConfig.guest.profile.fields.industry.placeholder} />
                </SelectTrigger>

                <SelectContent className="rounded-2xl">
                  {industryOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.industry ? <p className="text-sm text-destructive">{errors.industry.message}</p> : null}
        </div>

        <div className="rounded-[24px] border p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted">
                <Users className="size-4" />
              </div>

              <div className="space-y-1">
                <Label htmlFor={onboardingConfig.guest.profile.fields.networking.id} className="text-sm font-medium">
                  {onboardingConfig.guest.profile.fields.networking.label}
                </Label>
                <p className="text-sm leading-6 text-muted-foreground">{onboardingConfig.guest.profile.fields.networking.description}</p>
              </div>
            </div>

            <Controller
              control={control}
              name="networking"
              render={({ field }) => <Switch id={onboardingConfig.guest.profile.fields.networking.id} checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor={onboardingConfig.guest.profile.fields.purpose.id} className="text-sm font-medium">
            {onboardingConfig.guest.profile.fields.purpose.label}
          </Label>

          <Controller
            control={control}
            name="purpose"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id={onboardingConfig.guest.profile.fields.purpose.id}
                  className={["h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.purpose ? "border-destructive" : ""].join(" ")}
                >
                  <SelectValue placeholder={onboardingConfig.guest.profile.fields.purpose.placeholder} />
                </SelectTrigger>

                <SelectContent className="rounded-2xl">
                  {purposeOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.purpose ? <p className="text-sm text-destructive">{errors.purpose.message}</p> : null}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={onboardingConfig.guest.profile.fields.bio.id} className="text-sm font-medium">
              {onboardingConfig.guest.profile.fields.bio.label}
            </Label>
            <span className="text-xs text-muted-foreground">Kurz und ehrlich</span>
          </div>

          <div className="relative">
            <Sparkles className="pointer-events-none absolute left-4 top-4 size-4 text-muted-foreground" />
            <Textarea
              id={onboardingConfig.guest.profile.fields.bio.id}
              placeholder={onboardingConfig.guest.profile.fields.bio.placeholder}
              className={["min-h-32 rounded-2xl border-border/80 pl-11 pr-4 pt-3 shadow-none", errors.bio ? "border-destructive" : ""].join(" ")}
              {...register("bio")}
            />
          </div>

          {errors.bio ? <p className="text-sm text-destructive">{errors.bio.message}</p> : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2.5">
            <Label htmlFor={onboardingConfig.guest.profile.fields.linkedin.id} className="text-sm font-medium">
              {onboardingConfig.guest.profile.fields.linkedin.label}
            </Label>

            <div className="relative">
              <Link className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={onboardingConfig.guest.profile.fields.linkedin.id}
                placeholder={onboardingConfig.guest.profile.fields.linkedin.placeholder}
                className={["h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none", errors.linkedin ? "border-destructive" : ""].join(" ")}
                {...register("linkedin")}
              />
            </div>

            {errors.linkedin ? <p className="text-sm text-destructive">{errors.linkedin.message}</p> : null}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={onboardingConfig.guest.profile.fields.website.id} className="text-sm font-medium">
              {onboardingConfig.guest.profile.fields.website.label}
            </Label>

            <div className="relative">
              <Globe className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={onboardingConfig.guest.profile.fields.website.id}
                placeholder={onboardingConfig.guest.profile.fields.website.placeholder}
                className={["h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none", errors.website ? "border-destructive" : ""].join(" ")}
                {...register("website")}
              />
            </div>

            {errors.website ? <p className="text-sm text-destructive">{errors.website.message}</p> : null}
          </div>
        </div>

        {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="h-12 w-full rounded-2xl text-sm font-medium" disabled={isSubmitting}>
          {onboardingConfig.guest.profile.cta.submit}
        </Button>
      </form>
    </OnboardingShell>
  );
}
