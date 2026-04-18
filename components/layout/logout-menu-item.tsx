"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { useState } from "react";

import { auth } from "@/lib/firebase/client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function LogoutMenuItem() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;

    setLoading(true);

    try {
      await fetch("/api/auth/session", {
        method: "DELETE",
      });

      await signOut(auth);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
    }
  }

  return (
    <DropdownMenuItem onClick={handleLogout} disabled={loading} className="cursor-pointer">
      <LogOut className="mr-2 size-4" />
      {loading ? "Abmelden..." : "Logout"}
    </DropdownMenuItem>
  );
}
