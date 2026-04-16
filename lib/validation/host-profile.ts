import { z } from "zod";

function isValidPhone(value: string): boolean {
  const normalized = value.trim();

  if (!normalized) {
    return false;
  }

  return /^[+]?[\d\s\-()\/]{6,20}$/.test(normalized);
}

export const hostProfileSchema = z.object({
  operatorName: z.string().trim().min(1, "Bitte gib einen Betreiber-Namen ein.").max(100, "Der Betreiber-Name darf maximal 100 Zeichen lang sein."),
  phone: z
    .string()
    .trim()
    .min(1, "Bitte gib eine Telefonnummer ein.")
    .refine((value) => isValidPhone(value), {
      message: "Bitte gib eine gültige Telefonnummer ein.",
    }),
  locationName: z.string().trim().min(1, "Bitte gib einen Location-Namen ein.").max(100, "Der Location-Name darf maximal 100 Zeichen lang sein."),
  address: z.string().trim().min(1, "Bitte gib eine Adresse ein.").max(200, "Die Adresse darf maximal 200 Zeichen lang sein."),
  city: z.string().trim().min(1, "Bitte gib eine Stadt ein.").max(100, "Die Stadt darf maximal 100 Zeichen lang sein."),
});

export type HostProfileFormValues = z.infer<typeof hostProfileSchema>;
