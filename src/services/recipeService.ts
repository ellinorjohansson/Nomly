import { IRecipe } from "@/models/Recipe";

interface GetRecipesOptions {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
  visibility?: "all" | "public" | "private";
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
  addedByUser = false,
}: GetRecipesOptions = {}): Promise<GetRecipesResponse> {
  try {
    const params = new URLSearchParams({
      page: `${page}`,
      limit: `${limit}`,
      search,
      filter,
      visibility,
      addedByUser: addedByUser ? "true" : "false",
    });

    const res = await fetch(`/api/recipes?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await res.json();
    return {
      recipes: data.data || [],
      page: data.pagination?.page || 1,
      total: data.pagination?.total || 0,
      totalPages: data.pagination?.totalPages || 1,
    };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return {
      recipes: [],
      page: 1,
      total: 0,
      totalPages: 1,
    };
  }
}
