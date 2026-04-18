"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";

import { OnboardingShell } from "@/app/onboarding/onboarding-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { onboardingConfig } from "@/lib/config/onboarding";
import { saveGuestRules } from "@/lib/firebase/user-profile";
import { rules } from "@/lib/constants/onboarding";
import { guestRulesSchema, type GuestRulesFormValues } from "@/lib/validation/guest-rules";

export default function GuestRulesPage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<GuestRulesFormValues>({
    resolver: zodResolver(guestRulesSchema),
    defaultValues: {
      accepted: [],
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
      await saveGuestRules({
        uid: firebaseUser.uid,
        guestRules: {
          accepted: values.accepted,
        },
      });

      router.replace("/onboarding/guest/success");
    } catch (error) {
      console.error("Guest rules step error:", error);
      setError("root", {
        type: "manual",
        message: "Regeln konnten nicht gespeichert werden",
      });
    }
  });

  return (
    <OnboardingShell title={onboardingConfig.guest.rules.title} description={onboardingConfig.guest.rules.description} step={onboardingConfig.guest.rules.step}>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="rounded-[24px] border p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted">
              <ShieldCheck className="size-4" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Bevor du fortfährst</p>
              <p className="text-sm leading-6 text-muted-foreground">Bitte bestätige die wichtigsten Regeln und Bedingungen für deine Nutzung von CoSpots.</p>
            </div>
          </div>

          <Controller
            control={control}
            name="accepted"
            render={({ field }) => (
              <div className="flex flex-col gap-3">
                {rules.map((rule) => {
                  const checked = field.value.includes(rule.id);

                  return (
                    <label
                      key={rule.id}
                      htmlFor={rule.id}
                      className="flex items-start gap-3 rounded-[20px] border p-4 transition hover:border-foreground/20 hover:bg-muted/30"
                    >
                      <Checkbox
                        id={rule.id}
                        className="mt-0.5"
                        checked={checked}
                        onCheckedChange={(nextChecked) => {
                          if (nextChecked) {
                            field.onChange([...field.value, rule.id]);
                            return;
                          }

                          field.onChange(field.value.filter((value) => value !== rule.id));
                        }}
                      />
                      <span className="text-sm leading-6">{rule.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />
        </div>

        {errors.accepted ? <p className="text-sm text-destructive">{errors.accepted.message}</p> : null}

        {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="h-12 w-full rounded-2xl text-sm font-medium" disabled={isSubmitting}>
          {onboardingConfig.guest.rules.cta.submit}
        </Button>

        <p className="text-center text-sm leading-6 text-muted-foreground">
          Mit dem Fortfahren stimmst du unseren{" "}
          <Link href="#" className="font-medium text-foreground underline-offset-4 hover:underline">
            Bedingungen
          </Link>{" "}
          zu.
        </p>
      </form>
    </OnboardingShell>
  );
}
