import { z } from "zod";

export const hostSetupSchema = z.object({
  spots: z
    .number({
      error: "Bitte gib eine gültige Anzahl an Plätzen ein.",
    })
    .int("Bitte gib eine ganze Zahl ein.")
    .min(1, "Es muss mindestens 1 Platz geben."),
  price: z
    .number({
      error: "Bitte gib einen gültigen Preis ein.",
    })
    .min(0, "Der Preis darf nicht negativ sein."),
  marked: z.boolean(),
  laptopZoneOnly: z.boolean(),
  slotDuration: z.string().trim().min(1, "Bitte wähle eine Slot-Dauer aus."),
});

export type HostSetupFormValues = z.infer<typeof hostSetupSchema>;
