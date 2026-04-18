import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type OnboardingShellProps = {
  title: string;
  description?: string;
  step?: string;
  children: ReactNode;
};

export function OnboardingShell({ title, description, step, children }: OnboardingShellProps) {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
        <div className="rounded-[28px] border bg-card px-6 py-8 shadow-sm sm:px-8">
          <div className="mb-6 space-y-3 text-center">
            {step ? <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{step}</p> : null}

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

              {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
            </div>
          </div>

          <div className="space-y-6">{children}</div>
        </div>
      </section>
    </main>
  );
}
