"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { OnboardingShell } from "../../onboarding-shell";
import { weekdayOptions } from "@/lib/constants/onboarding";
import { onboardingConfig } from "@/lib/config/onboarding";
import { useAuth } from "@/components/providers/auth-provider";
import { saveHostAvailability } from "@/lib/firebase/user-profile";
import { hostAvailabilitySchema, type HostAvailabilityFormInput, type HostAvailabilityFormValues } from "@/lib/validation/host-availability";

export default function HostAvailabilityPage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<HostAvailabilityFormInput, unknown, HostAvailabilityFormValues>({
    resolver: zodResolver(hostAvailabilitySchema),
    defaultValues: {
      days: [],
      from: "",
      to: "",
      recurring: false,
      gracePeriod: 0,
      extendAllowed: false,
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
      await saveHostAvailability({
        uid: firebaseUser.uid,
        hostAvailability: {
          days: values.days,
          from: values.from,
          to: values.to,
          recurring: values.recurring,
          gracePeriod: values.gracePeriod,
          extendAllowed: values.extendAllowed,
        },
      });

      router.push("/onboarding/host/rules");
    } catch (error) {
      console.error("Host availability step error:", error);
      setError("root", {
        type: "manual",
        message: "Verfügbarkeit konnte nicht gespeichert werden",
      });
    }
  });

  return (
    <OnboardingShell
      title={onboardingConfig.host.availability.title}
      description={onboardingConfig.host.availability.description}
      step={onboardingConfig.host.availability.step}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label>{onboardingConfig.host.availability.fields.weekdayOptions.label}</Label>

          <Controller
            control={control}
            name="days"
            render={({ field }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                {weekdayOptions.map((day) => {
                  const checked = field.value.includes(day.id);

                  return (
                    <label key={day.id} htmlFor={day.id} className="flex items-center gap-3 rounded-lg border p-4">
                      <Checkbox
                        id={day.id}
                        checked={checked}
                        onCheckedChange={(nextChecked) => {
                          if (nextChecked) {
                            field.onChange([...field.value, day.id]);
                            return;
                          }

                          field.onChange(field.value.filter((value) => value !== day.id));
                        }}
                      />
                      <span className="text-sm font-medium">{day.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />

          {errors.days ? <p className="text-sm text-destructive">{errors.days.message}</p> : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.host.availability.fields.from.id}>{onboardingConfig.host.availability.fields.from.label}</Label>
            <Input
              id={onboardingConfig.host.availability.fields.from.id}
              type="time"
              className={errors.from ? "border-destructive" : ""}
              {...register("from")}
            />
            {errors.from ? <p className="text-sm text-destructive">{errors.from.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.host.availability.fields.to.id}>{onboardingConfig.host.availability.fields.to.label}</Label>
            <Input id={onboardingConfig.host.availability.fields.to.id} type="time" className={errors.to ? "border-destructive" : ""} {...register("to")} />
            {errors.to ? <p className="text-sm text-destructive">{errors.to.message}</p> : null}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <Label htmlFor={onboardingConfig.host.availability.fields.recurring.id}>{onboardingConfig.host.availability.fields.recurring.label}</Label>
            <p className="text-sm text-muted-foreground">{onboardingConfig.host.availability.fields.recurring.description}</p>
          </div>

          <Controller
            control={control}
            name="recurring"
            render={({ field }) => (
              <Switch id={onboardingConfig.host.availability.fields.recurring.id} checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.host.availability.fields.gracePeriod.id}>{onboardingConfig.host.availability.fields.gracePeriod.label}</Label>
            <Input
              id={onboardingConfig.host.availability.fields.gracePeriod.id}
              type="number"
              min={0}
              step={1}
              placeholder={onboardingConfig.host.availability.fields.gracePeriod.placeholder}
              className={errors.gracePeriod ? "border-destructive" : ""}
              {...register("gracePeriod", { valueAsNumber: true })}
            />
            {errors.gracePeriod ? <p className="text-sm text-destructive">{errors.gracePeriod.message}</p> : null}
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <Label htmlFor={onboardingConfig.host.availability.fields.extend.id}>{onboardingConfig.host.availability.fields.extend.label}</Label>
              <p className="text-sm text-muted-foreground">{onboardingConfig.host.availability.fields.extend.description}</p>
            </div>

            <Controller
              control={control}
              name="extendAllowed"
              render={({ field }) => <Switch id={onboardingConfig.host.availability.fields.extend.id} checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>
        </div>

        {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {onboardingConfig.host.availability.cta.submit}
        </Button>
      </form>
    </OnboardingShell>
  );
}
