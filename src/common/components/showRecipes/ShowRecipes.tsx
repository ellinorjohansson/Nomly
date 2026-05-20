import { useDeferredValue, useEffect, useState } from "react";
import OverviewRecipe from "../overviewRecipe/OverviewRecipe";
import { getRecipes } from "@/services/recipeService";
import RecipeCardSkeleton from "@/common/modules/skeleton/RecipeCardSkeleton";
import { IRecipe } from "@/models/Recipe";
import { normalizeTags } from "@/lib/tags";
import { normalizeText, RECIPE_FILTERS } from "@/lib/recipeFilters";

const RECIPES_PER_PAGE = 12;
const VISIBILITY_FILTERS = [
  { key: "all", label: "All" },
  { key: "public", label: "Public" },
  { key: "private", label: "Private" },
] as const;

type VisibilityFilter = (typeof VISIBILITY_FILTERS)[number]["key"];

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
        addedByUser: showOnlyUserRecipes,
      });

      setRecipes(
        data.recipes.map((recipe) => ({
          ...recipe,
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
    showOnlyUserRecipes,
  ]);

  const hasActiveFilters =
    Boolean(normalizedSearchQuery) ||
    selectedFilter !== "all" ||
    visibilityFilter !== "all" ||
    showOnlyUserRecipes;

  return (
    <section className="space-y-6 sm:px-4">
      <div className="rounded-3xl border border-primaryaccent/10 bg-secondary/70 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="max-w-2xl space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondaryaccent">
              Filter recipes
            </p>
            <h2 className="text-2xl font-serif font-bold text-primaryaccent">
              Find something you want to cook
            </h2>
            <p className="text-sm text-primaryaccent/70">
              Search by recipe name, description, ingredient, or author, then
              narrow it down with fixed categories that are easier to scan.
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
                setShowOnlyUserRecipes(false);
                setCurrentPage(1);
              }}
              disabled={!hasActiveFilters}
              className="w-full rounded-2xl border border-primaryaccent/15 px-4 py-3 text-sm font-medium text-primaryaccent transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 md:w-auto"
            >
              Clear filters
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
              Added by you
            </button>
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
            Showing {recipes.length} of {totalRecipes} recipes
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
              No recipes match this filter
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-primaryaccent/65">
              Try a broader search term or switch back to Alla to see more
              recipes.
            </p>
          </div>
        ) : (
          <p className="col-span-full py-12 text-center text-secondaryaccent">
            No recipes
          </p>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-primaryaccent/10 bg-white/70 px-4 py-4 sm:flex-row">
          <p className="text-sm text-primaryaccent/65">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="flex-1 cursor-pointer rounded-2xl border border-primaryaccent/15 px-4 py-2 text-sm font-medium text-primaryaccent transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="flex-1 cursor-pointer rounded-2xl bg-primaryaccent px-4 py-2 text-sm font-medium text-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShowRecipes;
