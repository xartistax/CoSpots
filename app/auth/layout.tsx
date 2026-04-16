import { SignedInGuard } from "@/components/guards/is-signed-in-guard";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <SignedInGuard>{children}</SignedInGuard>;
}
