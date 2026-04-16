import { z } from "zod";

export const guestPreferencesSchema = z.object({
  city: z.string().trim(),
  times: z.array(z.string()),
  important: z.array(z.string()),
});

export type GuestPreferencesFormValues = z.infer<typeof guestPreferencesSchema>;
