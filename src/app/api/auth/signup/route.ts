import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const name = body?.name?.trim();
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with that email already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

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
    console.error("Error signing up:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create account" },
      { status: 500 },
    );
  }
}
