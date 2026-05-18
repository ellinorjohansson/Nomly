import { useDeferredValue, useEffect, useState } from "react";
import OverviewRecipe from "../overviewRecipe/OverviewRecipe";
import { getRecipes } from "@/services/recipeService";
import RecipeCardSkeleton from "@/common/modules/skeleton/RecipeCardSkeleton";
import { IRecipe } from "@/models/Recipe";
import { normalizeTags } from "@/lib/tags";

const RECIPE_FILTERS = [
  { key: "all", label: "Alla", keywords: [] },
  {
    key: "efterratt",
    label: "Efterrätt",
    keywords: [
      "efterratt",
      "dessert",
      "cake",
      "cookie",
      "sweet",
      "kladdkaka",
      "paj",
      "brownie",
      "glass",
    ],
  },
  {
    key: "pasta",
    label: "Pasta",
    keywords: [
      "pasta",
      "spaghetti",
      "penne",
      "lasagne",
      "macaroni",
      "tagliatelle",
      "fettuccine",
      "linguine",
    ],
  },
  {
    key: "ris",
    label: "Ris",
    keywords: ["ris", "rice", "fried rice", "risotto"],
  },
  {
    key: "bulgur",
    label: "Bulgur",
    keywords: ["bulgur"],
  },
  {
    key: "gryta",
    label: "Gryta",
    keywords: ["gryta", "stew", "casserole", "ragu"],
  },
  {
    key: "kyckling",
    label: "Kyckling",
    keywords: ["kyckling", "chicken"],
  },
  {
    key: "kott",
    label: "Kött",
    keywords: ["kött", "kott", "beef", "pork", "lamb", "meat"],
  },
  {
    key: "fisk",
    label: "Fisk",
    keywords: ["fisk", "fish", "lax", "salmon", "torsk", "cod"],
  },
  {
    key: "vegetariskt",
    label: "Vegetariskt",
    keywords: [
      "vegetarisk",
      "vegetariskt",
      "vegetarian",
      "veggie",
      "halloumi",
      "linser",
      "lentil",
      "tofu",
    ],
  },
  {
    key: "soppa",
    label: "Soppa",
    keywords: ["soppa", "soup", "broth"],
  },
  {
    key: "sallad",
    label: "Sallad",
    keywords: ["sallad", "salad"],
  },
  {
    key: "snabbt",
    label: "Snabbt",
    keywords: ["snabb", "quick", "easy", "15 min", "20 min", "30 min"],
  },
  {
    key: "ugn",
    label: "Ugn",
    keywords: ["ugn", "oven", "bakad", "roasted", "baked"],
  },
];

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const ShowRecipes = () => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      const data: IRecipe[] = await getRecipes();
      setRecipes(
        data.map((recipe) => ({
          ...recipe,
          tag: normalizeTags(recipe.tag || []),
        })),
      );
      setLoading(false);
    }
    fetchRecipes();
  }, []);

  const normalizedSearchQuery = normalizeText(deferredSearchQuery.trim());
  const activeFilter =
    RECIPE_FILTERS.find((filter) => filter.key === selectedFilter) ||
    RECIPE_FILTERS[0];

  const filteredRecipes = recipes.filter((recipe) => {
    const searchableText = normalizeText(
      [
        recipe.name,
        recipe.description,
        ...(recipe.tag || []),
        recipe.authorName,
        recipe.sourceName,
        recipe.ingredients,
      ]
        .filter(Boolean)
        .join(" "),
    );

    const matchesFilter =
      activeFilter.key === "all" ||
      activeFilter.keywords.some((keyword) =>
        searchableText.includes(normalizeText(keyword)),
      );

    if (!matchesFilter) {
      return false;
    }

    if (!normalizedSearchQuery) {
      return true;
    }

    return searchableText.includes(normalizedSearchQuery);
  });

  const hasActiveFilters =
    Boolean(normalizedSearchQuery) || selectedFilter !== "all";

  return (
    <section className="space-y-6 sm:px-4">
      <div className="rounded-3xl border border-primaryaccent/10 bg-secondary/70 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="max-w-2xl space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondaryaccent">
              Filter recipes
            </p>
            <h2 className="text-2xl font-serif font-bold text-primaryaccent">
              Find something you actually want to cook
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
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Sök recept, ingredienser eller författare"
                className="w-full rounded-2xl border border-primaryaccent/15 bg-white py-3 pl-11 pr-4 text-sm text-primaryaccent outline-none transition placeholder:text-primaryaccent/35 focus:border-primaryaccent/35"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
              }}
              disabled={!hasActiveFilters}
              className="w-full rounded-2xl border border-primaryaccent/15 px-4 py-3 text-sm font-medium text-primaryaccent transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 md:w-auto"
            >
              Clear filters
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
                onClick={() => setSelectedFilter(filter.key)}
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
            Showing {filteredRecipes.length} of {recipes.length} recipes
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
        ) : filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe, index) => (
            <OverviewRecipe
              key={recipe._id || index}
              id={recipe._id || ""}
              name={recipe.name}
              description={recipe.description}
              tag={recipe.tag}
              cookingTime={recipe.cookingTime}
              imageSrc={recipe.imageSrc}
            />
          ))
        ) : recipes.length > 0 ? (
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
    </section>
  );
};

export default ShowRecipes;
