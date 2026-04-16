import { z } from "zod";

function isValidUrlOrEmpty(value: string): boolean {
  const normalized = value.trim();

  if (!normalized) {
    return true;
  }

  try {
    const url = new URL(normalized);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidInstagramOrEmpty(value: string): boolean {
  const normalized = value.trim();

  if (!normalized) {
    return true;
  }

  try {
    const url = new URL(normalized);
    return (url.protocol === "http:" || url.protocol === "https:") && (url.hostname === "instagram.com" || url.hostname.endsWith(".instagram.com"));
  } catch {
    return false;
  }
}

export const hostLocationSchema = z.object({
  category: z.string().trim().min(1, "Bitte wähle eine Kategorie aus."),
  description: z
    .string()
    .trim()
    .min(1, "Bitte gib eine Beschreibung ein.")
    .min(20, "Die Beschreibung muss mindestens 20 Zeichen lang sein.")
    .max(500, "Die Beschreibung darf maximal 500 Zeichen lang sein."),
  website: z
    .string()
    .trim()
    .refine((value) => isValidUrlOrEmpty(value), {
      message: "Bitte gib eine gültige Website-URL ein.",
    }),
  instagram: z
    .string()
    .trim()
    .refine((value) => isValidInstagramOrEmpty(value), {
      message: "Bitte gib eine gültige Instagram-URL ein.",
    }),
  amenities: z.array(z.string()),
});

export type HostLocationFormValues = z.infer<typeof hostLocationSchema>;
