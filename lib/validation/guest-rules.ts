import { z } from "zod";

import { rules } from "@/lib/constants/onboarding";

export const guestRulesSchema = z.object({
  accepted: z.array(z.string()).refine((value) => value.length === rules.length, {
    message: "Bitte akzeptiere alle Regeln",
  }),
});

export type GuestRulesFormValues = z.infer<typeof guestRulesSchema>;
