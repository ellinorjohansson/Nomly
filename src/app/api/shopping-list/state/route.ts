import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionFromCookies } from "@/lib/auth";
import connectDB from "@/lib/db";
import {
  sanitizePersistedShoppingListState,
  sanitizeSelectedRecipeIds,
} from "@/lib/shoppingBagState";
import User from "@/models/User";

const getUnauthorizedResponse = () =>
  NextResponse.json(
    { success: false, error: "Du måste vara inloggad" },
    { status: 401 },
  );

export async function GET() {
  try {
    const session = getSessionFromCookies(await cookies());

    if (!session?.userId) {
      return getUnauthorizedResponse();
    }

    await connectDB();

    const user = await User.findById(session.userId).lean();

    if (!user) {
      return getUnauthorizedResponse();
    }

    return NextResponse.json({
      success: true,
      data: {
        selectedRecipeIds: sanitizeSelectedRecipeIds(
          user.shoppingBagSelectedRecipeIds,
        ),
        persistedState: sanitizePersistedShoppingListState(
          user.shoppingBagPersistedState,
        ),
      },
    });
  } catch (error) {
    console.error("Fel vid hämtning av inköpslistan:", error);
    return NextResponse.json(
      { success: false, error: "Det gick inte att hämta inköpslistan" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = getSessionFromCookies(await cookies());

    if (!session?.userId) {
      return getUnauthorizedResponse();
    }

    const body = await request.json().catch(() => null);
    const selectedRecipeIds = sanitizeSelectedRecipeIds(
      body?.selectedRecipeIds,
    );
    const persistedState = sanitizePersistedShoppingListState(
      body?.persistedState,
    );

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.userId,
      {
        shoppingBagSelectedRecipeIds: selectedRecipeIds,
        shoppingBagPersistedState: persistedState,
      },
      {
        new: true,
      },
    ).lean();

    if (!user) {
      return getUnauthorizedResponse();
    }

    return NextResponse.json({
      success: true,
      data: {
        selectedRecipeIds: sanitizeSelectedRecipeIds(
          user.shoppingBagSelectedRecipeIds,
        ),
        persistedState: sanitizePersistedShoppingListState(
          user.shoppingBagPersistedState,
        ),
      },
    });
  } catch (error) {
    console.error("Fel vid sparande av inköpslistan:", error);
    return NextResponse.json(
      { success: false, error: "Det gick inte att spara inköpslistan" },
      { status: 500 },
    );
  }
}
