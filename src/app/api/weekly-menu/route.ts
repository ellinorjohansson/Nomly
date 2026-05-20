import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getWeeklyKey, pickWeeklyRecipes } from "@/lib/weeklyMenu";
import Recipe from "@/models/Recipe";
import { DEFAULT_RECIPE_TYPE, normalizeRecipeType } from "@/lib/recipeType";
import { normalizeTags } from "@/lib/tags";

export async function GET() {
  try {
    await connectDB();

    const recipes = await Recipe.find({
      isPrivate: { $ne: true },
      $or: [
        { recipeType: DEFAULT_RECIPE_TYPE },
        { recipeType: { $exists: false } },
        { recipeType: null },
        { recipeType: "" },
      ],
    })
      .select("name description imageSrc tag cookingTime recipeType")
      .lean();

    const normalizedRecipes = recipes.map((recipe) => ({
      _id: String(recipe._id),
      name: recipe.name || "Namnlöst recept",
      description: recipe.description || "",
      imageSrc: recipe.imageSrc || "",
      tag: normalizeTags(Array.isArray(recipe.tag) ? recipe.tag : []),
      cookingTime: recipe.cookingTime || "",
      recipeType: normalizeRecipeType(recipe.recipeType),
    }));

    const weeklyRecipes = pickWeeklyRecipes(
      normalizedRecipes,
      getWeeklyKey(new Date()),
    );

    return NextResponse.json({ success: true, data: weeklyRecipes });
  } catch (error) {
    console.error("Fel vid hämtning av veckomeny:", error);
    return NextResponse.json(
      { success: false, error: "Det gick inte att hämta veckomenyn" },
      { status: 500 },
    );
  }
}
