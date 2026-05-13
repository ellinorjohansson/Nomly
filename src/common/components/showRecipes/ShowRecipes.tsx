import { useEffect, useState } from "react";
import OverviewRecipe from "../overviewRecipe/OverviewRecipe";
import { getRecipes } from "@/services/recipeService";
import RecipeCardSkeleton from "@/common/modules/skeleton/RecipeCardSkeleton";
import { IRecipe } from "@/models/Recipe";

const ShowRecipes = () => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<IRecipe[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      const data: IRecipe[] = await getRecipes();
      setRecipes(data);
      setLoading(false);
    }
    fetchRecipes();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 justify-items-center auto-rows-fr">
      {loading ? (
        [...Array(6)].map((_, i) => (
          <div key={i} className="w-full">
            <RecipeCardSkeleton />
          </div>
        ))
      ) : recipes.length > 0 ? (
        recipes.map((recipe, index) => (
          <OverviewRecipe
            key={index}
            name={recipe.name}
            description={recipe.description}
            tag={recipe.tag}
            cookingTime={recipe.cookingTime}
            imageSrc={recipe.imageSrc}
          />
        ))
      ) : (
        <p className="col-span-full text-center py-12 text-secondaryaccent">
          No recipes
        </p>
      )}
    </div>
  );
};

export default ShowRecipes;
