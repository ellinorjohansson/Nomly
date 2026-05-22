"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { normalizeTags } from "@/lib/tags";
import { normalizeRecipeType } from "@/lib/recipeType";
import {
  clearSelectedRecipes,
  getSelectedRecipeIds,
  selectedRecipesUpdatedEventName,
} from "@/lib/clientSelectedRecipes";
import {
  buildShoppingList,
  createShoppingListText,
  formatShoppingListItemLabel,
  SHOPPING_CATEGORY_OPTIONS,
  type ShoppingCategoryKey,
  type ShoppingListGroup,
} from "@/lib/shoppingList";
import {
  createPersistedShoppingListState,
  type PersistedShoppingListState,
} from "@/lib/shoppingBagState";
import {
  applyPersistedShoppingListState,
  clearShoppingListState,
  loadShoppingListState,
  saveShoppingListState,
} from "@/lib/clientShoppingListState";
import { getRecipesByIds } from "@/services/recipeService";
import {
  getShoppingBagState,
  saveShoppingBagState as saveRemoteShoppingBagState,
} from "@/services/shoppingBagService";
import type { IRecipe } from "@/models/Recipe";

type DraggedShoppingItem = {
  itemKey: string;
  sourceGroupKey: ShoppingCategoryKey;
};

interface ShoppingListManagerProps {
  currentUserId?: string | null;
}

export default function ShoppingListManager({
  currentUserId,
}: ShoppingListManagerProps) {
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<IRecipe[]>([]);
  const [persistedShoppingListState, setPersistedShoppingListState] =
    useState<PersistedShoppingListState | null>(null);
  const [hasLoadedShoppingBag, setHasLoadedShoppingBag] = useState(false);
  const [isLoadingShoppingBag, setIsLoadingShoppingBag] = useState(false);
  const [isLoadingSelectedRecipes, setIsLoadingSelectedRecipes] =
    useState(false);
  const [arrangedShoppingListGroups, setArrangedShoppingListGroups] = useState<
    ShoppingListGroup[]
  >([]);
  const [draggedShoppingItem, setDraggedShoppingItem] =
    useState<DraggedShoppingItem | null>(null);
  const [shoppingListMessage, setShoppingListMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (currentUserId) {
      let isMounted = true;

      setHasLoadedShoppingBag(false);
      setIsLoadingShoppingBag(true);

      const loadShoppingBag = async () => {
        const shoppingBagState = await getShoppingBagState();

        if (!isMounted) {
          return;
        }

        setSelectedRecipeIds(shoppingBagState.selectedRecipeIds);
        setPersistedShoppingListState(shoppingBagState.persistedState);
        setHasLoadedShoppingBag(true);
        setIsLoadingShoppingBag(false);
      };

      void loadShoppingBag();

      return () => {
        isMounted = false;
      };
    }

    setPersistedShoppingListState(null);
    setHasLoadedShoppingBag(true);
    setIsLoadingShoppingBag(false);

    const syncSelectedRecipeIds = () => {
      setSelectedRecipeIds(getSelectedRecipeIds(currentUserId));
    };

    syncSelectedRecipeIds();
    window.addEventListener(
      selectedRecipesUpdatedEventName,
      syncSelectedRecipeIds,
    );
    window.addEventListener("storage", syncSelectedRecipeIds);

    return () => {
      window.removeEventListener(
        selectedRecipesUpdatedEventName,
        syncSelectedRecipeIds,
      );
      window.removeEventListener("storage", syncSelectedRecipeIds);
    };
  }, [currentUserId]);

  useEffect(() => {
    let isMounted = true;

    const loadSelectedRecipes = async () => {
      if (!selectedRecipeIds.length) {
        setSelectedRecipes([]);
        return;
      }

      setIsLoadingSelectedRecipes(true);

      try {
        const selected = await getRecipesByIds(selectedRecipeIds);

        if (!isMounted) {
          return;
        }

        setSelectedRecipes(
          selected.map((recipe) => ({
            ...recipe,
            recipeType: normalizeRecipeType(recipe.recipeType),
            isPrivate: Boolean(recipe.isPrivate),
            tag: normalizeTags(recipe.tag || []),
          })),
        );
      } finally {
        if (isMounted) {
          setIsLoadingSelectedRecipes(false);
        }
      }
    };

    loadSelectedRecipes();

    return () => {
      isMounted = false;
    };
  }, [selectedRecipeIds]);

  useEffect(() => {
    if (!shoppingListMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShoppingListMessage(null);
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [shoppingListMessage]);

  const shoppingListGroups = useMemo(
    () => buildShoppingList(selectedRecipes),
    [selectedRecipes],
  );
  const hydratedShoppingListGroups = useMemo(
    () =>
      SHOPPING_CATEGORY_OPTIONS.map((category) => ({
        key: category.key,
        label: category.label,
        items:
          shoppingListGroups.find((group) => group.key === category.key)
            ?.items || [],
      })),
    [shoppingListGroups],
  );
  const shoppingListItemCount = useMemo(
    () =>
      arrangedShoppingListGroups.reduce(
        (total, group) => total + group.items.length,
        0,
      ),
    [arrangedShoppingListGroups],
  );
  const checkedShoppingListItemCount = useMemo(
    () =>
      arrangedShoppingListGroups.reduce(
        (total, group) =>
          total + group.items.filter((item) => item.isChecked).length,
        0,
      ),
    [arrangedShoppingListGroups],
  );
  const uncheckedShoppingListItemCount =
    shoppingListItemCount - checkedShoppingListItemCount;

  useEffect(() => {
    setArrangedShoppingListGroups(
      applyPersistedShoppingListState(
        hydratedShoppingListGroups,
        currentUserId
          ? persistedShoppingListState
          : loadShoppingListState(selectedRecipeIds, currentUserId),
      ),
    );
  }, [
    currentUserId,
    hydratedShoppingListGroups,
    persistedShoppingListState,
    selectedRecipeIds,
  ]);

  useEffect(() => {
    if (!hasLoadedShoppingBag || isLoadingSelectedRecipes) {
      return;
    }

    if (currentUserId) {
      const persistShoppingBag = async () => {
        try {
          const nextShoppingBagState = await saveRemoteShoppingBagState({
            selectedRecipeIds,
            persistedState: createPersistedShoppingListState(
              hydratedShoppingListGroups,
              arrangedShoppingListGroups,
            ),
          });

          setPersistedShoppingListState(nextShoppingBagState.persistedState);
        } catch (error) {
          console.error("Fel vid sparande av inköpslistan:", error);
        }
      };

      void persistShoppingBag();
      return;
    }

    if (!selectedRecipeIds.length) {
      return;
    }

    saveShoppingListState(
      selectedRecipeIds,
      hydratedShoppingListGroups,
      arrangedShoppingListGroups,
      currentUserId,
    );
  }, [
    arrangedShoppingListGroups,
    currentUserId,
    hasLoadedShoppingBag,
    hydratedShoppingListGroups,
    isLoadingSelectedRecipes,
    selectedRecipeIds,
  ]);

  const handleCopyShoppingList = async () => {
    const nonEmptyGroups = arrangedShoppingListGroups.filter(
      (group) => group.items.length > 0,
    );

    if (!nonEmptyGroups.length) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        createShoppingListText(nonEmptyGroups),
      );
      setShoppingListMessage("Inköpslistan kopierades.");
    } catch {
      setShoppingListMessage("Det gick inte att kopiera inköpslistan.");
    }
  };

  const handleClearSelectedRecipes = () => {
    if (currentUserId) {
      setSelectedRecipeIds([]);
      setSelectedRecipes([]);
      setPersistedShoppingListState(null);
      setShoppingListMessage("Valda recept rensades.");
      return;
    }

    clearShoppingListState(selectedRecipeIds, currentUserId);
    clearSelectedRecipes(currentUserId);
    setSelectedRecipes([]);
    setShoppingListMessage("Valda recept rensades.");
  };

  const handleToggleShoppingItemChecked = (
    groupKey: ShoppingCategoryKey,
    itemKey: string,
  ) => {
    setArrangedShoppingListGroups((currentGroups) =>
      currentGroups.map((group) => {
        if (group.key !== groupKey) {
          return group;
        }

        return {
          ...group,
          items: group.items.map((item) =>
            item.normalizedLabel === itemKey
              ? { ...item, isChecked: !item.isChecked }
              : item,
          ),
        };
      }),
    );
  };

  const handleDeleteShoppingItem = (
    groupKey: ShoppingCategoryKey,
    itemKey: string,
  ) => {
    setArrangedShoppingListGroups((currentGroups) =>
      currentGroups.map((group) => {
        if (group.key !== groupKey) {
          return group;
        }

        return {
          ...group,
          items: group.items.filter((item) => item.normalizedLabel !== itemKey),
        };
      }),
    );

    setShoppingListMessage("Ingrediensen togs bort från inköpslistan.");
  };

  const handleShoppingItemDragStart = (
    sourceGroupKey: ShoppingCategoryKey,
    itemKey: string,
  ) => {
    setDraggedShoppingItem({ sourceGroupKey, itemKey });
  };

  const handleShoppingItemDrop = (
    targetGroupKey: ShoppingCategoryKey,
    targetItemKey?: string,
  ) => {
    if (!draggedShoppingItem) {
      return;
    }

    setArrangedShoppingListGroups((currentGroups) => {
      let movedItem: ShoppingListGroup["items"][number] | null = null;

      const groupsWithoutItem = currentGroups.map((group) => {
        if (group.key !== draggedShoppingItem.sourceGroupKey) {
          return group;
        }

        const nextItems = group.items.filter((item) => {
          if (item.normalizedLabel !== draggedShoppingItem.itemKey) {
            return true;
          }

          movedItem = {
            ...item,
            categoryKey: targetGroupKey,
          };
          return false;
        });

        return {
          ...group,
          items: nextItems,
        };
      });

      if (!movedItem) {
        return currentGroups;
      }

      const movedItemValue = movedItem;

      return groupsWithoutItem.map((group) => {
        if (group.key !== targetGroupKey) {
          return group;
        }

        const nextItems = [...group.items];

        if (!targetItemKey) {
          nextItems.push(movedItemValue);
        } else {
          const insertIndex = nextItems.findIndex(
            (item) => item.normalizedLabel === targetItemKey,
          );

          if (insertIndex === -1) {
            nextItems.push(movedItemValue);
          } else {
            nextItems.splice(insertIndex, 0, movedItemValue);
          }
        }

        return {
          ...group,
          items: nextItems,
        };
      });
    });

    setDraggedShoppingItem(null);
    setShoppingListMessage("Ingrediensen flyttades i inköpslistan.");
  };

  const handleShoppingDragEnd = () => {
    setDraggedShoppingItem(null);
  };

  return (
    <section className="space-y-6">
      {shoppingListMessage && (
        <div className="rounded-2xl border border-primaryaccent/10 bg-white px-4 py-3 text-sm font-medium text-primaryaccent shadow-sm">
          {shoppingListMessage}
        </div>
      )}

      <div className="rounded-3xl border border-primaryaccent/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondaryaccent">
              Inköpslista
            </p>
            <h1 className="mt-1 text-3xl font-serif font-bold text-primaryaccent">
              Valda recept och ingredienser kvar att köpa
            </h1>
            <p className="mt-2 text-sm text-primaryaccent/70">
              Nomly summerar enkla mängder, tar bara med ingredienser som inte
              redan är avbockade och låter dig dra ingredienser till rätt
              kategori.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <div className="text-sm text-primaryaccent/65">
              {selectedRecipeIds.length} valda recept,{" "}
              {uncheckedShoppingListItemCount} kvar
              {checkedShoppingListItemCount > 0
                ? `, ${checkedShoppingListItemCount} avprickade`
                : ""}
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button
                type="button"
                onClick={handleCopyShoppingList}
                disabled={
                  !arrangedShoppingListGroups.some(
                    (group) => group.items.length > 0,
                  )
                }
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-primaryaccent/20 bg-white px-4 py-2 text-sm font-semibold text-primaryaccent transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span className="material-symbols-outlined text-base">
                  content_copy
                </span>
                Kopiera lista
              </button>
              <button
                type="button"
                onClick={handleClearSelectedRecipes}
                disabled={!selectedRecipeIds.length}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-primaryaccent/20 bg-white px-4 py-2 text-sm font-semibold text-primaryaccent transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span className="material-symbols-outlined text-base">
                  delete_sweep
                </span>
                Rensa valda recept
              </button>
            </div>
          </div>
        </div>

        {selectedRecipes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedRecipes.map((recipe) => (
              <Link
                key={recipe._id}
                href={`/recipes/${recipe._id}`}
                className="inline-flex items-center rounded-full border border-primaryaccent/10 bg-secondary px-3 py-1 text-xs font-semibold text-primaryaccent transition hover:border-primaryaccent/25"
              >
                {recipe.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6">
          {isLoadingShoppingBag || isLoadingSelectedRecipes ? (
            <p className="text-sm text-primaryaccent/65">
              Hämtar inköpslistan...
            </p>
          ) : arrangedShoppingListGroups.some(
              (group) => group.items.length > 0,
            ) ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {arrangedShoppingListGroups.map((group) => (
                <div
                  key={group.key}
                  className="rounded-3xl border border-primaryaccent/10 bg-secondary/40 p-4"
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    handleShoppingItemDrop(group.key);
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-primaryaccent/65">
                      {group.label}
                    </h4>
                    <span className="text-xs text-primaryaccent/50">
                      Dra hit
                    </span>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <li
                        key={item.normalizedLabel}
                        draggable
                        onDragStart={() =>
                          handleShoppingItemDragStart(
                            group.key,
                            item.normalizedLabel,
                          )
                        }
                        onDragEnd={handleShoppingDragEnd}
                        onDragOver={(event) => {
                          event.preventDefault();
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          handleShoppingItemDrop(
                            group.key,
                            item.normalizedLabel,
                          );
                        }}
                        className={`cursor-grab rounded-2xl border border-primaryaccent/10 bg-white px-3 py-3 text-sm text-primaryaccent shadow-sm active:cursor-grabbing ${
                          draggedShoppingItem?.itemKey === item.normalizedLabel
                            ? "opacity-50"
                            : item.isChecked
                              ? "opacity-60"
                              : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                handleToggleShoppingItemChecked(
                                  group.key,
                                  item.normalizedLabel,
                                );
                              }}
                              className={`inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border transition ${
                                item.isChecked
                                  ? "border-success/20 bg-success text-white"
                                  : "border-primaryaccent/20 bg-white text-primaryaccent hover:bg-secondary"
                              }`}
                              aria-label={
                                item.isChecked
                                  ? "Markera som inte klar"
                                  : "Markera som klar"
                              }
                            >
                              <span className="material-symbols-outlined text-sm">
                                {item.isChecked
                                  ? "check"
                                  : "radio_button_unchecked"}
                              </span>
                            </button>
                            <span className="material-symbols-outlined text-base text-primaryaccent/45">
                              drag_indicator
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`font-semibold capitalize text-text ${
                                item.isChecked ? "line-through opacity-60" : ""
                              }`}
                            >
                              {formatShoppingListItemLabel(item)}
                            </p>
                            {item.variants.length > 1 &&
                              !item.hasConsistentQuantity && (
                                <p className="mt-1 text-xs text-primaryaccent/70">
                                  Sammanfogat från: {item.variants.join(", ")}
                                </p>
                              )}
                            <p className="mt-1 text-xs text-primaryaccent/60">
                              {item.sources
                                .map((source) =>
                                  source.sectionTitle
                                    ? `${source.recipeName} · ${source.sectionTitle}`
                                    : source.recipeName,
                                )
                                .join(", ")}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              handleDeleteShoppingItem(
                                group.key,
                                item.normalizedLabel,
                              );
                            }}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-error/20 text-error transition hover:bg-error/5"
                            aria-label="Ta bort ingrediens"
                          >
                            <span className="material-symbols-outlined text-base">
                              delete
                            </span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {group.items.length === 0 && (
                    <div className="mt-4 rounded-2xl border border-dashed border-primaryaccent/15 bg-white/70 px-4 py-6 text-center text-sm text-primaryaccent/55">
                      Släpp en ingrediens här
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-primaryaccent/15 bg-secondary/30 px-6 py-10 text-center">
              <span className="material-symbols-outlined text-4xl text-primaryaccent/35">
                shopping_cart
              </span>
              <h2 className="mt-3 text-xl font-serif font-bold text-primaryaccent">
                Ingen inköpslista ännu
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-primaryaccent/65">
                Öppna ett recept och välj Lägg till i inköpslista för att börja
                bygga din lista.
              </p>
              <Link
                href="/recipes"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-primaryaccent px-4 py-2 text-sm font-semibold text-white transition hover:bg-primaryaccent/90"
              >
                <span className="material-symbols-outlined text-base">
                  menu_book
                </span>
                Gå till recept
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
