const SELECTED_RECIPES_STORAGE_KEY_PREFIX = "nomly:selected-recipes:v1";
const SELECTED_RECIPES_EVENT_NAME = "nomly:selected-recipes-updated";

const canUseStorage = () => typeof window !== "undefined";

const getSelectedRecipesStorageKey = (userId?: string | null) => {
  const normalizedUserId = userId?.trim();

  if (!normalizedUserId) {
    return `${SELECTED_RECIPES_STORAGE_KEY_PREFIX}:guest`;
  }

  return `${SELECTED_RECIPES_STORAGE_KEY_PREFIX}:user:${normalizedUserId}`;
};

const sanitizeRecipeIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const uniqueValues = new Set(
    value
      .filter((id): id is string => typeof id === "string")
      .map((id) => id.trim())
      .filter(Boolean),
  );

  return [...uniqueValues];
};

const notifySelectedRecipesUpdated = () => {
  if (!canUseStorage()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(SELECTED_RECIPES_EVENT_NAME));
};

export const getSelectedRecipeIds = (userId?: string | null): string[] => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(
      getSelectedRecipesStorageKey(userId),
    );

    if (!rawValue) {
      return [];
    }

    return sanitizeRecipeIds(JSON.parse(rawValue));
  } catch {
    return [];
  }
};

export const setSelectedRecipeIds = (
  recipeIds: string[],
  userId?: string | null,
) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    getSelectedRecipesStorageKey(userId),
    JSON.stringify(sanitizeRecipeIds(recipeIds)),
  );
  notifySelectedRecipesUpdated();
};

export const toggleSelectedRecipe = (
  recipeId: string,
  userId?: string | null,
) => {
  const id = recipeId.trim();

  if (!id) {
    return false;
  }

  const selectedRecipes = new Set(getSelectedRecipeIds(userId));

  if (selectedRecipes.has(id)) {
    selectedRecipes.delete(id);
    setSelectedRecipeIds([...selectedRecipes], userId);
    return false;
  }

  selectedRecipes.add(id);
  setSelectedRecipeIds([...selectedRecipes], userId);
  return true;
};

export const clearSelectedRecipes = (userId?: string | null) => {
  setSelectedRecipeIds([], userId);
};

export const selectedRecipesUpdatedEventName = SELECTED_RECIPES_EVENT_NAME;
