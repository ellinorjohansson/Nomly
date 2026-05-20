import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "E-post och lösenord krävs" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Felaktig e-post eller lösenord" },
        { status: 401 },
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Felaktig e-post eller lösenord" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          userId: String(user._id),
          name: user.name,
          email: user.email,
        },
      },
    });

    return setSessionCookie(response, {
      userId: String(user._id),
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Fel vid inloggning:", error);
    return NextResponse.json(
      { success: false, error: "Det gick inte att logga in" },
      { status: 500 },
    );
  }
}
