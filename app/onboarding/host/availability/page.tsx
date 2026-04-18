"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock3, Repeat2, TimerReset } from "lucide-react";

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
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-muted-foreground" />
            <Label className="text-sm font-medium">{onboardingConfig.host.availability.fields.weekdayOptions.label}</Label>
          </div>

          <Controller
            control={control}
            name="days"
            render={({ field }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                {weekdayOptions.map((day) => {
                  const checked = field.value.includes(day.id);

                  return (
                    <label
                      key={day.id}
                      htmlFor={day.id}
                      className="flex items-center gap-3 rounded-[20px] border p-4 transition hover:border-foreground/20 hover:bg-muted/30"
                    >
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
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Clock3 className="size-4 text-muted-foreground" />
              <Label htmlFor={onboardingConfig.host.availability.fields.from.id} className="text-sm font-medium">
                {onboardingConfig.host.availability.fields.from.label}
              </Label>
            </div>

            <Input
              id={onboardingConfig.host.availability.fields.from.id}
              type="time"
              className={["h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.from ? "border-destructive" : ""].join(" ")}
              {...register("from")}
            />

            {errors.from ? <p className="text-sm text-destructive">{errors.from.message}</p> : null}
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Clock3 className="size-4 text-muted-foreground" />
              <Label htmlFor={onboardingConfig.host.availability.fields.to.id} className="text-sm font-medium">
                {onboardingConfig.host.availability.fields.to.label}
              </Label>
            </div>

            <Input
              id={onboardingConfig.host.availability.fields.to.id}
              type="time"
              className={["h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.to ? "border-destructive" : ""].join(" ")}
              {...register("to")}
            />

            {errors.to ? <p className="text-sm text-destructive">{errors.to.message}</p> : null}
          </div>
        </div>

        <div className="rounded-[24px] border p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted">
                <Repeat2 className="size-4" />
              </div>

              <div className="space-y-1">
                <Label htmlFor={onboardingConfig.host.availability.fields.recurring.id} className="text-sm font-medium">
                  {onboardingConfig.host.availability.fields.recurring.label}
                </Label>
                <p className="text-sm leading-6 text-muted-foreground">{onboardingConfig.host.availability.fields.recurring.description}</p>
              </div>
            </div>

            <Controller
              control={control}
              name="recurring"
              render={({ field }) => (
                <Switch id={onboardingConfig.host.availability.fields.recurring.id} checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <TimerReset className="size-4 text-muted-foreground" />
              <Label htmlFor={onboardingConfig.host.availability.fields.gracePeriod.id} className="text-sm font-medium">
                {onboardingConfig.host.availability.fields.gracePeriod.label}
              </Label>
            </div>

            <Input
              id={onboardingConfig.host.availability.fields.gracePeriod.id}
              type="number"
              min={0}
              step={1}
              placeholder={onboardingConfig.host.availability.fields.gracePeriod.placeholder}
              className={["h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.gracePeriod ? "border-destructive" : ""].join(" ")}
              {...register("gracePeriod", { valueAsNumber: true })}
            />

            {errors.gracePeriod ? <p className="text-sm text-destructive">{errors.gracePeriod.message}</p> : null}
          </div>

          <div className="rounded-[24px] border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Label htmlFor={onboardingConfig.host.availability.fields.extend.id} className="text-sm font-medium">
                  {onboardingConfig.host.availability.fields.extend.label}
                </Label>
                <p className="text-sm leading-6 text-muted-foreground">{onboardingConfig.host.availability.fields.extend.description}</p>
              </div>

              <Controller
                control={control}
                name="extendAllowed"
                render={({ field }) => (
                  <Switch id={onboardingConfig.host.availability.fields.extend.id} checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          </div>
        </div>

        {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="h-12 w-full rounded-2xl text-sm font-medium" disabled={isSubmitting}>
          {onboardingConfig.host.availability.cta.submit}
        </Button>
      </form>
    </OnboardingShell>
  );
}
