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
import { normalizeRecipeType, type RecipeType } from "@/lib/recipeType";
import { normalizeTags } from "@/lib/tags";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 12;

type VisibilityFilter = "all" | "public" | "private";
type RecipeTypeFilter = "all" | RecipeType;

const getVisibilityFilter = (value: string | null): VisibilityFilter => {
  if (value === "public" || value === "private") {
    return value;
  }

  return "all";
};

const getRecipeTypeFilter = (value: string | null): RecipeTypeFilter => {
  if (value === "all" || value === null) {
    return "all";
  }

  return normalizeRecipeType(value);
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
    const recipeType = getRecipeTypeFilter(searchParams.get("recipeType"));
    const addedByUser = searchParams.get("addedByUser") === "true";
    const shouldPickRandom = searchParams.get("random") === "true";

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
      recipeType: normalizeRecipeType(recipe.recipeType),
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

      if (recipeType !== "all" && recipe.recipeType !== recipeType) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return searchableText.includes(normalizedSearch);
    });

    if (shouldPickRandom) {
      if (!matchingRecipes.length) {
        return NextResponse.json({ success: true, data: null });
      }

      const randomIndex = Math.floor(Math.random() * matchingRecipes.length);
      return NextResponse.json({
        success: true,
        data: matchingRecipes[randomIndex],
      });
    }

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
    console.error("Fel vid hämtning av recept:", error);
    return NextResponse.json(
      { success: false, error: "Det gick inte att hämta recept" },
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
        { success: false, error: "Logga in för att lägga till ett recept" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      recipeType,
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
    const normalizedRecipeType = normalizeRecipeType(recipeType);

    const newRecipe = new Recipe({
      name,
      description,
      recipeType: normalizedRecipeType,
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
    console.error("Fel vid skapande av recept:", error);
    return NextResponse.json(
      { success: false, error: "Det gick inte att skapa receptet" },
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
        { success: false, error: "Logga in för att uppdatera ett recept" },
        { status: 401 },
      );
    }

    if ("tag" in updateFields) {
      updateFields.tag = normalizeTags(
        Array.isArray(updateFields.tag) ? updateFields.tag : [],
      );
    }

    if ("recipeType" in updateFields) {
      updateFields.recipeType = normalizeRecipeType(updateFields.recipeType);
    }

    if ("isPrivate" in updateFields) {
      updateFields.isPrivate = Boolean(updateFields.isPrivate);
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID krävs" },
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
          error:
            "Receptet hittades inte eller så har du inte behörighet att redigera det",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updatedRecipe });
  } catch (error) {
    console.error("Fel vid uppdatering av recept:", error);
    return NextResponse.json(
      { success: false, error: "Det gick inte att uppdatera receptet" },
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
        { success: false, error: "Logga in för att ta bort ett recept" },
        { status: 401 },
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID krävs" },
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
          error:
            "Receptet hittades inte eller så har du inte behörighet att ta bort det",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: deletedRecipe });
  } catch (error) {
    console.error("Fel vid borttagning av recept:", error);
    return NextResponse.json(
      { success: false, error: "Det gick inte att ta bort receptet" },
      { status: 500 },
    );
  }
}
