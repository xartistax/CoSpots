"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, LayoutDashboard, CalendarDays, LogIn } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
};

export function MobileNav() {
  const pathname = usePathname();
  const { loading, profile } = useAuth();

  if (loading) {
    return null;
  }

  const isAdmin = profile?.accessRole === "admin";
  const isHost = profile?.role === "host";

  const items: NavItem[] = [
    {
      href: "/",
      label: "Explore",
      icon: Compass,
      active: pathname === "/",
    },
    ...(profile
      ? [
          {
            href: "/user/bookings",
            label: "Bookings",
            icon: CalendarDays,
            active: pathname.startsWith("/user/bookings"),
          },
        ]
      : [
          {
            href: "/auth/sign-in",
            label: "Login",
            icon: LogIn,
            active: pathname.startsWith("/auth/sign-in"),
          },
        ]),
    ...(isHost || isAdmin
      ? [
          {
            href: "/host/bookings",
            label: isAdmin ? "Admin" : "Host",
            icon: LayoutDashboard,
            active: pathname.startsWith("/host"),
          },
        ]
      : []),
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className={`grid h-16 ${items.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[11px] text-muted-foreground transition-colors",
                item.active && "text-foreground",
              )}
            >
              <Icon className={cn("size-5", item.active && "text-foreground")} />
              <span className={cn(item.active && "font-medium")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
