import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionFromCookies } from "@/lib/auth";
import connectDB from "@/lib/db";
import { normalizeText, RECIPE_FILTERS } from "@/lib/recipeFilters";
import Recipe from "@/models/Recipe";
import { normalizeTags } from "@/lib/tags";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 12;

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const requestedPage = Number.parseInt(searchParams.get("page") || "1", 10);
    const requestedLimit = Number.parseInt(
      searchParams.get("limit") || `${DEFAULT_LIMIT}`,
      10,
    );
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all";

    const currentPage = Number.isNaN(requestedPage)
      ? 1
      : Math.max(1, requestedPage);
    const limit = Number.isNaN(requestedLimit)
      ? DEFAULT_LIMIT
      : Math.min(MAX_LIMIT, Math.max(1, requestedLimit));

    const recipes = await Recipe.find({}).sort({ _id: -1 }).lean();
    const normalizedRecipes = recipes.map((recipe) => ({
      ...recipe,
      tag: normalizeTags(Array.isArray(recipe.tag) ? recipe.tag : []),
    }));

    const activeFilter =
      RECIPE_FILTERS.find((recipeFilter) => recipeFilter.key === filter) ||
      RECIPE_FILTERS[0];
    const normalizedSearch = normalizeText(search.trim());

    const matchingRecipes = normalizedRecipes.filter((recipe) => {
      const searchableText = normalizeText(
        [
          recipe.name,
          recipe.description,
          ...(recipe.tag || []),
          recipe.authorName,
          recipe.sourceName,
          recipe.ingredients,
        ]
          .filter(Boolean)
          .join(" "),
      );

      const matchesFilter =
        activeFilter.key === "all" ||
        activeFilter.keywords.some((keyword) =>
          searchableText.includes(normalizeText(keyword)),
        );

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return searchableText.includes(normalizedSearch);
    });

    const total = matchingRecipes.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * limit;
    const paginatedRecipes = matchingRecipes.slice(
      startIndex,
      startIndex + limit,
    );

    return NextResponse.json({
      success: true,
      data: paginatedRecipes,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipes" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = getSessionFromCookies(await cookies());

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Please sign in to add a recipe" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      tag,
      cookingTime,
      imageSrc,
      ingredients,
      link,
      prepTime,
      instructions,
      servings,
      sourceUrl,
      sourceName,
    } = body;
    const normalizedTags = normalizeTags(Array.isArray(tag) ? tag : []);

    const newRecipe = new Recipe({
      name,
      description,
      tag: normalizedTags,
      cookingTime,
      imageSrc,
      ingredients,
      link,
      prepTime,
      instructions,
      servings,
      sourceUrl,
      sourceName,
      authorId: session.userId,
      authorName: session.name,
    });

    await newRecipe.save();

    return NextResponse.json(
      { success: true, data: newRecipe },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create recipe" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, ...updateFields } = body;

    if ("tag" in updateFields) {
      updateFields.tag = normalizeTags(
        Array.isArray(updateFields.tag) ? updateFields.tag : [],
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 },
      );
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedRecipe) {
      return NextResponse.json(
        { success: false, error: "Recipe not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updatedRecipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update recipe" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const session = getSessionFromCookies(await cookies());
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Please sign in to delete a recipe" },
        { status: 401 },
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 },
      );
    }

    const deletedRecipe = await Recipe.findOneAndDelete({
      _id: id,
      authorId: session.userId,
    });

    if (!deletedRecipe) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipe not found or you do not have permission to delete it",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: deletedRecipe });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete recipe" },
      { status: 500 },
    );
  }
}
