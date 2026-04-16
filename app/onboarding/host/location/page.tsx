"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { saveHostLocation } from "@/lib/firebase/user-profile";
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
    formState: { errors, isSubmitting },
  } = useForm<HostLocationFormValues>({
    resolver: zodResolver(hostLocationSchema),
    defaultValues: {
      category: "",
      description: "",
      website: "",
      instagram: "",
      amenities: [],
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
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor={onboardingConfig.host.location.fields.category.id}>{onboardingConfig.host.location.fields.category.label}</Label>

          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={onboardingConfig.host.location.fields.category.id} className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder={onboardingConfig.host.location.fields.category.placeholder} />
                </SelectTrigger>

                <SelectContent>
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

        <div className="flex flex-col gap-2">
          <Label htmlFor={onboardingConfig.host.location.fields.description.id}>{onboardingConfig.host.location.fields.description.label}</Label>
          <Textarea
            id={onboardingConfig.host.location.fields.description.id}
            placeholder={onboardingConfig.host.location.fields.description.placeholder}
            className={errors.description ? "border-destructive" : ""}
            {...register("description")}
          />
          {errors.description ? <p className="text-sm text-destructive">{errors.description.message}</p> : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.host.location.fields.website.id}>{onboardingConfig.host.location.fields.website.label}</Label>
            <Input
              id={onboardingConfig.host.location.fields.website.id}
              placeholder={onboardingConfig.host.location.fields.website.placeholder}
              className={errors.website ? "border-destructive" : ""}
              {...register("website")}
            />
            {errors.website ? <p className="text-sm text-destructive">{errors.website.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={onboardingConfig.host.location.fields.instagram.id}>{onboardingConfig.host.location.fields.instagram.label}</Label>
            <Input
              id={onboardingConfig.host.location.fields.instagram.id}
              placeholder={onboardingConfig.host.location.fields.instagram.placeholder}
              className={errors.instagram ? "border-destructive" : ""}
              {...register("instagram")}
            />
            {errors.instagram ? <p className="text-sm text-destructive">{errors.instagram.message}</p> : null}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label>{onboardingConfig.host.location.fields.locationAmenityOptions.label}</Label>

          <Controller
            control={control}
            name="amenities"
            render={({ field }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                {locationAmenityOptions.map((item) => {
                  const checked = field.value.includes(item.id);

                  return (
                    <label key={item.id} htmlFor={item.id} className="flex items-center gap-3 rounded-lg border p-4">
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

        {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {onboardingConfig.host.location.cta.submit}
        </Button>
      </form>
    </OnboardingShell>
  );
}
