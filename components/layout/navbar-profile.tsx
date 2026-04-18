"use client";

import Link from "next/link";
import { CalendarDays, LayoutDashboard, Menu, Shield, User } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { LogoutMenuItem } from "@/components/layout/logout-menu-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavbarProfile() {
  const { profile, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!profile) {
    return (
      <Link href="/auth/sign-in" className="rounded-full border px-4 py-2 text-sm transition hover:bg-muted">
        Sign-In
      </Link>
    );
  }

  const isAdmin = profile.accessRole === "admin";
  const isHost = profile.role === "host";
  const isGuest = profile.role === "guest";

  const bookingsLabel = isHost ? "Gast-Buchungen" : "Meine Buchungen";
  const dashboardLabel = isAdmin ? "Admin Dashboard" : "Host Dashboard";
  const roleLabel = isAdmin ? "Admin" : isHost ? "Host" : "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-3 rounded-full border bg-background px-3 py-2 transition hover:shadow-sm"
          aria-label="Profilmenü öffnen"
        >
          <Menu className="size-4 text-muted-foreground" />

          <Avatar className="size-8">
            {profile.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt={profile.email ?? "User"} /> : null}
            <AvatarFallback>{profile.email?.charAt(0).toUpperCase() ?? "U"}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2">
        <div className="px-2 py-2">
          <p className="truncate text-sm font-medium">{profile.email}</p>
          <p className="text-xs text-muted-foreground">{roleLabel}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {isGuest ? (
            <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
              <Link href="/user/bookings">
                <CalendarDays className="mr-2 size-4" />
                {bookingsLabel}
              </Link>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
            <Link href="/settings">
              <User className="mr-2 size-4" />
              Profil
            </Link>
          </DropdownMenuItem>

          {isHost || isAdmin ? (
            <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
              <Link href="/host/bookings">
                {isAdmin ? <Shield className="mr-2 size-4" /> : <LayoutDashboard className="mr-2 size-4" />}
                {dashboardLabel}
              </Link>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <LogoutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
