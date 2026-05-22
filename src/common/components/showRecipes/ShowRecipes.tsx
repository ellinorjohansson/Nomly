import { useDeferredValue, useEffect, useState } from "react";
import OverviewRecipe from "../overviewRecipe/OverviewRecipe";
import { getRecipes } from "@/services/recipeService";
import RecipeCardSkeleton from "@/common/modules/skeleton/RecipeCardSkeleton";
import { IRecipe } from "@/models/Recipe";
import {
  normalizeRecipeType,
  RECIPE_TYPE_OPTIONS,
  type RecipeType,
} from "@/lib/recipeType";
import { normalizeTags } from "@/lib/tags";
import { normalizeText, RECIPE_FILTERS } from "@/lib/recipeFilters";

const RECIPES_PER_PAGE = 12;
const VISIBILITY_FILTERS = [
  { key: "all", label: "Alla" },
  { key: "public", label: "Offentliga" },
  { key: "private", label: "Privata" },
] as const;

const DISH_TYPE_FILTERS = [
  { key: "all", label: "Alla rätter" },
  ...RECIPE_TYPE_OPTIONS.map((option) => ({
    key: option.value,
    label: option.label,
  })),
] as const;

type VisibilityFilter = (typeof VISIBILITY_FILTERS)[number]["key"];
type DishTypeFilter = "all" | RecipeType;

const ShowRecipes = () => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>("all");
  const [dishTypeFilter, setDishTypeFilter] = useState<DishTypeFilter>("all");
  const [showOnlyUserRecipes, setShowOnlyUserRecipes] = useState(false);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedSearchQuery = normalizeText(deferredSearchQuery.trim());

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      const data = await getRecipes({
        page: currentPage,
        limit: RECIPES_PER_PAGE,
        search: normalizedSearchQuery,
        filter: selectedFilter,
        visibility: visibilityFilter,
        recipeType: dishTypeFilter,
        addedByUser: showOnlyUserRecipes,
      });

      setRecipes(
        data.recipes.map((recipe) => ({
          ...recipe,
          recipeType: normalizeRecipeType(recipe.recipeType),
          isPrivate: Boolean(recipe.isPrivate),
          tag: normalizeTags(recipe.tag || []),
        })),
      );
      setCurrentPage(data.page);
      setTotalRecipes(data.total);
      setTotalPages(data.totalPages);
      setLoading(false);
    }

    fetchRecipes();
  }, [
    currentPage,
    normalizedSearchQuery,
    selectedFilter,
    visibilityFilter,
    dishTypeFilter,
    showOnlyUserRecipes,
  ]);

  const hasActiveFilters =
    Boolean(normalizedSearchQuery) ||
    selectedFilter !== "all" ||
    visibilityFilter !== "all" ||
    dishTypeFilter !== "all" ||
    showOnlyUserRecipes;

  return (
    <section className="space-y-6 sm:px-4">
      <div className="rounded-3xl border border-primaryaccent/10 bg-secondary/70 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="max-w-2xl space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondaryaccent">
              Filtrera recept
            </p>
            <h2 className="text-2xl font-serif font-bold text-primaryaccent">
              Hitta något du vill laga
            </h2>
            <p className="text-sm text-primaryaccent/70">
              Sök på receptnamn, beskrivning, ingrediens eller författare och
              filtrera sedan vidare med kategorier.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <label className="relative block min-w-0">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-primaryaccent/45">
                <span className="material-symbols-outlined text-[18px]">
                  search
                </span>
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Sök recept, ingredienser eller författare"
                className="w-full rounded-2xl border border-primaryaccent/15 bg-white py-3 pl-11 pr-4 text-sm text-primaryaccent outline-none transition placeholder:text-primaryaccent/35 focus:border-primaryaccent/35"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
                setVisibilityFilter("all");
                setDishTypeFilter("all");
                setShowOnlyUserRecipes(false);
                setCurrentPage(1);
              }}
              disabled={!hasActiveFilters}
              className="w-full rounded-2xl border border-primaryaccent/15 px-4 py-3 text-sm font-medium text-primaryaccent transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 md:w-auto"
            >
              Rensa filter
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {VISIBILITY_FILTERS.map((filter) => {
              const isActive = visibilityFilter === filter.key;

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => {
                    setVisibilityFilter(filter.key);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-primaryaccent text-primary shadow-sm"
                      : "bg-white text-primaryaccent hover:bg-white/80"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setShowOnlyUserRecipes((value) => !value);
                setCurrentPage(1);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                showOnlyUserRecipes
                  ? "bg-secondaryaccent text-white shadow-sm"
                  : "bg-white text-primaryaccent hover:bg-white/80"
              }`}
            >
              Tillagda av dig
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {DISH_TYPE_FILTERS.map((filter) => {
              const isActive = dishTypeFilter === filter.key;

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => {
                    setDishTypeFilter(filter.key);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? filter.key === "all"
                        ? "bg-primaryaccent text-primary shadow-sm"
                        : "bg-secondaryaccent text-white shadow-sm"
                      : "bg-white text-primaryaccent hover:bg-white/80"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {RECIPE_FILTERS.map((filter) => {
            const isActive = selectedFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => {
                  setSelectedFilter(filter.key);
                  setCurrentPage(1);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? filter.key === "all"
                      ? "bg-primaryaccent text-primary shadow-sm"
                      : "bg-secondaryaccent text-white shadow-sm"
                    : "bg-white text-primaryaccent hover:bg-white/80"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {!loading && (
          <p className="mt-4 text-sm text-primaryaccent/60">
            Visar {recipes.length} av {totalRecipes} recept
          </p>
        )}
      </div>

      <div className="grid auto-rows-fr grid-cols-1 gap-6 py-2 sm:grid-cols-2 lg:grid-cols-3 lg:py-4 justify-items-stretch">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="w-full">
              <RecipeCardSkeleton />
            </div>
          ))
        ) : recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <OverviewRecipe
              key={recipe._id || index}
              id={recipe._id || ""}
              name={recipe.name}
              description={recipe.description}
              isPrivate={recipe.isPrivate}
              tag={recipe.tag}
              cookingTime={recipe.cookingTime}
              imageSrc={recipe.imageSrc}
            />
          ))
        ) : hasActiveFilters ? (
          <div className="col-span-full rounded-3xl border border-dashed border-primaryaccent/15 bg-white/70 px-6 py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-primaryaccent/35">
              search_off
            </span>
            <h3 className="mt-3 text-xl font-serif font-bold text-primaryaccent">
              Inga recept matchar filtret
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-primaryaccent/65">
              Prova en bredare sokning eller byt tillbaka till Alla for att se
              fler recept.
            </p>
          </div>
        ) : (
          <p className="col-span-full py-12 text-center text-secondaryaccent">
            Inga recept
          </p>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-primaryaccent/10 bg-white/70 px-4 py-4 sm:flex-row">
          <p className="text-sm text-primaryaccent/65">
            Sida {currentPage} av {totalPages}
          </p>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="flex-1 cursor-pointer rounded-2xl border border-primaryaccent/15 px-4 py-2 text-sm font-medium text-primaryaccent transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none"
            >
              Förra
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="flex-1 cursor-pointer rounded-2xl bg-primaryaccent px-4 py-2 text-sm font-medium text-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none"
            >
              Nästa
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShowRecipes;
