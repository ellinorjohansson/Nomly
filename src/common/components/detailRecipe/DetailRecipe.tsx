/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  formatDuration,
  formatMinutesAsDuration,
  parseDurationToMinutes,
} from "../../../lib/duration";
import { normalizeRecipeType, type RecipeType } from "@/lib/recipeType";
import type { IRecipe } from "@/models/Recipe";
import { normalizeTags } from "@/lib/tags";
import {
  favoritesUpdatedEventName,
  isFavoriteRecipe,
  toggleFavoriteRecipe,
} from "@/lib/clientFavorites";
import EditRecipeModal, { type RecipeFormData } from "./EditRecipeModal";

interface DetailRecipeProps {
  recipe: IRecipe;
  canDelete?: boolean;
}

const formatTag = (tag: string) =>
  tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : "";

const createFormData = (recipe: IRecipe): RecipeFormData => ({
  name: recipe.name || "",
  description: recipe.description || "",
  ingredients: recipe.ingredients || "",
  instructions: recipe.instructions || "",
  recipeType: normalizeRecipeType(recipe.recipeType),
  prepTime: recipe.prepTime || "",
  cookingTime: recipe.cookingTime || "",
  servings: recipe.servings || "",
  imageSrc: recipe.imageSrc || "",
  sourceUrl: recipe.sourceUrl || "",
  sourceName: recipe.sourceName || "",
  link: recipe.link || "",
  isPrivate: Boolean(recipe.isPrivate),
  tag: normalizeTags(recipe.tag || []),
});

const DetailRecipe = ({
  recipe,
  canDelete = Boolean(recipe._id),
}: DetailRecipeProps) => {
  const router = useRouter();
  const [recipeState, setRecipeState] = useState<IRecipe>({
    ...recipe,
    recipeType: normalizeRecipeType(recipe.recipeType),
    isPrivate: Boolean(recipe.isPrivate),
    tag: normalizeTags(recipe.tag || []),
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<RecipeFormData>(() =>
    createFormData(recipe),
  );
  const [tagsInput, setTagsInput] = useState(() =>
    normalizeTags(recipe.tag || []).join(", "),
  );
  const [editError, setEditError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkedIngredientIndexes, setCheckedIngredientIndexes] = useState<
    number[]
  >([]);

  useEffect(() => {
    const normalizedRecipe = {
      ...recipe,
      recipeType: normalizeRecipeType(recipe.recipeType),
      isPrivate: Boolean(recipe.isPrivate),
      tag: normalizeTags(recipe.tag || []),
    };

    setRecipeState(normalizedRecipe);
    setEditFormData(createFormData(normalizedRecipe));
    setTagsInput(normalizedRecipe.tag.join(", "));
  }, [recipe]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null);
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastMessage]);

  const tags = recipeState.tag || [];
  const sourceLabel =
    recipeState.sourceName || recipeState.sourceUrl || recipeState.link;
  const sourceHref = recipeState.sourceUrl || recipeState.link;
  const ingredientsList = (recipeState.ingredients || "")
    .split("\n")
    .filter((item) => item.trim() !== "");
  const ingredientCount = ingredientsList.length;
  const instructionsList = (recipeState.instructions || "")
    .split("\n")
    .filter((item) => item.trim() !== "");
  const prepMinutes = parseDurationToMinutes(recipeState.prepTime);
  const cookingMinutes = parseDurationToMinutes(recipeState.cookingTime);
  const totalMinutes =
    prepMinutes !== null && cookingMinutes !== null
      ? prepMinutes + cookingMinutes
      : (prepMinutes ?? cookingMinutes);

  useEffect(() => {
    if (!recipeState._id) {
      setIsFavorite(false);
      return;
    }

    const syncFavoriteState = () => {
      setIsFavorite(isFavoriteRecipe(recipeState._id || ""));
    };

    syncFavoriteState();
    window.addEventListener(favoritesUpdatedEventName, syncFavoriteState);
    window.addEventListener("storage", syncFavoriteState);

    return () => {
      window.removeEventListener(favoritesUpdatedEventName, syncFavoriteState);
      window.removeEventListener("storage", syncFavoriteState);
    };
  }, [recipeState._id]);

  useEffect(() => {
    if (!recipeState._id) {
      setCheckedIngredientIndexes([]);
      return;
    }

    const storageKey = `nomly:ingredients:${recipeState._id}`;

    try {
      const rawValue = window.localStorage.getItem(storageKey);

      if (!rawValue) {
        setCheckedIngredientIndexes([]);
        return;
      }

      const parsed = JSON.parse(rawValue);

      if (!Array.isArray(parsed)) {
        setCheckedIngredientIndexes([]);
        return;
      }

      const validIndexes = parsed
        .filter((index): index is number => typeof index === "number")
        .filter((index) => index >= 0 && index < ingredientCount);

      setCheckedIngredientIndexes(validIndexes);
    } catch {
      setCheckedIngredientIndexes([]);
    }
  }, [ingredientCount, recipeState._id]);

  useEffect(() => {
    if (!recipeState._id) {
      return;
    }

    const storageKey = `nomly:ingredients:${recipeState._id}`;

    window.localStorage.setItem(
      storageKey,
      JSON.stringify(checkedIngredientIndexes),
    );
  }, [checkedIngredientIndexes, recipeState._id]);

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const tag = normalizeTags(value.split(","));
    setTagsInput(value);
    setEditFormData((prev) => ({ ...prev, tag }));
  };

  const handleVisibilityChange = (isPrivate: boolean) => {
    setEditFormData((prev) => ({ ...prev, isPrivate }));
  };

  const handleRecipeTypeChange = (recipeType: RecipeType) => {
    setEditFormData((prev) => ({ ...prev, recipeType }));
  };

  const handleOpenEditModal = () => {
    setEditError(null);
    setEditFormData(createFormData(recipeState));
    setTagsInput(normalizeTags(recipeState.tag || []).join(", "));
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    if (isSavingEdit) {
      return;
    }

    setIsEditModalOpen(false);
    setEditError(null);
  };

  const handleSaveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!recipeState._id || isSavingEdit) {
      return;
    }

    setIsSavingEdit(true);
    setEditError(null);

    try {
      const response = await fetch("/api/recipes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: recipeState._id,
          ...editFormData,
          tag: normalizeTags(editFormData.tag),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        throw new Error(
          payload?.error || "Det gick inte att uppdatera receptet",
        );
      }

      const updatedRecipe: IRecipe = {
        ...recipeState,
        ...editFormData,
        recipeType: normalizeRecipeType(editFormData.recipeType),
        isPrivate: Boolean(editFormData.isPrivate),
        tag: normalizeTags(editFormData.tag),
      };

      setRecipeState(updatedRecipe);
      setEditFormData(createFormData(updatedRecipe));
      setTagsInput(updatedRecipe.tag?.join(", ") || "");
      setIsEditModalOpen(false);
      setToastMessage("Dina ändringar i receptet har sparats.");
      router.refresh();
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : "Det gick inte att uppdatera receptet",
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteRecipe = async () => {
    if (!recipeState._id || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(
        `/api/recipes?id=${encodeURIComponent(recipeState._id)}`,
        {
          method: "DELETE",
        },
      );

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Det gick inte att ta bort receptet");
      }

      setIsDeleteModalOpen(false);
      router.push("/recipes");
      router.refresh();
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Det gick inte att ta bort receptet",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!recipeState._id) {
      return;
    }

    const favoriteState = toggleFavoriteRecipe(recipeState._id);
    setIsFavorite(favoriteState);
    setToastMessage(
      favoriteState
        ? "Receptet lades till i dina favoriter."
        : "Receptet togs bort från dina favoriter.",
    );
  };

  const handleToggleIngredient = (index: number) => {
    setCheckedIngredientIndexes((current) => {
      if (current.includes(index)) {
        return current.filter((item) => item !== index);
      }

      return [...current, index];
    });
  };

  const handleResetIngredientChecklist = () => {
    setCheckedIngredientIndexes([]);
    setToastMessage("Ingredienslistan är återställd.");
  };

  const handleCopyIngredients = async () => {
    if (!ingredientsList.length) {
      return;
    }

    const uncheckedIngredients = ingredientsList.filter(
      (_, index) => !checkedIngredientIndexes.includes(index),
    );
    const copyTarget =
      uncheckedIngredients.length > 0 ? uncheckedIngredients : ingredientsList;

    try {
      await navigator.clipboard.writeText(copyTarget.join("\n"));
      setToastMessage("Ingredienslistan kopierades.");
    } catch {
      setToastMessage("Det gick inte att kopiera ingredienslistan.");
    }
  };

  return (
    <article className="mx-auto mb-10 max-w-4xl text-text">
      {toastMessage && (
        <div className="pointer-events-none fixed right-4 top-20 z-60 rounded-2xl border border-primaryaccent/10 bg-white px-4 py-3 shadow-xl">
          <p className="text-sm font-medium text-primaryaccent">
            {toastMessage}
          </p>
        </div>
      )}

      <div className="mb-5 mt-5 flex flex-wrap gap-2">
        {recipeState.isPrivate && (
          <span className="inline-flex items-center rounded-full border border-primaryaccent/15 bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primaryaccent">
            Privat
          </span>
        )}
        <span className="inline-flex items-center rounded-full border border-primaryaccent/15 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primaryaccent/75">
          {recipeState.recipeType === "main"
            ? "Huvudrätt"
            : recipeState.recipeType === "side"
              ? "Tillbehör"
              : "Sås"}
        </span>
      </div>
      <div className="mb-8 aspect-video overflow-hidden rounded-[1.75rem] bg-linear-to-br from-secondary to-primary shadow-xl">
        {recipeState.imageSrc ? (
          <img
            src={recipeState.imageSrc}
            alt={recipeState.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="material-symbols-outlined text-8xl text-primaryaccent/20">
              restaurant
            </span>
          </div>
        )}
      </div>

      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full border border-primaryaccent/10 bg-secondary px-3 py-1 text-xs font-semibold capitalize tracking-[0.02em] text-primaryaccent/85 transition-colors hover:bg-secondaryaccent/15"
            >
              {formatTag(tag)}
            </span>
          ))}
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h1 className="text-4xl font-bold text-primaryaccent md:text-5xl">
          {recipeState.name}
        </h1>
        {recipeState._id && (
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
              isFavorite
                ? "border-error/30 bg-error/10 text-error"
                : "border-primaryaccent/20 bg-white text-primaryaccent hover:bg-secondary"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isFavorite ? "favorite" : "favorite_border"}
            </span>
            {isFavorite ? "Favorit" : "Spara favorit"}
          </button>
        )}
      </div>

      {recipeState.authorName && (
        <p className="mb-4 text-sm text-primaryaccent/60">
          Tillagt av{" "}
          <span className="font-semibold text-primaryaccent">
            {recipeState.authorName}
          </span>
        </p>
      )}

      {recipeState.description && (
        <p className="mb-6 max-w-3xl text-lg leading-relaxed text-primaryaccent/75">
          {recipeState.description}
        </p>
      )}

      {sourceLabel && (
        <p className="mb-6 text-sm text-primaryaccent/60">
          Ursprungligen från{" "}
          {sourceHref ? (
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primaryaccent hover:underline"
            >
              {sourceLabel}
              <span className="material-symbols-outlined text-xs!">
                open_in_new
              </span>
            </a>
          ) : (
            <span className="text-primaryaccent">{sourceLabel}</span>
          )}
        </p>
      )}

      {(totalMinutes !== null ||
        recipeState.prepTime ||
        recipeState.cookingTime ||
        recipeState.servings) && (
        <div className="mb-8 flex flex-wrap gap-3">
          {totalMinutes !== null && (
            <div className="flex items-center gap-3 rounded-2xl border border-primaryaccent/10 bg-white px-4 py-3 shadow-sm">
              <div className="rounded-xl bg-secondaryaccent/15 p-2 text-primaryaccent">
                <span className="material-symbols-outlined text-lg">
                  schedule
                </span>
              </div>
              <div>
                <div className="text-xs text-primaryaccent/55">Total tid</div>
                <div className="font-semibold text-primaryaccent">
                  {formatMinutesAsDuration(totalMinutes)}
                </div>
              </div>
            </div>
          )}

          {recipeState.prepTime && (
            <div className="flex items-center gap-3 rounded-2xl border border-primaryaccent/10 bg-white px-4 py-3 shadow-sm">
              <div className="rounded-xl bg-primaryaccent/10 p-2 text-primaryaccent">
                <span className="material-symbols-outlined text-lg">
                  restaurant
                </span>
              </div>
              <div>
                <div className="text-xs text-primaryaccent/55">Förb.</div>
                <div className="font-semibold text-primaryaccent">
                  {formatDuration(recipeState.prepTime)}
                </div>
              </div>
            </div>
          )}

          {recipeState.cookingTime && (
            <div className="flex items-center gap-3 rounded-2xl border border-primaryaccent/10 bg-white px-4 py-3 shadow-sm">
              <div className="rounded-xl bg-secondaryaccent/20 p-2 text-primaryaccent">
                <span className="material-symbols-outlined text-lg">
                  local_fire_department
                </span>
              </div>
              <div>
                <div className="text-xs text-primaryaccent/55">Tillaga</div>
                <div className="font-semibold text-primaryaccent">
                  {formatDuration(recipeState.cookingTime)}
                </div>
              </div>
            </div>
          )}

          {recipeState.servings && (
            <div className="flex items-center gap-3 rounded-2xl border border-primaryaccent/10 bg-white px-4 py-3 shadow-sm">
              <div className="rounded-xl bg-primaryaccent/10 p-2 text-primaryaccent">
                <span className="material-symbols-outlined text-lg">group</span>
              </div>
              <div>
                <div className="text-xs text-primaryaccent/55">Portioner</div>
                <div className="font-semibold text-primaryaccent">
                  {recipeState.servings}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[1fr_1.45fr]">
        {ingredientsList.length > 0 && (
          <section aria-labelledby="ingredients-heading">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2
                  id="ingredients-heading"
                  className="text-2xl font-bold text-primaryaccent"
                >
                  Ingredienser
                </h2>
                <p className="text-xs text-primaryaccent/60">
                  {checkedIngredientIndexes.length} av {ingredientCount} markerade
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyIngredients}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primaryaccent/20 bg-white px-3 py-1.5 text-xs font-semibold text-primaryaccent transition hover:bg-secondary"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Kopiera
                </button>
                <button
                  type="button"
                  onClick={handleResetIngredientChecklist}
                  disabled={!checkedIngredientIndexes.length}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primaryaccent/20 bg-white px-3 py-1.5 text-xs font-semibold text-primaryaccent transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  Rensa
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-primaryaccent/10 bg-white p-5 shadow-sm">
              <ul className="space-y-3">
                {ingredientsList.map((ingredient, index) => (
                  <li key={index} className="flex gap-3 text-sm text-text">
                    <input
                      type="checkbox"
                      checked={checkedIngredientIndexes.includes(index)}
                      onChange={() => handleToggleIngredient(index)}
                      className="mt-1 h-4 w-4 rounded border-primaryaccent/25 text-primaryaccent focus:ring-primaryaccent/30"
                    />
                    <span
                      className={checkedIngredientIndexes.includes(index) ? "line-through opacity-50" : ""}
                    >
                      {ingredient}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {instructionsList.length > 0 && (
          <section aria-labelledby="instructions-heading">
            <h2
              id="instructions-heading"
              className="mb-4 text-2xl font-bold text-primaryaccent"
            >
              Instruktioner
            </h2>
            <ol className="space-y-4">
              {instructionsList.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primaryaccent text-sm font-bold text-white"
                  >
                    {index + 1}
                  </span>
                  <p className="pt-1 leading-relaxed text-text">
                    {instruction}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      {recipeState._id && canDelete && (
        <div className="mt-30 rounded-[1.75rem] border border-primaryaccent/10 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primaryaccent/50">
                Ditt recept
              </p>
              <h2 className="mt-1 text-xl font-bold text-primaryaccent">
                Redigera detaljer eller ändra synlighet
              </h2>
              <p className="mt-1 text-sm text-primaryaccent/65">
                Uppdatera receptet när du vill och välj om det ska vara privat
                eller offentligt.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primaryaccent px-4 py-2 text-sm font-semibold text-white transition hover:bg-primaryaccent/90"
              >
                <span className="material-symbols-outlined text-base">
                  edit
                </span>
                Redigera recept
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteError(null);
                  setIsDeleteModalOpen(true);
                }}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-error/20 px-4 py-2 text-sm font-semibold transition hover:border-error/40 hover:bg-error/5"
              >
                <span className="material-symbols-outlined text-base!">
                  delete
                </span>
                Ta bort recept
              </button>
            </div>
          </div>
        </div>
      )}

      <EditRecipeModal
        isOpen={isEditModalOpen}
        formData={editFormData}
        tagsInput={tagsInput}
        editError={editError}
        isSaving={isSavingEdit}
        onClose={handleCloseEditModal}
        onSubmit={handleSaveEdit}
        onChange={handleEditChange}
        onTagsChange={handleEditTagsChange}
        onRecipeTypeChange={handleRecipeTypeChange}
        onVisibilityChange={handleVisibilityChange}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text/45 px-4 py-6">
          <div className="w-full max-w-md rounded-[1.75rem] border border-primaryaccent/10 bg-primary p-6 shadow-2xl">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-2xl bg-error/10 p-3 text-error">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div>
                <h2 className="mb-1 text-2xl font-bold text-primaryaccent">
                  Ta bort det här receptet?
                </h2>
                <p className="text-sm leading-relaxed text-primaryaccent/70">
                  Den här åtgärden tar bort{" "}
                  <span className="font-semibold text-primaryaccent">
                    {recipeState.name}
                  </span>{" "}
                  från din receptlista permanent. Det går inte att ångra.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 text-sm text-primaryaccent/75 shadow-sm">
              Om du fortfarande behöver receptet senare, kopiera källänken eller
              spara detaljerna innan du tar bort det.
            </div>

            {deleteError && (
              <p className="mt-4 rounded-2xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!isDeleting) {
                    setIsDeleteModalOpen(false);
                    setDeleteError(null);
                  }
                }}
                className="cursor-pointer rounded-full border border-primaryaccent/15 bg-white px-4 py-2 text-sm font-semibold text-primaryaccent transition hover:bg-secondary"
              >
                Behåll receptet
              </button>
              <button
                type="button"
                onClick={handleDeleteRecipe}
                disabled={isDeleting}
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-error px-4 py-2 text-sm font-semibold text-white transition hover:bg-error/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeleting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">
                      progress_activity
                    </span>
                    Tar bort...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">
                      delete_forever
                    </span>
                    Ja, ta bort det
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default DetailRecipe;
