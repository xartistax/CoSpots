import { z } from "zod";

import { rules } from "@/lib/constants/onboarding";

export const hostRulesSchema = z.object({
  accepted: z.array(z.string()).refine((value) => value.length === rules.length, {
    message: "Bitte akzeptiere alle Regeln",
  }),
});

export type HostRulesFormValues = z.infer<typeof hostRulesSchema>;
