import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { adminAuth } from "@/lib/firebase/admin";

const SESSION_COOKIE_NAME = "firebase_id_token";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { token?: string };
    const token = body.token?.trim();

    if (!token) {
      return NextResponse.json({ message: "Token fehlt." }, { status: 400 });
    }

    await adminAuth.verifyIdToken(token);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Session POST error:", error);
    return NextResponse.json({ message: "Session konnte nicht gesetzt werden." }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return NextResponse.json({ ok: true });
}
