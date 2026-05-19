import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getWeeklyKey, pickWeeklyRecipes } from "@/lib/weeklyMenu";
import Recipe from "@/models/Recipe";
import { normalizeTags } from "@/lib/tags";

export async function GET() {
  try {
    await connectDB();

    const recipes = await Recipe.find({ isPrivate: { $ne: true } })
      .select("name description imageSrc tag cookingTime")
      .lean();

    const normalizedRecipes = recipes.map((recipe) => ({
      _id: String(recipe._id),
      name: recipe.name || "Untitled recipe",
      description: recipe.description || "",
      imageSrc: recipe.imageSrc || "",
      tag: normalizeTags(Array.isArray(recipe.tag) ? recipe.tag : []),
      cookingTime: recipe.cookingTime || "",
    }));

    const weeklyRecipes = pickWeeklyRecipes(
      normalizedRecipes,
      getWeeklyKey(new Date()),
    );

    return NextResponse.json({ success: true, data: weeklyRecipes });
  } catch (error) {
    console.error("Error fetching weekly menu:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch weekly menu" },
      { status: 500 },
    );
  }
}
