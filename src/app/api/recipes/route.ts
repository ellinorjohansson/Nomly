import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionFromCookies } from "@/lib/auth";
import connectDB from "@/lib/db";
import { parseDurationToMinutes } from "@/lib/duration";
import {
  matchesNormalizedKeyword,
  normalizeText,
  RECIPE_FILTERS,
} from "@/lib/recipeFilters";
import Recipe from "@/models/Recipe";
import { normalizeTags } from "@/lib/tags";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 12;

type VisibilityFilter = "all" | "public" | "private";

const getVisibilityFilter = (value: string | null): VisibilityFilter => {
  if (value === "public" || value === "private") {
    return value;
  }

  return "all";
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = getSessionFromCookies(await cookies());
    const { searchParams } = new URL(request.url);
    const requestedPage = Number.parseInt(searchParams.get("page") || "1", 10);
    const requestedLimit = Number.parseInt(
      searchParams.get("limit") || `${DEFAULT_LIMIT}`,
      10,
    );
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all";
    const visibility = getVisibilityFilter(searchParams.get("visibility"));
    const addedByUser = searchParams.get("addedByUser") === "true";

    const currentPage = Number.isNaN(requestedPage)
      ? 1
      : Math.max(1, requestedPage);
    const limit = Number.isNaN(requestedLimit)
      ? DEFAULT_LIMIT
      : Math.min(MAX_LIMIT, Math.max(1, requestedLimit));

    const publicRecipeQuery = { isPrivate: { $ne: true } };
    const visibilityQuery =
      visibility === "public"
        ? publicRecipeQuery
        : visibility === "private"
          ? session
            ? { isPrivate: true, authorId: session.userId }
            : { _id: null }
          : session
            ? {
                $or: [publicRecipeQuery, { authorId: session.userId }],
              }
            : publicRecipeQuery;

    const addedByUserQuery = addedByUser
      ? session
        ? {
            $or: [{ authorId: session.userId }, { authorName: session.name }],
          }
        : { _id: null }
      : null;

    const recipeQuery = addedByUserQuery
      ? {
          $and: [visibilityQuery, addedByUserQuery],
        }
      : visibilityQuery;

    const recipes = await Recipe.find(recipeQuery).sort({ _id: -1 }).lean();
    const normalizedRecipes = recipes.map((recipe) => ({
      ...recipe,
      isPrivate: Boolean(recipe.isPrivate),
      tag: normalizeTags(Array.isArray(recipe.tag) ? recipe.tag : []),
    }));

    const activeFilter =
      RECIPE_FILTERS.find((recipeFilter) => recipeFilter.key === filter) ||
      RECIPE_FILTERS[0];
    const normalizedSearch = normalizeText(search.trim());

    const matchingRecipes = normalizedRecipes.filter((recipe) => {
      const filterableText = [recipe.name, ...(recipe.tag || [])]
        .filter(Boolean)
        .join(" ");

      const searchableText = normalizeText(
        [
          recipe.name,
          ...(recipe.tag || []),
          recipe.description,
          recipe.authorName,
          recipe.sourceName,
          recipe.ingredients,
        ]
          .filter(Boolean)
          .join(" "),
      );

      const prepMinutes = parseDurationToMinutes(recipe.prepTime);
      const cookingMinutes = parseDurationToMinutes(recipe.cookingTime);
      const totalMinutes =
        prepMinutes !== null && cookingMinutes !== null
          ? prepMinutes + cookingMinutes
          : (prepMinutes ?? cookingMinutes);

      const matchesFilter =
        activeFilter.key === "all" ||
        (activeFilter.key === "snabbt"
          ? (totalMinutes !== null && totalMinutes <= 30) ||
            activeFilter.keywords.some((keyword) =>
              matchesNormalizedKeyword(filterableText, keyword),
            )
          : activeFilter.keywords.some((keyword) =>
              matchesNormalizedKeyword(filterableText, keyword),
            ));

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
      isPrivate,
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
      isPrivate: Boolean(isPrivate),
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
    const session = getSessionFromCookies(await cookies());
    const body = await request.json();
    const { id, ...updateFields } = body;

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Please sign in to update a recipe" },
        { status: 401 },
      );
    }

    if ("tag" in updateFields) {
      updateFields.tag = normalizeTags(
        Array.isArray(updateFields.tag) ? updateFields.tag : [],
      );
    }

    if ("isPrivate" in updateFields) {
      updateFields.isPrivate = Boolean(updateFields.isPrivate);
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 },
      );
    }

    const updatedRecipe = await Recipe.findOneAndUpdate(
      {
        _id: id,
        authorId: session.userId,
      },
      updateFields,
      {
        new: true,
      },
    );

    if (!updatedRecipe) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipe not found or you do not have permission to edit it",
        },
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
