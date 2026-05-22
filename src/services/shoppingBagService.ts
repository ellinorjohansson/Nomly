import {
  sanitizeShoppingBagSnapshot,
  type ShoppingBagSnapshot,
} from "@/lib/shoppingBagState";

const EMPTY_SHOPPING_BAG: ShoppingBagSnapshot = {
  selectedRecipeIds: [],
  persistedState: null,
};

export const getShoppingBagState = async (): Promise<ShoppingBagSnapshot> => {
  try {
    const response = await fetch("/api/shopping-list/state", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Det gick inte att hämta inköpslistan");
    }

    const payload = await response.json().catch(() => null);
    return sanitizeShoppingBagSnapshot(payload?.data);
  } catch (error) {
    console.error("Fel vid hämtning av inköpslistan:", error);
    return EMPTY_SHOPPING_BAG;
  }
};

export const saveShoppingBagState = async (
  shoppingBagSnapshot: ShoppingBagSnapshot,
): Promise<ShoppingBagSnapshot> => {
  const response = await fetch("/api/shopping-list/state", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shoppingBagSnapshot),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || "Det gick inte att spara inköpslistan");
  }

  return sanitizeShoppingBagSnapshot(payload.data);
};

export const toggleRecipeInShoppingBag = async (recipeId: string) => {
  const normalizedRecipeId = recipeId.trim();

  if (!normalizedRecipeId) {
    return false;
  }

  const currentShoppingBag = await getShoppingBagState();
  const nextSelectedRecipeIds = new Set(currentShoppingBag.selectedRecipeIds);

  if (nextSelectedRecipeIds.has(normalizedRecipeId)) {
    nextSelectedRecipeIds.delete(normalizedRecipeId);
  } else {
    nextSelectedRecipeIds.add(normalizedRecipeId);
  }

  const nextShoppingBag = await saveShoppingBagState({
    selectedRecipeIds: [...nextSelectedRecipeIds],
    persistedState: currentShoppingBag.persistedState,
  });

  return nextShoppingBag.selectedRecipeIds.includes(normalizedRecipeId);
};
