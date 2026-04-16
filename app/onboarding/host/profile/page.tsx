"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.host.profile.fields.operatorName.id}>{onboardingConfig.host.profile.fields.operatorName.label}</Label>
            <Input
              id={onboardingConfig.host.profile.fields.operatorName.id}
              placeholder={onboardingConfig.host.profile.fields.operatorName.placeholder}
              className={errors.operatorName ? "border-destructive" : ""}
              {...register("operatorName")}
            />
            {errors.operatorName ? <p className="text-sm text-destructive">{errors.operatorName.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.host.profile.fields.phone.id}>{onboardingConfig.host.profile.fields.phone.label}</Label>
            <Input
              id={onboardingConfig.host.profile.fields.phone.id}
              type="tel"
              placeholder={onboardingConfig.host.profile.fields.phone.placeholder}
              className={errors.phone ? "border-destructive" : ""}
              {...register("phone")}
            />
            {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.host.profile.fields.locationName.id}>{onboardingConfig.host.profile.fields.locationName.label}</Label>
            <Input
              id={onboardingConfig.host.profile.fields.locationName.id}
              placeholder={onboardingConfig.host.profile.fields.locationName.placeholder}
              className={errors.locationName ? "border-destructive" : ""}
              {...register("locationName")}
            />
            {errors.locationName ? <p className="text-sm text-destructive">{errors.locationName.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.host.profile.fields.city.id}>{onboardingConfig.host.profile.fields.city.label}</Label>
            <Input
              id={onboardingConfig.host.profile.fields.city.id}
              placeholder={onboardingConfig.host.profile.fields.city.placeholder}
              className={errors.city ? "border-destructive" : ""}
              {...register("city")}
            />
            {errors.city ? <p className="text-sm text-destructive">{errors.city.message}</p> : null}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={onboardingConfig.host.profile.fields.address.id}>{onboardingConfig.host.profile.fields.address.label}</Label>
          <Input
            id={onboardingConfig.host.profile.fields.address.id}
            placeholder={onboardingConfig.host.profile.fields.address.placeholder}
            className={errors.address ? "border-destructive" : ""}
            {...register("address")}
          />
          {errors.address ? <p className="text-sm text-destructive">{errors.address.message}</p> : null}
        </div>

        {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {onboardingConfig.host.profile.cta.submit}
        </Button>
      </form>
    </OnboardingShell>
  );
}
