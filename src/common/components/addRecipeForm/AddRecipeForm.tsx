"use client";

import { useState } from "react";
import Link from "next/link";
import DetailRecipe from "@/common/components/detailRecipe/DetailRecipe";
import { normalizeTags } from "@/lib/tags";

interface AddRecipeFormProps {
  authorName: string;
}

const initialFormData = {
  name: "",
  description: "",
  ingredients: "",
  instructions: "",
  prepTime: "",
  cookingTime: "",
  servings: "",
  imageSrc: "",
  sourceUrl: "",
  sourceName: "",
  link: "",
  tag: [] as string[],
};

export default function AddRecipeForm({ authorName }: AddRecipeFormProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [tagsInput, setTagsInput] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tags = normalizeTags(value.split(","));
    setTagsInput(value);
    setFormData((prev) => ({ ...prev, tag: tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tag: normalizeTags(formData.tag),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to save recipe");
      }

      setFormData(initialFormData);
      setTagsInput("");
      setSubmitSuccess("Recipe saved successfully.");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save recipe",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-primary px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-8">
            <h1 className="mb-2 max-w-sm text-3xl font-serif font-bold text-primaryaccent">
              Paste your recipe, save it the{" "}
              <span className="text-amber-600">Nomly</span> way
            </h1>
            <p className="mb-2 text-primaryaccent/60">
              Fill in your recipe details and see the preview.
            </p>
            <p className="mb-8 text-sm text-primaryaccent/70">
              Publishing as{" "}
              <span className="font-semibold text-primaryaccent">
                {authorName}
              </span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Recipe Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Chocolate Chip Cookies"
                  required
                  className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="A brief description of your recipe"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Ingredients <span className="text-error">*</span> (one per
                  line)
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  placeholder="One ingredient per line"
                  rows={5}
                  required
                  className="w-full resize-none rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 font-mono text-sm text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Instructions <span className="text-error">*</span> (one step
                  per line)
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  placeholder="One step per line"
                  rows={6}
                  required
                  className="w-full resize-none rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 font-mono text-sm text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
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
                    onChange={handleChange}
                    placeholder="e.g. 45m or 1h 15m"
                    className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
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
                    onChange={handleChange}
                    placeholder="e.g. 1h 30m"
                    className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
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
                    onChange={handleChange}
                    placeholder="4"
                    className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
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
                  onChange={handleChange}
                  placeholder="https://example.com/recipe-image.jpg"
                  className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-sm text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
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
                    onChange={handleChange}
                    placeholder="https://food-blog.com"
                    className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-sm text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                    Source Name
                  </label>
                  <input
                    type="text"
                    name="sourceName"
                    value={formData.sourceName}
                    onChange={handleChange}
                    placeholder="e.g. Food Blog"
                    className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  placeholder="dessert, quick, easy"
                  className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              {submitError && (
                <p className="rounded-2xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
                  {submitError}
                </p>
              )}

              {submitSuccess && (
                <p className="rounded-2xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
                  {submitSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primaryaccent px-4 py-4 font-semibold text-white transition duration-200 hover:bg-primaryaccent/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="material-symbols-outlined text-xl">
                  {isSubmitting ? "progress_activity" : "check_circle"}
                </span>
                {isSubmitting ? "Saving..." : "Save to Nomly"}
              </button>
            </form>

            <Link
              href="/recipes"
              className="mt-6 inline-block text-primaryaccent/60 transition hover:text-primaryaccent"
            >
              ← Back to recipes
            </Link>
          </div>

          <div className="flex flex-col">
            <h2 className="mb-4 text-2xl font-serif font-bold text-primaryaccent">
              Live Preview
            </h2>
            <div className="flex-1">
              <DetailRecipe
                recipe={{
                  ...formData,
                  _id: undefined,
                  authorName,
                }}
                canDelete={false}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
