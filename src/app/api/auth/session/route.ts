import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const session = getSessionFromCookies(await cookies());

  return NextResponse.json({
    success: true,
    data: {
      user: session,
    },
  });
}
