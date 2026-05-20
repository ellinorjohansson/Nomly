import { IRecipe } from "@/models/Recipe";
import { type RecipeType } from "@/lib/recipeType";

interface GetRecipesOptions {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
  visibility?: "all" | "public" | "private";
  recipeType?: "all" | RecipeType;
  addedByUser?: boolean;
}

interface GetRecipesResponse {
  recipes: IRecipe[];
  page: number;
  total: number;
  totalPages: number;
}

export async function getRecipes({
  page = 1,
  limit = 12,
  search = "",
  filter = "all",
  visibility = "all",
  recipeType = "all",
  addedByUser = false,
}: GetRecipesOptions = {}): Promise<GetRecipesResponse> {
  try {
    const params = new URLSearchParams({
      page: `${page}`,
      limit: `${limit}`,
      search,
      filter,
      visibility,
      recipeType,
      addedByUser: addedByUser ? "true" : "false",
    });

    const res = await fetch(`/api/recipes?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Det gick inte att hämta recept");
    }

    const data = await res.json();
    return {
      recipes: data.data || [],
      page: data.pagination?.page || 1,
      total: data.pagination?.total || 0,
      totalPages: data.pagination?.totalPages || 1,
    };
  } catch (error) {
    console.error("Fel vid hämtning av recept:", error);
    return {
      recipes: [],
      page: 1,
      total: 0,
      totalPages: 1,
    };
  }
}
