"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function BookingSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/user/bookings");
      router.refresh();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border bg-card p-8 text-center">
        <div className="flex justify-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle className="size-6 text-emerald-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Buchung bestätigt</h1>
          <p className="text-sm text-muted-foreground">Deine Buchung wurde erfolgreich erstellt.</p>
        </div>

        <Button
          className="w-full"
          onClick={() => {
            router.replace("/user/bookings");
            router.refresh();
          }}
        >
          Zu meinen Buchungen
        </Button>
      </div>
    </main>
  );
}
