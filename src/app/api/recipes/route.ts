import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Recipe from "@/models/Recipe";

export async function GET() {
  try {
    await connectDB();
    const recipes = await Recipe.find({}).lean();
    return NextResponse.json({ success: true, data: recipes });
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
    const body = await request.json();
    const { name, description, tag, cookingTime, imageSrc } = body;

    const newRecipe = new Recipe({
      name,
      description,
      tag,
      cookingTime,
      imageSrc,
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 },
      );
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return NextResponse.json(
        { success: false, error: "Recipe not found" },
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
