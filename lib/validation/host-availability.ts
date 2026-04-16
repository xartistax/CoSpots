import { z } from "zod";

function toMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export const hostAvailabilitySchema = z
  .object({
    days: z.array(z.string()).min(1, "Bitte wähle mindestens einen Wochentag aus."),
    from: z.string().min(1, "Bitte wähle eine Startzeit aus."),
    to: z.string().min(1, "Bitte wähle eine Endzeit aus."),
    recurring: z.boolean(),
    gracePeriod: z.coerce.number().int("Bitte gib eine ganze Zahl ein.").min(0, "Die Karenzzeit darf nicht negativ sein."),
    extendAllowed: z.boolean(),
  })
  .refine((values) => toMinutes(values.from) < toMinutes(values.to), {
    path: ["to"],
    message: "Die Endzeit muss nach der Startzeit liegen.",
  });

export type HostAvailabilityFormInput = z.input<typeof hostAvailabilitySchema>;
export type HostAvailabilityFormValues = z.output<typeof hostAvailabilitySchema>;
