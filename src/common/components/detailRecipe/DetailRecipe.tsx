import type { IRecipe } from "@/models/Recipe";

interface DetailRecipeProps {
  recipe: IRecipe;
}

const DetailRecipe = ({ recipe }: DetailRecipeProps) => {
  const tags = recipe.tag || [];
  const sourceLabel = recipe.sourceName || recipe.sourceUrl || recipe.link;
  const sourceHref = recipe.sourceUrl || recipe.link;
  const ingredientsList = (recipe.ingredients || "")
    .split("\n")
    .filter((item) => item.trim() !== "");
  const instructionsList = (recipe.instructions || "")
    .split("\n")
    .filter((item) => item.trim() !== "");

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
      {/* Image */}
      <div className="relative w-full h-80 bg-linear-to-br from-secondaryaccent/10 to-primaryaccent/10 overflow-hidden">
        {recipe.imageSrc ? (
          <img
            src={recipe.imageSrc}
            alt={recipe.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-8xl text-primaryaccent/20">
              restaurant
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Title */}
        <h3 className="text-3xl font-serif font-bold text-primaryaccent mb-2 line-clamp-2">
          {recipe.name}
        </h3>

        {/* Description */}
        {recipe.description && (
          <p className="text-base text-primaryaccent/70 mb-6 leading-relaxed">
            {recipe.description}
          </p>
        )}

        {/* Meta info */}
        {(recipe.prepTime || recipe.cookingTime || recipe.servings) && (
          <div className="flex flex-wrap gap-4 mb-8 p-4 bg-secondary rounded-2xl">
            {recipe.prepTime && (
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primaryaccent/10 rounded-lg">
                  <span className="material-symbols-outlined text-primaryaccent">
                    schedule
                  </span>
                </div>
                <div className="text-sm">
                  <div className="text-primaryaccent/60 text-xs">Prep</div>
                  <div className="font-semibold text-primaryaccent">
                    {recipe.prepTime}m
                  </div>
                </div>
              </div>
            )}
            {recipe.cookingTime && (
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primaryaccent/10 rounded-lg">
                  <span className="material-symbols-outlined text-primaryaccent">
                    restaurant
                  </span>
                </div>
                <div className="text-sm">
                  <div className="text-primaryaccent/60 text-xs">Cook</div>
                  <div className="font-semibold text-primaryaccent">
                    {recipe.cookingTime}m
                  </div>
                </div>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primaryaccent/10 rounded-lg">
                  <span className="material-symbols-outlined text-primaryaccent">
                    people
                  </span>
                </div>
                <div className="text-sm">
                  <div className="text-primaryaccent/60 text-xs">Servings</div>
                  <div className="font-semibold text-primaryaccent">
                    {recipe.servings}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ingredients */}
        {ingredientsList.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primaryaccent">
                shopping_basket
              </span>
              <h4 className="text-lg font-semibold text-primaryaccent">
                Ingredients
              </h4>
            </div>
            <ul className="space-y-2">
              {ingredientsList.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <span className="text-primaryaccent font-bold">✓</span>
                  <span className="text-primaryaccent">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructions */}
        {instructionsList.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primaryaccent">
                info
              </span>
              <h4 className="text-lg font-semibold text-primaryaccent">
                Instructions
              </h4>
            </div>
            <div className="space-y-3">
              {instructionsList.map((instruction, index) => (
                <div key={index} className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primaryaccent text-white text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <p className="text-primaryaccent pt-1">{instruction}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primaryaccent/10 text-primaryaccent rounded-full text-sm font-medium hover:bg-primaryaccent/20 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Source */}
        {sourceLabel && (
          <div className="pt-6 border-t border-primaryaccent/10">
            <p className="text-xs text-primaryaccent/60 mb-1">Source</p>
            {sourceHref ? (
              <a
                href={sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primaryaccent font-medium hover:text-primaryaccent/70 hover:underline transition-colors break-all"
              >
                {sourceLabel}
              </a>
            ) : (
              <p className="text-primaryaccent font-medium break-all">{sourceLabel}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailRecipe;
