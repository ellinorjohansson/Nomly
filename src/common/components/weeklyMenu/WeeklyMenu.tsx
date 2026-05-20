"use client";

import { useEffect, useState } from "react";
import OverviewRecipe from "@/common/components/overviewRecipe/OverviewRecipe";
import RecipeCardSkeleton from "@/common/modules/skeleton/RecipeCardSkeleton";
import { WEEKLY_MENU_DAYS, type WeeklyMenuRecipe } from "@/lib/weeklyMenu";

const WeeklyMenu = () => {
  const [weeklyRecipes, setWeeklyRecipes] = useState<WeeklyMenuRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadWeeklyMenu = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/weekly-menu", {
          cache: "no-store",
        });

        const payload = await response.json().catch(() => null);

        if (!isMounted) {
          return;
        }

        if (response.ok && payload?.success) {
          setWeeklyRecipes(payload.data || []);
        } else {
          setWeeklyRecipes([]);
        }
      } catch {
        if (isMounted) {
          setWeeklyRecipes([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadWeeklyMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isLoading && !weeklyRecipes.length) {
    return null;
  }

  return (
    <section className="bg-primary px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondaryaccent">
            Veckomeny
          </p>
          <h2 className="text-3xl font-serif font-bold text-primaryaccent sm:text-4xl">
            Tre recept för veckan
          </h2>
          <p className="mt-3 text-base leading-relaxed text-secondaryaccent">
            Nomly väljer tre olika offentliga recept varje vecka så att du
            alltid har en enkel menyplan redo.
          </p>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-6 py-2 sm:grid-cols-2 lg:grid-cols-3 lg:py-4 justify-items-stretch">
          {isLoading
            ? WEEKLY_MENU_DAYS.map((day) => (
                <div key={day} className="flex w-full flex-col gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primaryaccent/60">
                    {day}
                  </p>
                  <div className="w-full">
                    <RecipeCardSkeleton />
                  </div>
                </div>
              ))
            : weeklyRecipes.map((recipe, index) => (
                <div key={recipe._id} className="flex w-full flex-col gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primaryaccent/60">
                    {WEEKLY_MENU_DAYS[index]}
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
