import Link from "next/link";
import { notFound } from "next/navigation";
import DetailRecipe from "@/common/components/detailRecipe/DetailRecipe";
import connectDB from "@/lib/db";
import Recipe from "@/models/Recipe";

interface RecipeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { id } = await params;

  await connectDB();
  const recipe = await Recipe.findById(id).lean();

  if (!recipe) {
    notFound();
  }

  const normalizedRecipe = {
    _id: String(recipe._id),
    name: recipe.name || "",
    description: recipe.description || "",
    imageSrc: recipe.imageSrc || "",
    ingredients: recipe.ingredients || "",
    instructions: recipe.instructions || "",
    prepTime: recipe.prepTime || "",
    cookingTime: recipe.cookingTime || "",
    servings: recipe.servings || "",
    sourceUrl: recipe.sourceUrl || "",
    sourceName: recipe.sourceName || "",
    link: recipe.link || "",
    tag: recipe.tag || [],
  };

  return (
    <main className="min-h-screen bg-primary px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-sm text-primaryaccent/70 transition hover:text-primaryaccent"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to recipes
        </Link>

        <DetailRecipe recipe={normalizedRecipe} />
      </div>
    </main>
  );
}