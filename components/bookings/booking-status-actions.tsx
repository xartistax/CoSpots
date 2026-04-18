"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { updateBookingStatusAction } from "@/lib/actions/booking-actions";

type BookingStatusActionsProps = {
  bookingId: string;
  hostId: string;
  currentStatus: "pending" | "confirmed" | "cancelled";
};

function SubmitButton({
  label,
  status,
  variant,
  disabled,
}: {
  label: string;
  status: "confirmed" | "cancelled";
  variant: "default" | "outline" | "destructive";
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" name="status" value={status} variant={variant} size="sm" disabled={pending || disabled} className="rounded-full">
      {label}
    </Button>
  );
}

export function BookingStatusActions({ bookingId, hostId, currentStatus }: BookingStatusActionsProps) {
  const disableConfirm = currentStatus === "confirmed";
  const disableCancel = currentStatus === "cancelled";

  return (
    <form action={updateBookingStatusAction} className="flex flex-wrap gap-2">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="hostId" value={hostId} />

      <SubmitButton label="Bestätigen" status="confirmed" variant="default" disabled={disableConfirm} />

      <SubmitButton label="Stornieren" status="cancelled" variant="destructive" disabled={disableCancel} />
    </form>
  );
}
