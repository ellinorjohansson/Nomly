"use client";

import type { ChangeEventHandler, FormEventHandler } from "react";

export interface RecipeFormData {
  name: string;
  description: string;
  ingredients: string;
  instructions: string;
  prepTime: string;
  cookingTime: string;
  servings: string;
  imageSrc: string;
  sourceUrl: string;
  sourceName: string;
  link: string;
  isPrivate: boolean;
  tag: string[];
}

interface EditRecipeModalProps {
  isOpen: boolean;
  formData: RecipeFormData;
  tagsInput: string;
  editError: string | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onTagsChange: ChangeEventHandler<HTMLInputElement>;
  onVisibilityChange: (_isPrivate: boolean) => void;
}

const EditRecipeModal = ({
  isOpen,
  formData,
  tagsInput,
  editError,
  isSaving,
  onClose,
  onSubmit,
  onChange,
  onTagsChange,
  onVisibilityChange,
}: EditRecipeModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-text/45 px-4 py-6">
      <div className="mx-auto w-full max-w-3xl rounded-[1.75rem] border border-primaryaccent/10 bg-primary p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primaryaccent/55">
              Edit recipe
            </p>
            <h2 className="mt-1 text-2xl font-bold text-primaryaccent">
              Update details and visibility
            </h2>
            <p className="mt-2 text-sm text-primaryaccent/65">
              Keep the recipe fresh, and choose whether it stays just for you or
              visible to everyone.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center self-end rounded-full border border-primaryaccent/15 bg-white text-primaryaccent transition hover:bg-secondary sm:self-auto"
            aria-label="Close edit recipe dialog"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
            <div className="space-y-5">
              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Recipe title
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={onChange}
                  className="w-full rounded-xl border border-primaryaccent/20 bg-white px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-primaryaccent/20 bg-white px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Ingredients
                </label>
                <textarea
                  name="ingredients"
                  required
                  value={formData.ingredients}
                  onChange={onChange}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-primaryaccent/20 bg-white px-4 py-3 font-mono text-sm text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Instructions
                </label>
                <textarea
                  name="instructions"
                  required
                  value={formData.instructions}
                  onChange={onChange}
                  rows={6}
                  className="w-full resize-none rounded-xl border border-primaryaccent/20 bg-white px-4 py-3 font-mono text-sm text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-primaryaccent/10 bg-white p-4 shadow-sm">
                <p className="mb-3 text-sm font-semibold text-primaryaccent">
                  Visibility
                </p>
                <div className="grid gap-3">
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primaryaccent/15 bg-secondary px-4 py-4 transition hover:border-primaryaccent/30">
                    <input
                      type="radio"
                      name="visibility"
                      checked={!formData.isPrivate}
                      onChange={() => onVisibilityChange(false)}
                      className="mt-1 h-4 w-4 border-primaryaccent text-primaryaccent focus:ring-primaryaccent/30"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-primaryaccent">
                        Public
                      </span>
                      <span className="block text-sm text-primaryaccent/65">
                        Everyone can see this recipe.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primaryaccent/15 bg-secondary px-4 py-4 transition hover:border-primaryaccent/30">
                    <input
                      type="radio"
                      name="visibility"
                      checked={formData.isPrivate}
                      onChange={() => onVisibilityChange(true)}
                      className="mt-1 h-4 w-4 border-primaryaccent text-primaryaccent focus:ring-primaryaccent/30"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-primaryaccent">
                        Private
                      </span>
                      <span className="block text-sm text-primaryaccent/65">
                        Only you can see this recipe.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                    Prep time
                  </label>
                  <input
                    type="text"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={onChange}
                    className="w-full rounded-xl border border-primaryaccent/20 bg-white px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                    Cook time
                  </label>
                  <input
                    type="text"
                    name="cookingTime"
                    value={formData.cookingTime}
                    onChange={onChange}
                    className="w-full rounded-xl border border-primaryaccent/20 bg-white px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                    Servings
                  </label>
                  <input
                    type="text"
                    name="servings"
                    value={formData.servings}
                    onChange={onChange}
                    className="w-full rounded-xl border border-primaryaccent/20 bg-white px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageSrc"
                  value={formData.imageSrc}
                  onChange={onChange}
                  className="w-full rounded-xl border border-primaryaccent/20 bg-white px-4 py-3 text-sm text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                    Source URL
                  </label>
                  <input
                    type="url"
                    name="sourceUrl"
                    value={formData.sourceUrl}
                    onChange={onChange}
                    className="w-full rounded-xl border border-primaryaccent/20 bg-white px-4 py-3 text-sm text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                    Source name
                  </label>
                  <input
                    type="text"
                    name="sourceName"
                    value={formData.sourceName}
                    onChange={onChange}
                    className="w-full rounded-xl border border-primaryaccent/20 bg-white px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Tags
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={onTagsChange}
                  className="w-full rounded-xl border border-primaryaccent/20 bg-white px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>
            </div>
          </div>

          {editError && (
            <p className="rounded-2xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
              {editError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-primaryaccent/15 bg-white px-4 py-2 text-sm font-semibold text-primaryaccent transition hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primaryaccent px-4 py-2 text-sm font-semibold text-white transition hover:bg-primaryaccent/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">
                    progress_activity
                  </span>
                  Saving changes...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">
                    save
                  </span>
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipeModal;
