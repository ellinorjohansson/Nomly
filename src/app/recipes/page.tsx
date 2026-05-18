"use client";

import ShowRecipes from "@/common/components/showRecipes/ShowRecipes";
import Link from "next/link";

export default function RecipesPage() {
  return (
    <main className="min-h-screen bg-primary px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primaryaccent">
              All recipes
            </h1>
            <p className="text-secondaryaccent">
              All the best finds from you and your friends, in one delicious
              place.
            </p>
          </div>
          <Link
            href="/add-recipe"
            className="rounded-lg bg-primaryaccent px-4 py-2 font-medium text-primary flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined">add</span>
            Add recipe
          </Link>
        </div>
        <ShowRecipes />
      </div>
    </main>
  );
}
