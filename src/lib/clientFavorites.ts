const FAVORITES_STORAGE_KEY = "nomly:favorites:v1";
const FAVORITES_EVENT_NAME = "nomly:favorites-updated";

const canUseStorage = () => typeof window !== "undefined";

const sanitizeFavoriteIds = (value: unknown): string[] => {
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

const notifyFavoritesUpdated = () => {
  if (!canUseStorage()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT_NAME));
};

export const getFavoriteRecipeIds = (): string[] => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    return sanitizeFavoriteIds(JSON.parse(rawValue));
  } catch {
    return [];
  }
};

export const setFavoriteRecipeIds = (favoriteRecipeIds: string[]) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    FAVORITES_STORAGE_KEY,
    JSON.stringify(sanitizeFavoriteIds(favoriteRecipeIds)),
  );
  notifyFavoritesUpdated();
};

export const isFavoriteRecipe = (recipeId: string) => {
  return getFavoriteRecipeIds().includes(recipeId);
};

export const toggleFavoriteRecipe = (recipeId: string) => {
  const id = recipeId.trim();

  if (!id) {
    return false;
  }

  const favorites = new Set(getFavoriteRecipeIds());

  if (favorites.has(id)) {
    favorites.delete(id);
    setFavoriteRecipeIds([...favorites]);
    return false;
  }

  favorites.add(id);
  setFavoriteRecipeIds([...favorites]);
  return true;
};

export const favoritesUpdatedEventName = FAVORITES_EVENT_NAME;