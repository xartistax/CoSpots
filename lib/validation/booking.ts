import { z } from "zod";

export const bookingSchema = z.object({
  hostId: z.string().trim().min(1),
  guestName: z.string().trim().min(2, "Bitte gib deinen Namen ein.").max(100, "Der Name ist zu lang."),
  date: z.string().trim().min(1, "Bitte wähle ein Datum aus."),
  startTime: z.string().trim().min(1, "Bitte wähle einen verfügbaren Slot aus."),
  endTime: z.string().trim().min(1, "Endzeit fehlt."),
  notes: z.string().trim().max(500, "Die Nachricht darf maximal 500 Zeichen lang sein.").optional().or(z.literal("")),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
