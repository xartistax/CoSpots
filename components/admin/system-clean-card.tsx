"use client";

import { useState } from "react";
import { AlertTriangle, ShieldCheck, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type PreviewData = {
  adminUids: string[];
  bookingCount: number;
  userDocCountToDelete: number;
  authUserCountToDelete: number;
};

type RunResult = {
  keptAdminUids: string[];
  deletedBookingCount: number;
  deletedUserDocCount: number;
  deletedAuthUserCount: number;
};

export function SystemCleanCard() {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);

  async function handlePreview() {
    try {
      setLoadingPreview(true);
      setError("");
      setResult(null);

      const response = await fetch("/api/admin/system-clean", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as PreviewData | { message: string };

      if (!response.ok) {
        throw new Error("message" in data ? data.message : "Preview fehlgeschlagen.");
      }

      setPreview(data as PreviewData);
    } catch (err) {
      console.error(err);
      setError("Preview konnte nicht geladen werden.");
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleRun() {
    const confirmed = window.confirm("Wirklich ALLE User, Bookings und Auth-Accounts löschen, ausser Admins?");

    if (!confirmed) {
      return;
    }

    try {
      setRunning(true);
      setError("");
      setResult(null);

      const response = await fetch("/api/admin/system-clean", {
        method: "POST",
      });

      const data = (await response.json()) as (RunResult & { ok: true }) | { message: string };

      if (!response.ok) {
        throw new Error("message" in data ? data.message : "System clean fehlgeschlagen.");
      }

      setResult(data as RunResult);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setError("System clean fehlgeschlagen.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="rounded-3xl border border-destructive/30 bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">System clean</h2>
          <p className="text-sm text-muted-foreground">Löscht alle User-Dokumente, Bookings und Auth-Accounts ausser Admins.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={handlePreview} disabled={loadingPreview || running}>
          {loadingPreview ? "Prüfe..." : "Preview laden"}
        </Button>

        <Button type="button" variant="destructive" onClick={handleRun} disabled={running || loadingPreview}>
          <Trash2 className="mr-2 size-4" />
          {running ? "Lösche..." : "System clean ausführen"}
        </Button>
      </div>

      {preview ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border p-4">
            <p className="text-sm text-muted-foreground">Bookings löschen</p>
            <p className="mt-1 text-2xl font-semibold">{preview.bookingCount}</p>
          </div>

          <div className="rounded-2xl border p-4">
            <p className="text-sm text-muted-foreground">User Docs löschen</p>
            <p className="mt-1 text-2xl font-semibold">{preview.userDocCountToDelete}</p>
          </div>

          <div className="rounded-2xl border p-4">
            <p className="text-sm text-muted-foreground">Auth Users löschen</p>
            <p className="mt-1 text-2xl font-semibold">{preview.authUserCountToDelete}</p>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-foreground" />
              <p className="text-sm text-muted-foreground">Admins bleiben</p>
            </div>
            <p className="mt-1 text-sm font-medium">{preview.adminUids.join(", ") || "Keine gefunden"}</p>
          </div>
        </div>
      ) : null}

      {result ? (
        <div className="mt-5 rounded-2xl border border-green-500/30 bg-green-500/5 p-4 text-sm">
          <p className="font-medium">System clean erfolgreich.</p>
          <p className="mt-2 text-muted-foreground">
            Gelöscht: {result.deletedBookingCount} Bookings, {result.deletedUserDocCount} User Docs, {result.deletedAuthUserCount} Auth Users.
          </p>
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
    </section>
  );
}
