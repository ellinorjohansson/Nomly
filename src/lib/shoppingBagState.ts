import type { ShoppingListGroup } from "@/lib/shoppingList";

export interface PersistedShoppingListState {
  groups: Array<{
    key: ShoppingListGroup["key"];
    itemKeys: string[];
  }>;
  checkedItemKeys: string[];
  deletedItemKeys: string[];
}

export interface ShoppingBagSnapshot {
  selectedRecipeIds: string[];
  persistedState: PersistedShoppingListState | null;
}

const sanitizeStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
  ];
};

export const sanitizeSelectedRecipeIds = (value: unknown) =>
  sanitizeStringList(value);

export const isPersistedShoppingListStateEmpty = (
  value: PersistedShoppingListState | null,
) =>
  !value ||
  (value.groups.length === 0 &&
    value.checkedItemKeys.length === 0 &&
    value.deletedItemKeys.length === 0);

export const sanitizePersistedShoppingListState = (
  value: unknown,
): PersistedShoppingListState | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as {
    groups?: Array<{ key?: string; itemKeys?: unknown }>;
    checkedItemKeys?: unknown;
    deletedItemKeys?: unknown;
  };

  const sanitizedState: PersistedShoppingListState = {
    groups: Array.isArray(candidate.groups)
      ? candidate.groups
          .filter(
            (
              group,
            ): group is { key: ShoppingListGroup["key"]; itemKeys?: unknown } =>
              typeof group?.key === "string",
          )
          .map((group) => ({
            key: group.key,
            itemKeys: sanitizeStringList(group.itemKeys),
          }))
      : [],
    checkedItemKeys: sanitizeStringList(candidate.checkedItemKeys),
    deletedItemKeys: sanitizeStringList(candidate.deletedItemKeys),
  };

  return isPersistedShoppingListStateEmpty(sanitizedState)
    ? null
    : sanitizedState;
};

export const sanitizeShoppingBagSnapshot = (
  value: unknown,
): ShoppingBagSnapshot => {
  if (!value || typeof value !== "object") {
    return {
      selectedRecipeIds: [],
      persistedState: null,
    };
  }

  const candidate = value as {
    selectedRecipeIds?: unknown;
    persistedState?: unknown;
  };

  return {
    selectedRecipeIds: sanitizeSelectedRecipeIds(candidate.selectedRecipeIds),
    persistedState: sanitizePersistedShoppingListState(
      candidate.persistedState,
    ),
  };
};

export const createPersistedShoppingListState = (
  baseGroups: ShoppingListGroup[],
  arrangedGroups: ShoppingListGroup[],
): PersistedShoppingListState | null => {
  const baseItemKeys = new Set(
    baseGroups.flatMap((group) =>
      group.items.map((item) => item.normalizedLabel),
    ),
  );
  const arrangedItemKeys = new Set(
    arrangedGroups.flatMap((group) =>
      group.items.map((item) => item.normalizedLabel),
    ),
  );

  const persistedState: PersistedShoppingListState = {
    groups: arrangedGroups.map((group) => ({
      key: group.key,
      itemKeys: group.items.map((item) => item.normalizedLabel),
    })),
    checkedItemKeys: arrangedGroups.flatMap((group) =>
      group.items
        .filter((item) => item.isChecked)
        .map((item) => item.normalizedLabel),
    ),
    deletedItemKeys: [...baseItemKeys].filter(
      (itemKey) => !arrangedItemKeys.has(itemKey),
    ),
  };

  return isPersistedShoppingListStateEmpty(persistedState)
    ? null
    : persistedState;
};
