import {
  createPersistedShoppingListState,
  sanitizePersistedShoppingListState,
  type PersistedShoppingListState,
} from "@/lib/shoppingBagState";
import type { ShoppingListGroup } from "@/lib/shoppingList";

const SHOPPING_LIST_STATE_PREFIX = "nomly:shopping-list:v1:";

const canUseStorage = () => typeof window !== "undefined";

const getShoppingListUserScope = (userId?: string | null) => {
  const normalizedUserId = userId?.trim();

  if (!normalizedUserId) {
    return "guest";
  }

  return `user:${normalizedUserId}`;
};

export const getShoppingListStorageKey = (
  selectedRecipeIds: string[],
  userId?: string | null,
) => {
  const normalizedIds = [
    ...new Set(selectedRecipeIds.map((id) => id.trim()).filter(Boolean)),
  ].sort();

  return `${SHOPPING_LIST_STATE_PREFIX}${getShoppingListUserScope(userId)}:${normalizedIds.join("|")}`;
};

export const loadShoppingListState = (
  selectedRecipeIds: string[],
  userId?: string | null,
): PersistedShoppingListState | null => {
  if (!canUseStorage()) {
    return null;
  }

  const storageKey = getShoppingListStorageKey(selectedRecipeIds, userId);

  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return null;
    }

    return sanitizePersistedShoppingListState(JSON.parse(rawValue));
  } catch {
    return null;
  }
};

export const saveShoppingListState = (
  selectedRecipeIds: string[],
  baseGroups: ShoppingListGroup[],
  arrangedGroups: ShoppingListGroup[],
  userId?: string | null,
) => {
  if (!canUseStorage()) {
    return;
  }

  const storageKey = getShoppingListStorageKey(selectedRecipeIds, userId);
  const payload = createPersistedShoppingListState(baseGroups, arrangedGroups);

  window.localStorage.setItem(storageKey, JSON.stringify(payload));
};

export const clearShoppingListState = (
  selectedRecipeIds: string[],
  userId?: string | null,
) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(
    getShoppingListStorageKey(selectedRecipeIds, userId),
  );
};

export const applyPersistedShoppingListState = (
  baseGroups: ShoppingListGroup[],
  persistedState: PersistedShoppingListState | null,
): ShoppingListGroup[] => {
  if (!persistedState) {
    return baseGroups;
  }

  const deletedItemKeys = new Set(persistedState.deletedItemKeys);
  const checkedItemKeys = new Set(persistedState.checkedItemKeys);
  const itemByKey = new Map(
    baseGroups
      .flatMap((group) => group.items)
      .filter((item) => !deletedItemKeys.has(item.normalizedLabel))
      .map((item) => [
        item.normalizedLabel,
        {
          ...item,
          isChecked: checkedItemKeys.has(item.normalizedLabel),
        },
      ]),
  );
  const placedItemKeys = new Set<string>();

  const arrangedGroups = baseGroups.map((group) => {
    const persistedGroup = persistedState.groups.find(
      (candidate) => candidate.key === group.key,
    );
    const persistedItems =
      persistedGroup?.itemKeys
        .map((itemKey) => itemByKey.get(itemKey))
        .filter((item): item is ShoppingListGroup["items"][number] =>
          Boolean(item),
        )
        .map((item) => {
          placedItemKeys.add(item.normalizedLabel);
          return {
            ...item,
            categoryKey: group.key,
          };
        }) || [];

    const remainingItems = group.items
      .filter(
        (item) =>
          !deletedItemKeys.has(item.normalizedLabel) &&
          !placedItemKeys.has(item.normalizedLabel),
      )
      .map((item) => ({
        ...item,
        isChecked: checkedItemKeys.has(item.normalizedLabel),
      }));

    return {
      ...group,
      items: [...persistedItems, ...remainingItems],
    };
  });

  return arrangedGroups;
};
