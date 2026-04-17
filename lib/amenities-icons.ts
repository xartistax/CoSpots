import { Wifi, Plug, Laptop, Toilet, Users, Coffee } from "lucide-react";

export const AMENITY_ICONS = {
  wifi: Wifi,
  power: Plug,
  "laptop-zone": Laptop,
  wc: Toilet,
  networking: Users,
  coffee: Coffee,
} as const;
