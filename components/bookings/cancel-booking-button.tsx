"use client";

import { useFormStatus } from "react-dom";

import { cancelOwnBookingAction } from "@/lib/actions/booking-actions";
import { Button } from "@/components/ui/button";

type CancelBookingButtonProps = {
  bookingId: string;
  disabled?: boolean;
};

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" size="sm" className="rounded-full" disabled={pending || disabled}>
      Buchung stornieren
    </Button>
  );
}

export function CancelBookingButton({ bookingId, disabled = false }: CancelBookingButtonProps) {
  return (
    <form action={cancelOwnBookingAction}>
      <input type="hidden" name="bookingId" value={bookingId} />
      <SubmitButton disabled={disabled} />
    </form>
  );
}
