export const RECIPE_TYPE_OPTIONS = [
  {
    value: "main",
    label: "Huvudrätt",
    description: "Använd för recept som kan vara huvudnumret i en måltid.",
  },
  {
    value: "side",
    label: "Tillbehör",
    description: "Använd för tillägg som ris, sallad eller rostade grönsaker.",
  },
  {
    value: "sauce",
    label: "Sås",
    description: "Använd för dip, dressing, röra och andra såser.",
  },
] as const;

export type RecipeType = (typeof RECIPE_TYPE_OPTIONS)[number]["value"];

export const DEFAULT_RECIPE_TYPE: RecipeType = "main";

export const normalizeRecipeType = (value: unknown): RecipeType => {
  if (typeof value !== "string") {
    return DEFAULT_RECIPE_TYPE;
  }

  const normalizedValue = value.trim().toLowerCase();

  return RECIPE_TYPE_OPTIONS.some((option) => option.value === normalizedValue)
    ? (normalizedValue as RecipeType)
    : DEFAULT_RECIPE_TYPE;
};
