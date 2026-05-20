"use client";

import { useState } from "react";
import Link from "next/link";
import DetailRecipe from "@/common/components/detailRecipe/DetailRecipe";
import {
  DEFAULT_RECIPE_TYPE,
  RECIPE_TYPE_OPTIONS,
  type RecipeType,
} from "@/lib/recipeType";
import { normalizeTags } from "@/lib/tags";

interface AddRecipeFormProps {
  authorName: string;
}

const initialFormData = {
  name: "",
  description: "",
  ingredients: "",
  instructions: "",
  recipeType: DEFAULT_RECIPE_TYPE,
  prepTime: "",
  cookingTime: "",
  servings: "",
  imageSrc: "",
  sourceUrl: "",
  sourceName: "",
  link: "",
  isPrivate: false,
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

  const handleVisibilityChange = (isPrivate: boolean) => {
    setFormData((prev) => ({ ...prev, isPrivate }));
  };

  const handleRecipeTypeChange = (recipeType: RecipeType) => {
    setFormData((prev) => ({ ...prev, recipeType }));
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
        throw new Error(payload?.error || "Det gick inte att spara receptet");
      }

      setFormData(initialFormData);
      setTagsInput("");
      setSubmitSuccess("Receptet sparades.");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Det gick inte att spara receptet",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-primary px-4 py-8 mb-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-8">
            <h1 className="mb-2 max-w-sm text-3xl font-serif font-bold text-primaryaccent">
              Klistra in ditt recept och spara det på{" "}
              <span className="text-amber-600">Nomly</span>
            </h1>
            <p className="mb-2 text-primaryaccent/60">
              Fyll i receptets uppgifter och se förhandsvisningen.
            </p>
            <p className="mb-8 text-sm text-primaryaccent/70">
              Publicerar som{" "}
              <span className="font-semibold text-primaryaccent">
                {authorName}
              </span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Recepttitel <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="t.ex. Chokladcookies"
                  required
                  className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Beskrivning
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="En kort beskrivning av receptet"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Ingredienser <span className="text-error">*</span> (en per
                  rad)
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  placeholder="En ingrediens per rad"
                  rows={5}
                  required
                  className="w-full resize-none rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 font-mono text-sm text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Instruktioner <span className="text-error">*</span> (ett steg
                  per rad)
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  placeholder="Ett steg per rad"
                  rows={6}
                  required
                  className="w-full resize-none rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 font-mono text-sm text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                    Förberedelsetid
                  </label>
                  <input
                    type="text"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleChange}
                    placeholder="t.ex. 45 min eller 1 h 15 min"
                    className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                    Tillagningstid
                  </label>
                  <input
                    type="text"
                    name="cookingTime"
                    value={formData.cookingTime}
                    onChange={handleChange}
                    placeholder="t.ex. 1 h 30 min"
                    className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                    Portioner
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
                  Bild-URL
                </label>
                <input
                  type="url"
                  name="imageSrc"
                  value={formData.imageSrc}
                  onChange={handleChange}
                  placeholder="https://example.com/receptbild.jpg"
                  className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-sm text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                    Käll-URL
                  </label>
                  <input
                    type="url"
                    name="sourceUrl"
                    value={formData.sourceUrl}
                    onChange={handleChange}
                    placeholder="https://matblogg.se"
                    className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-sm text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                    Källnamn
                  </label>
                  <input
                    type="text"
                    name="sourceName"
                    value={formData.sourceName}
                    onChange={handleChange}
                    placeholder="t.ex. Matbloggen"
                    className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Taggar (kommaseparerade)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  placeholder="dessert, snabb, enkel"
                  className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              <div>
                <p className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Typ av rätt
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {RECIPE_TYPE_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primaryaccent/15 bg-secondary px-4 py-4 text-left transition hover:border-primaryaccent/30"
                    >
                      <input
                        type="radio"
                        name="recipeType"
                        checked={formData.recipeType === option.value}
                        onChange={() => handleRecipeTypeChange(option.value)}
                        className="mt-1 h-4 w-4 border-primaryaccent text-primaryaccent focus:ring-primaryaccent/30"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-primaryaccent">
                          {option.label}
                        </span>
                        <span className="block text-sm text-primaryaccent/65">
                          {option.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 block text-sm font-semibold text-primaryaccent">
                  Synlighet
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primaryaccent/15 bg-secondary px-4 py-4 text-left transition hover:border-primaryaccent/30">
                    <input
                      type="radio"
                      name="visibility"
                      checked={!formData.isPrivate}
                      onChange={() => handleVisibilityChange(false)}
                      className="mt-1 h-4 w-4 border-primaryaccent text-primaryaccent focus:ring-primaryaccent/30"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-primaryaccent">
                        Offentlig
                      </span>
                      <span className="block text-sm text-primaryaccent/65">
                        Alla kan se det här receptet.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primaryaccent/15 bg-secondary px-4 py-4 text-left transition hover:border-primaryaccent/30">
                    <input
                      type="radio"
                      name="visibility"
                      checked={formData.isPrivate}
                      onChange={() => handleVisibilityChange(true)}
                      className="mt-1 h-4 w-4 border-primaryaccent text-primaryaccent focus:ring-primaryaccent/30"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-primaryaccent">
                        Privat
                      </span>
                      <span className="block text-sm text-primaryaccent/65">
                        Bara du kan se det här receptet.
                      </span>
                    </span>
                  </label>
                </div>
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
                {isSubmitting ? "Sparar..." : "Spara till Nomly"}
              </button>
            </form>

            <Link
              href="/recipes"
              className="mt-6 inline-block text-primaryaccent/60 transition hover:text-primaryaccent"
            >
              ← Tillbaka till recept
            </Link>
          </div>

          <div className="flex flex-col">
            <h2 className="mb-4 text-2xl font-serif font-bold text-primaryaccent">
              Förhandsvisning
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
