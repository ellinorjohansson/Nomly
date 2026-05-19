import OverviewRecipe from "@/common/components/overviewRecipe/OverviewRecipe";
import connectDB from "@/lib/db";
import Recipe from "@/models/Recipe";
import { normalizeTags } from "@/lib/tags";

const MENU_DAYS = ["Monday", "Wednesday", "Friday"];
const RECIPES_PER_WEEK = MENU_DAYS.length;

interface WeeklyMenuRecipe {
  _id: string;
  name: string;
  description: string;
  imageSrc: string;
  tag: string[];
  cookingTime: string;
}

const getWeeklyKey = (date: Date) => {
  const utcDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const day = utcDate.getUTCDay() || 7;

  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(
    ((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );

  return `${utcDate.getUTCFullYear()}-${weekNumber}`;
};

const hashString = (value: string) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const pickWeeklyRecipes = (recipes: WeeklyMenuRecipe[], weeklyKey: string) =>
  [...recipes]
    .sort(
      (left, right) =>
        hashString(`${weeklyKey}:${left._id}`) -
        hashString(`${weeklyKey}:${right._id}`),
    )
    .slice(0, RECIPES_PER_WEEK);

const WeeklyMenu = async () => {
  await connectDB();

  const recipes = await Recipe.find({ isPrivate: { $ne: true } })
    .select("name description imageSrc tag cookingTime")
    .lean();

  const normalizedRecipes: WeeklyMenuRecipe[] = recipes.map((recipe) => ({
    _id: String(recipe._id),
    name: recipe.name || "Untitled recipe",
    description: recipe.description || "",
    imageSrc: recipe.imageSrc || "",
    tag: normalizeTags(Array.isArray(recipe.tag) ? recipe.tag : []),
    cookingTime: recipe.cookingTime || "",
  }));

  if (!normalizedRecipes.length) {
    return null;
  }

  const weeklyKey = getWeeklyKey(new Date());
  const weeklyRecipes = pickWeeklyRecipes(normalizedRecipes, weeklyKey);

  return (
    <section className="bg-primary px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondaryaccent">
            Weekly menu
          </p>
          <h2 className="text-3xl font-serif font-bold text-primaryaccent sm:text-4xl">
            Three recipes for this week
          </h2>
          <p className="mt-3 text-base leading-relaxed text-secondaryaccent">
            Nomly picks three different public recipes each week so you always
            have a simple menu plan ready to go.
          </p>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-6 py-2 sm:grid-cols-2 lg:grid-cols-3 lg:py-4 justify-items-stretch">
          {weeklyRecipes.map((recipe, index) => (
            <div key={recipe._id} className="flex w-full flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primaryaccent/60">
                {MENU_DAYS[index]}
              </p>
              <OverviewRecipe
                id={recipe._id}
                name={recipe.name}
                description={recipe.description}
                tag={recipe.tag}
                cookingTime={recipe.cookingTime}
                imageSrc={recipe.imageSrc}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeeklyMenu;
