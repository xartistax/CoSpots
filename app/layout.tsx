import type { Metadata } from "next";

import "./globals.css";
import { AuthGuard } from "@/components/guards/auth-guard";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Navbar } from "@/components/layout/navbar";
import { RegisterSw } from "@/components/pwa/register-sw";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AuthSessionSync } from "@/components/providers/auth-session-sync";
import { siteConfig } from "@/lib/config/site";
import { geistMono, geistSans, inter } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/icon512_rounded.png" },
      { url: "/icon512_rounded.png", sizes: "152x152" },
      { url: "/icon512_rounded.png", sizes: "180x180" },
      { url: "/icon512_rounded.png", sizes: "167x167" },
    ],
    shortcut: ["/favicon.ico"],
    other: [
      {
        rel: "mask-icon",
        url: "/globe.svg",
        color: "#F9D02D",
      },
    ],
  },
  openGraph: {
    type: "website",
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [`${siteConfig.url}/icons/apple-touch-icon.png`],
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.social.twitter.handle,
    images: [`${siteConfig.url}/icons/android-chrome-192x192.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}>
      <body className="min-h-full flex flex-col">
        <RegisterSw />
        <AuthProvider>
          <AuthSessionSync />
          <Navbar />
          <AuthGuard>{children}</AuthGuard>
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
