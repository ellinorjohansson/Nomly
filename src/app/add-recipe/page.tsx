"use client";

import { useState } from "react";
import Link from "next/link";
import DetailRecipe from "@/common/components/detailRecipe/DetailRecipe";

export default function AddRecipePage() {
  const [formData, setFormData] = useState({
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
  });
  const [tagsInput, setTagsInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    setTagsInput(value);
    setFormData((prev) => ({ ...prev, tag: tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({
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
          tag: [],
        });
        setTagsInput("");
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  return (
    <main className="min-h-screen bg-primary px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h1 className="text-3xl font-serif font-bold text-primaryaccent mb-2 w-80">
              Paste your recipe, save it the <span className="text-amber-600">Nomly</span> way
            </h1>
            <p className="text-primaryaccent/60 mb-8">Fill in your recipe details and see the preview on the right</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-primaryaccent mb-3">
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

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-primaryaccent mb-3">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="A brief description of your recipe"
                  rows={3}
                  className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30 resize-none"
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-sm font-semibold text-primaryaccent mb-3">
                  Ingredients <span className="text-error">*</span>
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  placeholder="One ingredient per line"
                  rows={5}
                  required
                  className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30 resize-none font-mono text-sm"
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-semibold text-primaryaccent mb-3">
                  Instructions <span className="text-error">*</span>
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  placeholder="One step per line"
                  rows={6}
                  required
                  className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30 resize-none font-mono text-sm"
                />
              </div>

              {/* Prep, Cook, Servings */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primaryaccent mb-3">
                    Prep (min)
                  </label>
                  <input
                    type="text"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleChange}
                    placeholder="15"
                    className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primaryaccent mb-3">
                    Cook (min)
                  </label>
                  <input
                    type="text"
                    name="cookingTime"
                    value={formData.cookingTime}
                    onChange={handleChange}
                    placeholder="30"
                    className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primaryaccent mb-3">
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

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-primaryaccent mb-3">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageSrc"
                  value={formData.imageSrc}
                  onChange={handleChange}
                  placeholder="https://example.com/recipe-image.jpg"
                  className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30 text-sm"
                />
              </div>

              {/* Source URL and Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primaryaccent mb-3">
                    Source URL
                  </label>
                  <input
                    type="url"
                    name="sourceUrl"
                    value={formData.sourceUrl}
                    onChange={handleChange}
                    placeholder="https://food-blog.com"
                    className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primaryaccent mb-3">
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

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-primaryaccent mb-3">
                  Tags
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  placeholder="dessert, quick, easy"
                  className="w-full rounded-xl border border-primaryaccent/20 bg-secondary px-4 py-3 text-primaryaccent placeholder:text-primaryaccent/40 focus:outline-none focus:ring-2 focus:ring-primaryaccent/30"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primaryaccent px-4 py-4 font-semibold text-white hover:bg-primaryaccent/90 transition duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="material-symbols-outlined text-xl">
                  check_circle
                </span>
                Save to Nomly
              </button>
            </form>

            <Link href="/recipes" className="inline-block mt-6 text-primaryaccent/60 hover:text-primaryaccent transition">
              ← Back to recipes
            </Link>
          </div>

          {/* Preview */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-serif font-bold text-primaryaccent mb-4">
              Live Preview
            </h2>
            <div className="flex-1">
              <DetailRecipe
                recipe={{
                  ...formData,
                  _id: undefined,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
