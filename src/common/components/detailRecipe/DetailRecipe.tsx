/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  formatDuration,
  formatMinutesAsDuration,
  parseDurationToMinutes,
} from "../../../lib/duration";
import type { IRecipe } from "@/models/Recipe";
import { normalizeTags } from "@/lib/tags";
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
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const normalizedRecipe = {
      ...recipe,
      isPrivate: Boolean(recipe.isPrivate),
      tag: normalizeTags(recipe.tag || []),
    };

    setRecipeState(normalizedRecipe);
    setEditFormData(createFormData(normalizedRecipe));
    setTagsInput(normalizedRecipe.tag.join(", "));
  }, [recipe]);

  useEffect(() => {
    if (!showSaveToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowSaveToast(false);
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [showSaveToast]);

  const tags = recipeState.tag || [];
  const sourceLabel =
    recipeState.sourceName || recipeState.sourceUrl || recipeState.link;
  const sourceHref = recipeState.sourceUrl || recipeState.link;
  const ingredientsList = (recipeState.ingredients || "")
    .split("\n")
    .filter((item) => item.trim() !== "");
  const instructionsList = (recipeState.instructions || "")
    .split("\n")
    .filter((item) => item.trim() !== "");
  const prepMinutes = parseDurationToMinutes(recipeState.prepTime);
  const cookingMinutes = parseDurationToMinutes(recipeState.cookingTime);
  const totalMinutes =
    prepMinutes !== null && cookingMinutes !== null
      ? prepMinutes + cookingMinutes
      : (prepMinutes ?? cookingMinutes);

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
        throw new Error(payload?.error || "Failed to update recipe");
      }

      const updatedRecipe: IRecipe = {
        ...recipeState,
        ...editFormData,
        isPrivate: Boolean(editFormData.isPrivate),
        tag: normalizeTags(editFormData.tag),
      };

      setRecipeState(updatedRecipe);
      setEditFormData(createFormData(updatedRecipe));
      setTagsInput(updatedRecipe.tag?.join(", ") || "");
      setIsEditModalOpen(false);
      setShowSaveToast(true);
      router.refresh();
    } catch (error) {
      setEditError(
        error instanceof Error ? error.message : "Failed to update recipe",
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
        throw new Error(payload?.error || "Failed to delete recipe");
      }

      setIsDeleteModalOpen(false);
      router.push("/recipes");
      router.refresh();
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete recipe",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="mx-auto mb-10 max-w-4xl text-text">
      {showSaveToast && (
        <div className="pointer-events-none fixed right-4 top-20 z-60 rounded-2xl border border-primaryaccent/10 bg-white px-4 py-3 shadow-xl">
          <p className="text-sm font-medium text-primaryaccent">
            Your recipe changes have been saved.
          </p>
        </div>
      )}

      {recipeState.isPrivate && (
        <span className="inline-flex items-center mb-5 mt-5 rounded-full border border-primaryaccent/15 bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primaryaccent">
          Private
        </span>
      )}
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
      </div>

      {recipeState.authorName && (
        <p className="mb-4 text-sm text-primaryaccent/60">
          Added by{" "}
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
          Originally from{" "}
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
                <div className="text-xs text-primaryaccent/55">Total time</div>
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
                <div className="text-xs text-primaryaccent/55">Prep</div>
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
                <div className="text-xs text-primaryaccent/55">Cook</div>
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
                <div className="text-xs text-primaryaccent/55">Servings</div>
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
            <h2
              id="ingredients-heading"
              className="mb-4 text-2xl font-bold text-primaryaccent"
            >
              Ingredients
            </h2>
            <div className="rounded-2xl border border-primaryaccent/10 bg-white p-5 shadow-sm">
              <ul className="space-y-3">
                {ingredientsList.map((ingredient, index) => (
                  <li key={index} className="flex gap-3 text-sm text-text">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondaryaccent"
                    />
                    <span>{ingredient}</span>
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
              Instructions
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
                Your recipe
              </p>
              <h2 className="mt-1 text-xl font-bold text-primaryaccent">
                Edit details or switch visibility
              </h2>
              <p className="mt-1 text-sm text-primaryaccent/65">
                Update the recipe whenever you want, and choose whether it is
                private or public.
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
                Edit recipe
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
                Delete recipe
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
                  Delete this recipe?
                </h2>
                <p className="text-sm leading-relaxed text-primaryaccent/70">
                  This action permanently removes{" "}
                  <span className="font-semibold text-primaryaccent">
                    {recipeState.name}
                  </span>{" "}
                  from your recipe list. This cannot be undone.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 text-sm text-primaryaccent/75 shadow-sm">
              If you still need this recipe later, copy the source link or save
              the details before deleting it.
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
                Keep recipe
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
                    Deleting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">
                      delete_forever
                    </span>
                    Yes, delete it
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
