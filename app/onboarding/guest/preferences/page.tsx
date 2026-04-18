"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock3, MapPin, Sparkles } from "lucide-react";

import { OnboardingShell } from "@/app/onboarding/onboarding-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onboardingConfig } from "@/lib/config/onboarding";
import { saveGuestPreferences } from "@/lib/firebase/user-profile";
import { preferenceOptions, timeOptions } from "@/lib/constants/onboarding";
import { guestPreferencesSchema, type GuestPreferencesFormValues } from "@/lib/validation/guest-preferences";

export default function GuestPreferencesPage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<GuestPreferencesFormValues>({
    resolver: zodResolver(guestPreferencesSchema),
    defaultValues: {
      city: "",
      times: [],
      important: [],
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
      await saveGuestPreferences({
        uid: firebaseUser.uid,
        guestPreferences: {
          city: values.city.trim(),
          times: values.times,
          important: values.important,
        },
      });

      router.push("/onboarding/guest/rules");
    } catch (error) {
      console.error("Guest preferences step error:", error);
      setError("root", {
        type: "manual",
        message: "Präferenzen konnten nicht gespeichert werden",
      });
    }
  });

  return (
    <OnboardingShell
      title={onboardingConfig.guest.preferences.title}
      description={onboardingConfig.guest.preferences.description}
      step={onboardingConfig.guest.preferences.step}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="space-y-2.5">
          <Label htmlFor={onboardingConfig.guest.preferences.fields.city.id} className="text-sm font-medium">
            {onboardingConfig.guest.preferences.fields.city.label}
          </Label>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={onboardingConfig.guest.preferences.fields.city.id}
              placeholder={onboardingConfig.guest.preferences.fields.city.placeholder}
              className="h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none"
              {...register("city")}
            />
          </div>

          {errors.city ? <p className="text-sm text-destructive">{errors.city.message}</p> : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-muted-foreground" />
            <Label className="text-sm font-medium">{onboardingConfig.guest.preferences.time.label}</Label>
          </div>

          <Controller
            control={control}
            name="times"
            render={({ field }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                {timeOptions.map((option) => {
                  const checked = field.value.includes(option.id);

                  return (
                    <label
                      key={option.id}
                      htmlFor={option.id}
                      className="flex items-center gap-3 rounded-[20px] border p-4 transition hover:border-foreground/20 hover:bg-muted/30"
                    >
                      <Checkbox
                        id={option.id}
                        checked={checked}
                        onCheckedChange={(nextChecked) => {
                          if (nextChecked) {
                            field.onChange([...field.value, option.id]);
                            return;
                          }

                          field.onChange(field.value.filter((value) => value !== option.id));
                        }}
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />

          {errors.times ? <p className="text-sm text-destructive">{errors.times.message}</p> : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-muted-foreground" />
            <Label className="text-sm font-medium">{onboardingConfig.guest.preferences.important.label}</Label>
          </div>

          <Controller
            control={control}
            name="important"
            render={({ field }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                {preferenceOptions.map((option) => {
                  const checked = field.value.includes(option.id);

                  return (
                    <label
                      key={option.id}
                      htmlFor={option.id}
                      className="flex items-center gap-3 rounded-[20px] border p-4 transition hover:border-foreground/20 hover:bg-muted/30"
                    >
                      <Checkbox
                        id={option.id}
                        checked={checked}
                        onCheckedChange={(nextChecked) => {
                          if (nextChecked) {
                            field.onChange([...field.value, option.id]);
                            return;
                          }

                          field.onChange(field.value.filter((value) => value !== option.id));
                        }}
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />

          {errors.important ? <p className="text-sm text-destructive">{errors.important.message}</p> : null}
        </div>

        {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="h-12 w-full rounded-2xl text-sm font-medium" disabled={isSubmitting}>
          {onboardingConfig.guest.preferences.cta.submit}
        </Button>
      </form>
    </OnboardingShell>
  );
}
