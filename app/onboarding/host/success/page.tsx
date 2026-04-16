import Link from "next/link";

import { Button } from "@/components/ui/button";
import { OnboardingShell } from "../../onboarding-shell";
import { Alert } from "@/components/ui/alert";
import { onboardingConfig } from "@/lib/config/onboarding";

export default function HostSuccessPage() {
  return (
    <OnboardingShell title={onboardingConfig.host.success.title} description={onboardingConfig.host.success.description}>
      <div className="flex flex-col gap-4">
        <Alert variant={"success"}> {onboardingConfig.host.success.alert} </Alert>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="w-full">
            <Link href="/host/slots/new"> {onboardingConfig.host.success.cta.primary} </Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/host/location/preview"> {onboardingConfig.host.success.cta.secondary} </Link>
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
