"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { NavbarProfile } from "@/components/layout/navbar-profile";
import { cn } from "@/lib/utils";

const baseItems = [{ href: "/", label: "Explore" }] as const;

export function Navbar() {
  const pathname = usePathname();
  const { loading, profile } = useAuth();

  if (loading) {
    return null;
  }

  const isGuest = profile?.role === "guest";
  const isHost = profile?.role === "host";
  const isAdmin = profile?.accessRole === "admin";

  const canAccessHostArea = isAdmin || isHost;

  return (
    <header className="sticky top-0 z-50 hidden w-full border-b bg-background/80 backdrop-blur md:block">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            CoWorkSpots
          </Link>

          <nav className="flex items-center gap-4">
            {baseItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("text-sm text-muted-foreground transition-colors hover:text-foreground", pathname === item.href && "font-medium text-foreground")}
              >
                {item.label}
              </Link>
            ))}

            {isGuest ? (
              <Link
                href="/user/bookings"
                className={cn(
                  "text-sm text-muted-foreground transition-colors hover:text-foreground",
                  pathname.startsWith("/user/bookings") && "font-medium text-foreground",
                )}
              >
                Bookings
              </Link>
            ) : null}
          </nav>
        </div>

        <NavbarProfile />
      </div>
    </header>
  );
}
