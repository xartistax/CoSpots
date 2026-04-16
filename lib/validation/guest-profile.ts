import { z } from "zod";

function isValidLinkedInUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || (url.protocol === "https:" && (url.hostname === "linkedin.com" || url.hostname.endsWith(".linkedin.com")));
  } catch {
    return false;
  }
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const guestProfileSchema = z.object({
  industry: z.string().trim().min(1, "Bitte wähle eine Branche aus."),
  purpose: z.string().trim().min(1, "Bitte wähle einen Zweck aus."),
  networking: z.boolean(),
  bio: z
    .string()
    .trim()
    .min(1, "Bitte gib eine Kurzbeschreibung ein.")
    .min(20, "Die Bio muss mindestens 20 Zeichen lang sein.")
    .max(300, "Die Bio darf maximal 300 Zeichen lang sein."),
  linkedin: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidLinkedInUrl(value), {
      message: "Bitte gib eine gültige LinkedIn-URL ein.",
    }),
  website: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidUrl(value), {
      message: "Bitte gib eine gültige Website-URL ein.",
    }),
});

export type GuestProfileFormValues = z.infer<typeof guestProfileSchema>;
