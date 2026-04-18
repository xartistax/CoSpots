"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Clock3, Laptop, MapPinned, Users } from "lucide-react";

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
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2.5">
            <Label htmlFor={onboardingConfig.host.setup.fields.spots.id} className="text-sm font-medium">
              {onboardingConfig.host.setup.fields.spots.label}
            </Label>

            <div className="relative">
              <Users className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={onboardingConfig.host.setup.fields.spots.id}
                type="number"
                min={1}
                step={1}
                placeholder={onboardingConfig.host.setup.fields.spots.placeholder}
                className={["h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none", errors.spots ? "border-destructive" : ""].join(" ")}
                {...register("spots", { valueAsNumber: true })}
              />
            </div>

            {errors.spots ? <p className="text-sm text-destructive">{errors.spots.message}</p> : null}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={onboardingConfig.host.setup.fields.price.id} className="text-sm font-medium">
              {onboardingConfig.host.setup.fields.price.label}
            </Label>

            <div className="relative">
              <Banknote className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={onboardingConfig.host.setup.fields.price.id}
                type="number"
                min={0}
                step={0.01}
                placeholder={onboardingConfig.host.setup.fields.price.placeholder}
                className={["h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none", errors.price ? "border-destructive" : ""].join(" ")}
                {...register("price", { valueAsNumber: true })}
              />
            </div>

            {errors.price ? <p className="text-sm text-destructive">{errors.price.message}</p> : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2.5">
            <Label htmlFor={onboardingConfig.host.setup.fields.marked.id} className="text-sm font-medium">
              {onboardingConfig.host.setup.fields.marked.label}
            </Label>

            <Controller
              control={control}
              name="marked"
              render={({ field }) => (
                <Select value={formatYesNo(field.value)} onValueChange={(value) => field.onChange(parseYesNo(value))}>
                  <SelectTrigger
                    id={onboardingConfig.host.setup.fields.marked.id}
                    className={["h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.marked ? "border-destructive" : ""].join(" ")}
                  >
                    <SelectValue placeholder="Bitte wählen" />
                  </SelectTrigger>

                  <SelectContent className="rounded-2xl">
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

          <div className="space-y-2.5">
            <Label htmlFor={onboardingConfig.host.setup.fields.laptopZone.id} className="text-sm font-medium">
              {onboardingConfig.host.setup.fields.laptopZone.label}
            </Label>

            <Controller
              control={control}
              name="laptopZoneOnly"
              render={({ field }) => (
                <Select value={formatYesNo(field.value)} onValueChange={(value) => field.onChange(parseYesNo(value))}>
                  <SelectTrigger
                    id={onboardingConfig.host.setup.fields.laptopZone.id}
                    className={["h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.laptopZoneOnly ? "border-destructive" : ""].join(" ")}
                  >
                    <SelectValue placeholder="Bitte wählen" />
                  </SelectTrigger>

                  <SelectContent className="rounded-2xl">
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

        <div className="rounded-[24px] border p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted">
              <MapPinned className="size-4" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Spot-Einstellungen</p>
              <p className="text-sm leading-6 text-muted-foreground">Lege fest, wie dein CoSpot genutzt wird und wie lange ein Slot dauert.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Laptop className="size-4 text-muted-foreground" />
                <Label className="text-sm font-medium">{onboardingConfig.host.setup.fields.laptopZone.label}</Label>
              </div>

              <Controller
                control={control}
                name="laptopZoneOnly"
                render={({ field }) => (
                  <Select value={formatYesNo(field.value)} onValueChange={(value) => field.onChange(parseYesNo(value))}>
                    <SelectTrigger
                      className={["h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.laptopZoneOnly ? "border-destructive" : ""].join(" ")}
                    >
                      <SelectValue placeholder="Bitte wählen" />
                    </SelectTrigger>

                    <SelectContent className="rounded-2xl">
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

            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Clock3 className="size-4 text-muted-foreground" />
                <Label htmlFor={onboardingConfig.host.setup.fields.slotDuration.id} className="text-sm font-medium">
                  {onboardingConfig.host.setup.fields.slotDuration.label}
                </Label>
              </div>

              <Controller
                control={control}
                name="slotDuration"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id={onboardingConfig.host.setup.fields.slotDuration.id}
                      className={["h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.slotDuration ? "border-destructive" : ""].join(" ")}
                    >
                      <SelectValue placeholder="Dauer wählen" />
                    </SelectTrigger>

                    <SelectContent className="rounded-2xl">
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
          </div>
        </div>

        {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="h-12 w-full rounded-2xl text-sm font-medium" disabled={isSubmitting}>
          {onboardingConfig.host.setup.cta.submit}
        </Button>
      </form>
    </OnboardingShell>
  );
}
