"use client";

import dynamic from "next/dynamic";

import { Spinner } from "@/components/ui/spinner";

const SwitzerlandMap = dynamic(() => import("@/components/map/switzerland").then((mod) => mod.SwitzerlandMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <Spinner />
    </div>
  ),
});

export function HomeMapPanel() {
  return (
    <div className="min-h-0 rounded-xl bg-card p-4">
      <SwitzerlandMap />
    </div>
  );
}
