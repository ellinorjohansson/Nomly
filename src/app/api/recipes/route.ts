import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionFromCookies } from "@/lib/auth";
import connectDB from "@/lib/db";
import Recipe from "@/models/Recipe";
import { normalizeTags } from "@/lib/tags";

export async function GET() {
  try {
    await connectDB();
    const recipes = await Recipe.find({}).lean();
    const normalizedRecipes = recipes.map((recipe) => ({
      ...recipe,
      tag: normalizeTags(Array.isArray(recipe.tag) ? recipe.tag : []),
    }));

    return NextResponse.json({ success: true, data: normalizedRecipes });
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
