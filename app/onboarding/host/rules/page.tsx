"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { OnboardingShell } from "@/app/onboarding/onboarding-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { onboardingConfig } from "@/lib/config/onboarding";
import { saveHostRules } from "@/lib/firebase/user-profile";
import { rules } from "@/lib/constants/onboarding";
import { hostRulesSchema, type HostRulesFormValues } from "@/lib/validation/host-rules";

export default function HostRulesPage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<HostRulesFormValues>({
    resolver: zodResolver(hostRulesSchema),
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
      await saveHostRules({
        uid: firebaseUser.uid,
        hostRules: {
          accepted: values.accepted,
        },
      });

      router.replace("/onboarding/host/success");
    } catch (error) {
      console.error("Host rules step error:", error);
      setError("root", {
        type: "manual",
        message: "Regeln konnten nicht gespeichert werden",
      });
    }
  });

  return (
    <OnboardingShell title={onboardingConfig.host.rules.title} description={onboardingConfig.host.rules.description} step={onboardingConfig.host.rules.step}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <Controller
          control={control}
          name="accepted"
          render={({ field }) => (
            <div className="flex flex-col gap-3">
              {rules.map((rule) => {
                const checked = field.value.includes(rule.id);

                return (
                  <label key={rule.id} htmlFor={rule.id} className="flex items-start gap-3 rounded-lg border p-4">
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

        {errors.accepted ? <p className="text-sm text-destructive">{errors.accepted.message}</p> : null}

        {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {onboardingConfig.host.rules.cta.submit}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Mit dem Fortfahren stimmst du unseren{" "}
          <Link href="#" className="underline underline-offset-4">
            Bedingungen
          </Link>{" "}
          zu.
        </p>
      </form>
    </OnboardingShell>
  );
}
