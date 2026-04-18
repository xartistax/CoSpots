import { NextResponse } from "next/server";

import { getServerAuthUser } from "@/lib/auth/server-auth";
import { previewSystemClean, runSystemClean } from "@/lib/admin/system-clean";

export async function GET() {
  const authUser = await getServerAuthUser();

  if (!authUser?.isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const preview = await previewSystemClean();
    return NextResponse.json(preview);
  } catch (error) {
    console.error("System clean preview error:", error);
    return NextResponse.json({ message: "Preview fehlgeschlagen." }, { status: 500 });
  }
}

export async function POST() {
  const authUser = await getServerAuthUser();

  if (!authUser?.isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await runSystemClean();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("System clean error:", error);
    return NextResponse.json({ message: "System clean fehlgeschlagen." }, { status: 500 });
  }
}
