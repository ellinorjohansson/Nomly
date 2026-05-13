"use client";

import OverviewRecipe from "@/common/components/overviewRecipe/OverviewRecipe";
import RecipeCardSkeleton from "@/common/modules/skeleton/RecipeCardSkeleton";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RecipesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate 1s loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-primary px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primaryaccent">
              Your recipes
            </h1>
            <p className="text-secondaryaccent">
              All your finds, in one delicious place.
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
        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center auto-rows-fr">
            {loading
              ? [...Array(12)].map((_, i) => <RecipeCardSkeleton key={i} />)
              : [...Array(12)].map((_, i) => (
                  <OverviewRecipe
                    key={i}
                    imageSrc="https://img.koket.se/standard-mega/kycklingkebabgryta-med-ris-bong-touch-of-taste.png.webp"
                    name="Kycklingkabab gryta"
                    description="This chicken kebab stew with rice is protein-rich, easy, and very quick to prepare. It is also perfect for weekly meal"
                    tag={["Grytor", "kyckling"]}
                    cookingTime="20 min"
                  />
                ))}
          </div>
        </section>
      </div>
    </main>
  );
}
