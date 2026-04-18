"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingShell } from "../../onboarding-shell";
import { onboardingConfig } from "@/lib/config/onboarding";
import { useAuth } from "@/components/providers/auth-provider";
import { saveHostProfile } from "@/lib/firebase/user-profile";
import { hostProfileSchema, type HostProfileFormValues } from "@/lib/validation/host-profile";

export default function HostProfilePage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<HostProfileFormValues>({
    resolver: zodResolver(hostProfileSchema),
    defaultValues: {
      operatorName: "",
      phone: "",
      locationName: "",
      address: "",
      city: "",
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
      await saveHostProfile({
        uid: firebaseUser.uid,
        hostProfile: {
          operatorName: values.operatorName.trim(),
          phone: values.phone.trim(),
          locationName: values.locationName.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
        },
      });

      router.push("/onboarding/host/location");
    } catch (error) {
      console.error("Host profile step error:", error);
      setError("root", {
        type: "manual",
        message: "Host-Profil konnte nicht gespeichert werden",
      });
    }
  });

  return (
    <OnboardingShell
      title={onboardingConfig.host.profile.title}
      description={onboardingConfig.host.profile.description}
      step={onboardingConfig.host.profile.step}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2.5">
            <Label htmlFor={onboardingConfig.host.profile.fields.operatorName.id} className="text-sm font-medium">
              {onboardingConfig.host.profile.fields.operatorName.label}
            </Label>

            <div className="relative">
              <Building2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={onboardingConfig.host.profile.fields.operatorName.id}
                placeholder={onboardingConfig.host.profile.fields.operatorName.placeholder}
                className={["h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none", errors.operatorName ? "border-destructive" : ""].join(" ")}
                {...register("operatorName")}
              />
            </div>

            {errors.operatorName ? <p className="text-sm text-destructive">{errors.operatorName.message}</p> : null}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={onboardingConfig.host.profile.fields.phone.id} className="text-sm font-medium">
              {onboardingConfig.host.profile.fields.phone.label}
            </Label>

            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={onboardingConfig.host.profile.fields.phone.id}
                type="tel"
                placeholder={onboardingConfig.host.profile.fields.phone.placeholder}
                className={["h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none", errors.phone ? "border-destructive" : ""].join(" ")}
                {...register("phone")}
              />
            </div>

            {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2.5">
            <Label htmlFor={onboardingConfig.host.profile.fields.locationName.id} className="text-sm font-medium">
              {onboardingConfig.host.profile.fields.locationName.label}
            </Label>

            <div className="relative">
              <Building2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={onboardingConfig.host.profile.fields.locationName.id}
                placeholder={onboardingConfig.host.profile.fields.locationName.placeholder}
                className={["h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none", errors.locationName ? "border-destructive" : ""].join(" ")}
                {...register("locationName")}
              />
            </div>

            {errors.locationName ? <p className="text-sm text-destructive">{errors.locationName.message}</p> : null}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={onboardingConfig.host.profile.fields.city.id} className="text-sm font-medium">
              {onboardingConfig.host.profile.fields.city.label}
            </Label>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={onboardingConfig.host.profile.fields.city.id}
                placeholder={onboardingConfig.host.profile.fields.city.placeholder}
                className={["h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none", errors.city ? "border-destructive" : ""].join(" ")}
                {...register("city")}
              />
            </div>

            {errors.city ? <p className="text-sm text-destructive">{errors.city.message}</p> : null}
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor={onboardingConfig.host.profile.fields.address.id} className="text-sm font-medium">
            {onboardingConfig.host.profile.fields.address.label}
          </Label>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={onboardingConfig.host.profile.fields.address.id}
              placeholder={onboardingConfig.host.profile.fields.address.placeholder}
              className={["h-12 rounded-2xl border-border/80 pl-11 pr-4 shadow-none", errors.address ? "border-destructive" : ""].join(" ")}
              {...register("address")}
            />
          </div>

          {errors.address ? <p className="text-sm text-destructive">{errors.address.message}</p> : null}
        </div>

        {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="h-12 w-full rounded-2xl text-sm font-medium" disabled={isSubmitting}>
          {onboardingConfig.host.profile.cta.submit}
        </Button>
      </form>
    </OnboardingShell>
  );
}
