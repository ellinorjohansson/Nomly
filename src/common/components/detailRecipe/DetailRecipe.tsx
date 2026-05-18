/* eslint-disable @next/next/no-img-element */
import type { IRecipe } from "@/models/Recipe";

interface DetailRecipeProps {
  recipe: IRecipe;
}

const parseMinutes = (value?: string) => {
  if (!value) {
    return null;
  }

  const match = value.match(/\d+/);
  return match ? Number(match[0]) : null;
};

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
  const prepMinutes = parseMinutes(recipe.prepTime);
  const cookingMinutes = parseMinutes(recipe.cookingTime);
  const totalMinutes =
    prepMinutes !== null && cookingMinutes !== null
      ? prepMinutes + cookingMinutes
      : (prepMinutes ?? cookingMinutes);

  return (
    <article className="mx-auto max-w-4xl text-text mb-20">
      <div className="mb-8 aspect-video overflow-hidden rounded-[1.75rem] bg-linear-to-br from-secondary to-primary shadow-xl">
        {recipe.imageSrc ? (
          <img
            src={recipe.imageSrc}
            alt={recipe.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="material-symbols-outlined text-8xl text-primaryaccent/20">
              restaurant
            </span>
          </div>
        )}
      </div>

      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full border border-primaryaccent/10 bg-secondary px-3 py-1 text-xs font-semibold capitalize tracking-[0.02em] text-primaryaccent/85 transition-colors hover:bg-secondaryaccent/15"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h1 className="mb-3 text-4xl font-bold text-primaryaccent md:text-5xl">
        {recipe.name}
      </h1>

      {recipe.description && (
        <p className="mb-6 max-w-3xl text-lg leading-relaxed text-primaryaccent/75">
          {recipe.description}
        </p>
      )}

      {sourceLabel && (
        <p className="mb-6 text-sm text-primaryaccent/60">
          Originally from{" "}
          {sourceHref ? (
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primaryaccent hover:underline"
            >
              {sourceLabel}
              <span className="material-symbols-outlined text-xs!">
                open_in_new
              </span>
            </a>
          ) : (
            <span className=" text-primaryaccent">{sourceLabel}</span>
          )}
        </p>
      )}

      {(totalMinutes !== null ||
        recipe.prepTime ||
        recipe.cookingTime ||
        recipe.servings) && (
        <div className="mb-8 flex flex-wrap gap-3">
          {totalMinutes !== null && (
            <div className="flex items-center gap-3 rounded-2xl border border-primaryaccent/10 bg-white px-4 py-3 shadow-sm">
              <div className="rounded-xl bg-secondaryaccent/15 p-2 text-primaryaccent">
                <span className="material-symbols-outlined text-lg">
                  schedule
                </span>
              </div>
              <div>
                <div className="text-xs text-primaryaccent/55">Total time</div>
                <div className="font-semibold text-primaryaccent">
                  {totalMinutes} min
                </div>
              </div>
            </div>
          )}

          {recipe.prepTime && (
            <div className="flex items-center gap-3 rounded-2xl border border-primaryaccent/10 bg-white px-4 py-3 shadow-sm">
              <div className="rounded-xl bg-primaryaccent/10 p-2 text-primaryaccent">
                <span className="material-symbols-outlined text-lg">
                  restaurant
                </span>
              </div>
              <div>
                <div className="text-xs text-primaryaccent/55">Prep</div>
                <div className="font-semibold text-primaryaccent">
                  {prepMinutes !== null
                    ? `${prepMinutes} min`
                    : recipe.prepTime}
                </div>
              </div>
            </div>
          )}

          {recipe.cookingTime && (
            <div className="flex items-center gap-3 rounded-2xl border border-primaryaccent/10 bg-white px-4 py-3 shadow-sm">
              <div className="rounded-xl bg-secondaryaccent/20 p-2 text-primaryaccent">
                <span className="material-symbols-outlined text-lg">
                  local_fire_department
                </span>
              </div>
              <div>
                <div className="text-xs text-primaryaccent/55">Cook</div>
                <div className="font-semibold text-primaryaccent">
                  {cookingMinutes !== null
                    ? `${cookingMinutes} min`
                    : recipe.cookingTime}
                </div>
              </div>
            </div>
          )}

          {recipe.servings && (
            <div className="flex items-center gap-3 rounded-2xl border border-primaryaccent/10 bg-white px-4 py-3 shadow-sm">
              <div className="rounded-xl bg-primaryaccent/10 p-2 text-primaryaccent">
                <span className="material-symbols-outlined text-lg">group</span>
              </div>
              <div>
                <div className="text-xs text-primaryaccent/55">Servings</div>
                <div className="font-semibold text-primaryaccent">
                  {recipe.servings}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[1fr_1.45fr]">
        {ingredientsList.length > 0 && (
          <section aria-labelledby="ingredients-heading">
            <h2
              id="ingredients-heading"
              className="mb-4 text-2xl font-bold text-primaryaccent"
            >
              Ingredients
            </h2>
            <div className="rounded-2xl border border-primaryaccent/10 bg-white p-5 shadow-sm">
              <ul className="space-y-3">
                {ingredientsList.map((ingredient, index) => (
                  <li key={index} className="flex gap-3 text-sm text-text">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondaryaccent"
                    />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {instructionsList.length > 0 && (
          <section aria-labelledby="instructions-heading">
            <h2
              id="instructions-heading"
              className="mb-4 text-2xl font-bold text-primaryaccent"
            >
              Instructions
            </h2>
            <ol className="space-y-4">
              {instructionsList.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primaryaccent text-sm font-bold text-white"
                  >
                    {index + 1}
                  </span>
                  <p className="pt-1 leading-relaxed text-text">
                    {instruction}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </article>
  );
};

export default DetailRecipe;
