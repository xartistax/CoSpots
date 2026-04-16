"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor={onboardingConfig.guest.profile.fields.industry.id}>{onboardingConfig.guest.profile.fields.industry.label}</Label>

          <Controller
            control={control}
            name="industry"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={onboardingConfig.guest.profile.fields.industry.id} className={errors.industry ? "border-destructive" : ""}>
                  <SelectValue placeholder={onboardingConfig.guest.profile.fields.industry.placeholder} />
                </SelectTrigger>

                <SelectContent>
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

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <Label htmlFor={onboardingConfig.guest.profile.fields.networking.id}>{onboardingConfig.guest.profile.fields.networking.label}</Label>
            <p className="text-sm text-muted-foreground">{onboardingConfig.guest.profile.fields.networking.description}</p>
          </div>

          <Controller
            control={control}
            name="networking"
            render={({ field }) => <Switch id={onboardingConfig.guest.profile.fields.networking.id} checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={onboardingConfig.guest.profile.fields.purpose.id}>{onboardingConfig.guest.profile.fields.purpose.label}</Label>

          <Controller
            control={control}
            name="purpose"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={onboardingConfig.guest.profile.fields.purpose.id} className={errors.purpose ? "border-destructive" : ""}>
                  <SelectValue placeholder={onboardingConfig.guest.profile.fields.purpose.placeholder} />
                </SelectTrigger>

                <SelectContent>
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

        <div className="flex flex-col gap-2">
          <Label htmlFor={onboardingConfig.guest.profile.fields.bio.id}>{onboardingConfig.guest.profile.fields.bio.label}</Label>
          <Textarea
            id={onboardingConfig.guest.profile.fields.bio.id}
            placeholder={onboardingConfig.guest.profile.fields.bio.placeholder}
            className={errors.bio ? "border-destructive" : ""}
            {...register("bio")}
          />
          {errors.bio ? <p className="text-sm text-destructive">{errors.bio.message}</p> : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.guest.profile.fields.linkedin.id}>{onboardingConfig.guest.profile.fields.linkedin.label}</Label>
            <Input
              id={onboardingConfig.guest.profile.fields.linkedin.id}
              placeholder={onboardingConfig.guest.profile.fields.linkedin.placeholder}
              className={errors.linkedin ? "border-destructive" : ""}
              {...register("linkedin")}
            />
            {errors.linkedin ? <p className="text-sm text-destructive">{errors.linkedin.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.guest.profile.fields.website.id}>{onboardingConfig.guest.profile.fields.website.label}</Label>
            <Input
              id={onboardingConfig.guest.profile.fields.website.id}
              placeholder={onboardingConfig.guest.profile.fields.website.placeholder}
              className={errors.website ? "border-destructive" : ""}
              {...register("website")}
            />
            {errors.website ? <p className="text-sm text-destructive">{errors.website.message}</p> : null}
          </div>
        </div>

        {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {onboardingConfig.guest.profile.cta.submit}
        </Button>
      </form>
    </OnboardingShell>
  );
}
