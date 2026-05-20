import { type RecipeType } from "@/lib/recipeType";

export const WEEKLY_MENU_DAYS = ["Måndag", "Onsdag", "Fredag"];
export const WEEKLY_MENU_SIZE = WEEKLY_MENU_DAYS.length;

export interface WeeklyMenuRecipe {
  _id: string;
  name: string;
  description: string;
  imageSrc: string;
  tag: string[];
  cookingTime: string;
  recipeType: RecipeType;
}

export const getWeeklyKey = (date: Date) => {
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

export const pickWeeklyRecipes = (
  recipes: WeeklyMenuRecipe[],
  weeklyKey: string,
) =>
  [...recipes]
    .sort(
      (left, right) =>
        hashString(`${weeklyKey}:${left._id}`) -
        hashString(`${weeklyKey}:${right._id}`),
    )
    .slice(0, WEEKLY_MENU_SIZE);
