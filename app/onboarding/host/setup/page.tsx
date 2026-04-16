"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingShell } from "../../onboarding-shell";
import { onboardingConfig } from "@/lib/config/onboarding";
import { slotDurationOptions, yesNoOptions } from "@/lib/constants/onboarding";
import { useAuth } from "@/components/providers/auth-provider";
import { saveHostSetup } from "@/lib/firebase/user-profile";
import { hostSetupSchema, type HostSetupFormValues } from "@/lib/validation/host-setup";

function parseYesNo(value: string): boolean {
  return value === "yes";
}

function formatYesNo(value: boolean): string {
  return value ? "yes" : "no";
}

export default function HostSetupPage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<HostSetupFormValues>({
    resolver: zodResolver(hostSetupSchema),
    defaultValues: {
      spots: 1,
      price: 0,
      marked: false,
      laptopZoneOnly: false,
      slotDuration: "",
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
      await saveHostSetup({
        uid: firebaseUser.uid,
        hostSetup: {
          spots: values.spots,
          price: values.price,
          marked: values.marked,
          laptopZoneOnly: values.laptopZoneOnly,
          slotDuration: values.slotDuration,
        },
      });

      router.push("/onboarding/host/availability");
    } catch (error) {
      console.error("Host setup step error:", error);
      setError("root", {
        type: "manual",
        message: "Setup konnte nicht gespeichert werden",
      });
    }
  });

  return (
    <OnboardingShell title={onboardingConfig.host.setup.title} description={onboardingConfig.host.setup.description} step={onboardingConfig.host.setup.step}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.host.setup.fields.spots.id}>{onboardingConfig.host.setup.fields.spots.label}</Label>
            <Input
              id={onboardingConfig.host.setup.fields.spots.id}
              type="number"
              min={1}
              step={1}
              placeholder={onboardingConfig.host.setup.fields.spots.placeholder}
              className={errors.spots ? "border-destructive" : ""}
              {...register("spots", { valueAsNumber: true })}
            />
            {errors.spots ? <p className="text-sm text-destructive">{errors.spots.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.host.setup.fields.price.id}>{onboardingConfig.host.setup.fields.price.label}</Label>
            <Input
              id={onboardingConfig.host.setup.fields.price.id}
              type="number"
              min={0}
              step={0.01}
              placeholder={onboardingConfig.host.setup.fields.price.placeholder}
              className={errors.price ? "border-destructive" : ""}
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price ? <p className="text-sm text-destructive">{errors.price.message}</p> : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.host.setup.fields.marked.id}>{onboardingConfig.host.setup.fields.marked.label}</Label>

            <Controller
              control={control}
              name="marked"
              render={({ field }) => (
                <Select value={formatYesNo(field.value)} onValueChange={(value) => field.onChange(parseYesNo(value))}>
                  <SelectTrigger id={onboardingConfig.host.setup.fields.marked.id} className={errors.marked ? "border-destructive" : ""}>
                    <SelectValue placeholder="Bitte wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {yesNoOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.marked ? <p className="text-sm text-destructive">{errors.marked.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.host.setup.fields.laptopZone.id}>{onboardingConfig.host.setup.fields.laptopZone.label}</Label>

            <Controller
              control={control}
              name="laptopZoneOnly"
              render={({ field }) => (
                <Select value={formatYesNo(field.value)} onValueChange={(value) => field.onChange(parseYesNo(value))}>
                  <SelectTrigger id={onboardingConfig.host.setup.fields.laptopZone.id} className={errors.laptopZoneOnly ? "border-destructive" : ""}>
                    <SelectValue placeholder="Bitte wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {yesNoOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.laptopZoneOnly ? <p className="text-sm text-destructive">{errors.laptopZoneOnly.message}</p> : null}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={onboardingConfig.host.setup.fields.slotDuration.id}>{onboardingConfig.host.setup.fields.slotDuration.label}</Label>

          <Controller
            control={control}
            name="slotDuration"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={onboardingConfig.host.setup.fields.slotDuration.id} className={errors.slotDuration ? "border-destructive" : ""}>
                  <SelectValue placeholder="Dauer wählen" />
                </SelectTrigger>
                <SelectContent>
                  {slotDurationOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.slotDuration ? <p className="text-sm text-destructive">{errors.slotDuration.message}</p> : null}
        </div>

        {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {onboardingConfig.host.setup.cta.submit}
        </Button>
      </form>
    </OnboardingShell>
  );
}
