import { IRecipe } from "@/models/Recipe";

export async function getRecipes(): Promise<IRecipe[]> {
  try {
    const res = await fetch("/api/recipes", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}
