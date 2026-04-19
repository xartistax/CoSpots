import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#F9D02D",
    icons: [
      {
        src: "/icon512_rounded.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon512_rounded.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon512_rounded.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
