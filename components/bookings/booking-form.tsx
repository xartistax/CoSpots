"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock3, Loader2, MessageSquare, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { bookingSchema, type BookingFormValues } from "@/lib/validation/booking";
import type { AppProfile } from "@/types/user-profile";

type BookingFormProps = {
  host: AppProfile;
};

type SlotOption = {
  startTime: string;
  endTime: string;
  bookedSpots: number;
  remainingSpots: number;
  capacity: number;
  disabled: boolean;
};

function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getSlotState(slot: SlotOption) {
  if (slot.disabled || slot.remainingSpots <= 0) {
    return "full";
  }

  if (slot.remainingSpots === 1) {
    return "last";
  }

  if (slot.remainingSpots <= 2) {
    return "limited";
  }

  return "available";
}

function getSlotHint(slot: SlotOption) {
  const state = getSlotState(slot);

  if (state === "full") {
    return "Ausgebucht";
  }

  if (state === "last") {
    return "Letzter Platz";
  }

  if (state === "limited") {
    return "Wenig frei";
  }

  return `${slot.remainingSpots} frei`;
}

export function BookingForm({ host }: BookingFormProps) {
  const router = useRouter();
  const { profile } = useAuth();

  const [serverError, setServerError] = useState("");
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      hostId: host.uid,
      guestName: profile?.email?.split("@")[0] ?? "",
      date: getTodayDate(),
      startTime: "",
      endTime: "",
      notes: "",
    },
  });

  const selectedDate = watch("date");
  const selectedStartTime = watch("startTime");

  const selectedSlot = useMemo(() => slots.find((slot) => slot.startTime === selectedStartTime) ?? null, [slots, selectedStartTime]);

  useEffect(() => {
    async function loadSlots() {
      if (!selectedDate) {
        setSlots([]);
        setValue("startTime", "");
        setValue("endTime", "");
        return;
      }

      try {
        setSlotsLoading(true);
        setServerError("");

        const response = await fetch(`/api/hosts/${host.uid}/availability?date=${selectedDate}`);

        const result = (await response.json()) as {
          slots?: SlotOption[];
          message?: string;
        };

        if (!response.ok) {
          setSlots([]);
          setValue("startTime", "");
          setValue("endTime", "");
          setServerError(result.message ?? "Verfügbarkeit konnte nicht geladen werden.");
          return;
        }

        const nextSlots = result.slots ?? [];
        setSlots(nextSlots);

        const currentStillValid = nextSlots.some((slot) => slot.startTime === selectedStartTime && !slot.disabled);

        if (!currentStillValid) {
          setValue("startTime", "");
          setValue("endTime", "");
        }
      } catch (error) {
        console.error("Load availability error:", error);
        setSlots([]);
        setValue("startTime", "");
        setValue("endTime", "");
        setServerError("Verfügbarkeit konnte nicht geladen werden.");
      } finally {
        setSlotsLoading(false);
      }
    }

    void loadSlots();
  }, [host.uid, selectedDate, selectedStartTime, setValue]);

  useEffect(() => {
    setValue("endTime", selectedSlot?.endTime ?? "");
  }, [selectedSlot, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setServerError(result.message ?? "Buchung konnte nicht erstellt werden.");
        return;
      }

      router.replace("/booking/success");
      router.refresh();
    } catch (error) {
      console.error("Create booking error:", error);
      setServerError("Buchung konnte nicht erstellt werden.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" value={host.uid} {...register("hostId")} />
      <input type="hidden" {...register("endTime")} />

      <div className="space-y-4">
        <div className="rounded-[24px] border p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted">
              <UserRound className="size-4 text-muted-foreground" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Deine Angaben</p>
              <p className="text-sm leading-6 text-muted-foreground">So erscheint deine Buchung beim Host.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="guestName" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="guestName"
                placeholder="Max Muster"
                className={cn("h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.guestName && "border-destructive")}
                {...register("guestName")}
              />
              {errors.guestName ? <p className="text-sm text-destructive">{errors.guestName.message}</p> : null}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="guestEmailInfo" className="text-sm font-medium">
                E-Mail
              </Label>
              <Input
                id="guestEmailInfo"
                value={profile?.email ?? ""}
                disabled
                readOnly
                className="h-12 rounded-2xl border-border/80 bg-muted px-4 shadow-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted">
              <CalendarDays className="size-4 text-muted-foreground" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Datum & Slot</p>
              <p className="text-sm leading-6 text-muted-foreground">Wähle einen Tag und danach einen freien Slot.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="date" className="text-sm font-medium">
                Datum
              </Label>
              <Input
                id="date"
                type="date"
                className={cn("h-12 rounded-2xl border-border/80 px-4 shadow-none", errors.date && "border-destructive")}
                {...register("date")}
              />
              {errors.date ? <p className="text-sm text-destructive">{errors.date.message}</p> : null}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-medium">Verfügbare Slots</Label>

                {slotsLoading ? (
                  <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin" />
                    Lade Slots...
                  </span>
                ) : null}
              </div>

              <div className="grid gap-3">
                {slotsLoading ? (
                  <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">Verfügbare Slots werden geladen.</div>
                ) : null}

                {!slotsLoading && selectedDate && !slots.length ? (
                  <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">Für dieses Datum sind keine Slots verfügbar.</div>
                ) : null}

                {!slotsLoading &&
                  slots.map((slot) => {
                    const isSelected = selectedStartTime === slot.startTime;
                    const state = getSlotState(slot);

                    return (
                      <button
                        key={`${slot.startTime}-${slot.endTime}`}
                        type="button"
                        onClick={() => {
                          if (slot.disabled) return;

                          setValue("startTime", slot.startTime, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        }}
                        disabled={slot.disabled}
                        className={cn(
                          "flex w-full items-center justify-between rounded-[20px] border p-4 text-left transition",
                          isSelected && "border-foreground ring-1 ring-foreground",
                          !isSelected && !slot.disabled && "border-border hover:border-foreground/20 hover:bg-muted/30",
                          slot.disabled && "cursor-not-allowed border-border bg-muted/40 opacity-60",
                        )}
                      >
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-2">
                            <Clock3 className="size-4 text-muted-foreground" />
                            <span className="font-medium">
                              {slot.startTime} – {slot.endTime}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {slot.bookedSpots} gebucht · {slot.capacity} Plätze
                          </p>
                        </div>

                        <div
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium",
                            state === "available" && "bg-emerald-500/10 text-emerald-700",
                            state === "limited" && "bg-amber-500/10 text-amber-700",
                            state === "last" && "bg-orange-500/10 text-orange-700",
                            state === "full" && "bg-muted text-muted-foreground",
                          )}
                        >
                          {getSlotHint(slot)}
                        </div>
                      </button>
                    );
                  })}
              </div>

              <select
                className="sr-only"
                {...register("startTime")}
                value={selectedStartTime}
                onChange={(event) => {
                  setValue("startTime", event.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
              >
                <option value="">Bitte Slot wählen</option>
                {slots.map((slot) => (
                  <option key={`${slot.startTime}-${slot.endTime}`} value={slot.startTime} disabled={slot.disabled}>
                    {slot.startTime} – {slot.endTime}
                  </option>
                ))}
              </select>

              {errors.startTime ? <p className="text-sm text-destructive">{errors.startTime.message}</p> : null}

              {selectedSlot ? (
                <div className="rounded-2xl border bg-muted/30 p-4 text-sm">
                  <p className="font-medium">
                    Gewählter Slot: {selectedSlot.startTime} – {selectedSlot.endTime}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Noch {selectedSlot.remainingSpots} von {selectedSlot.capacity} Plätzen frei.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted">
              <MessageSquare className="size-4 text-muted-foreground" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Nachricht</p>
              <p className="text-sm leading-6 text-muted-foreground">Optional kannst du dem Host noch eine kurze Info mitgeben.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="notes" className="text-sm font-medium">
              Nachricht
            </Label>
            <Textarea
              id="notes"
              placeholder="Optional: weitere Infos zu deiner Anfrage"
              className={cn("min-h-28 rounded-2xl border-border/80 px-4 py-3 shadow-none", errors.notes && "border-destructive")}
              {...register("notes")}
            />
            {errors.notes ? <p className="text-sm text-destructive">{errors.notes.message}</p> : null}
          </div>
        </div>
      </div>

      {serverError ? <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{serverError}</div> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" className="h-12 rounded-2xl sm:min-w-40" disabled={isSubmitting || slotsLoading || !selectedSlot}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Buche...
            </span>
          ) : (
            "Jetzt buchen"
          )}
        </Button>

        <Button type="button" size="lg" variant="outline" className="h-12 rounded-2xl sm:min-w-32" onClick={() => router.back()} disabled={isSubmitting}>
          Zurück
        </Button>
      </div>
    </form>
  );
}
