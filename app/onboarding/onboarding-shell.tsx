import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type OnboardingShellProps = {
  title: string;
  description?: string;
  step?: string;
  children: ReactNode;
};

export function OnboardingShell({ title, description, step, children }: OnboardingShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          {step ? <p className="text-sm font-medium text-muted-foreground">{step}</p> : null}
          <div className="space-y-1">
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
