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

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https?:\/\/.+/i.test(value), {
    message: "Bitte gib eine gültige URL ein.",
  });

export const hostLocationSchema = z.object({
  category: z.string().trim().min(1, "Bitte wähle eine Kategorie."),
  description: z.string().trim().min(20, "Bitte beschreibe deinen Spot etwas genauer.").max(800, "Die Beschreibung ist zu lang."),
  website: optionalUrl,
  instagram: optionalUrl,
  amenities: z.array(z.string()).min(1, "Bitte wähle mindestens eine Ausstattung."),
  gallery: z
    .array(
      z.object({
        url: optionalUrl,
        alt: z.string().trim().max(120, "Der Alt-Text ist zu lang."),
      }),
    )
    .length(3),
});

export type HostLocationFormValues = z.infer<typeof hostLocationSchema>;
