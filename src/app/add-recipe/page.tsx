import Link from "next/link";

export default function AddRecipePage() {
  return (
    <main className="min-h-screen bg-primary px-4 py-16">
      <div className="max-w-2xl mx-auto bg-secondary rounded-xl p-8">
        <h1 className="text-3xl font-serif font-bold text-primaryaccent mb-4">Add Recipe</h1>
        <p className="text-secondaryaccent mb-6">Save a new recipe to your collection.</p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Recipe title"
            className="w-full rounded-lg border border-primaryaccent/30 bg-primary px-3 py-2 text-primaryaccent"
          />
          <textarea
            placeholder="Description"
            rows={4}
            className="w-full rounded-lg border border-primaryaccent/30 bg-primary px-3 py-2 text-primaryaccent"
          />
          <textarea
            placeholder="Ingredients"
            rows={5}
            className="w-full rounded-lg border border-primaryaccent/30 bg-primary px-3 py-2 text-primaryaccent"
          />
          <textarea
            placeholder="Steps"
            rows={6}
            className="w-full rounded-lg border border-primaryaccent/30 bg-primary px-3 py-2 text-primaryaccent"
          />
          <button
            type="submit"
            className="rounded-lg bg-primaryaccent px-4 py-2 font-medium text-primary"
          >
            Save recipe
          </button>
        </form>
        <Link href="/recipes" className="inline-block mt-4 text-secondaryaccent underline">
          Back to recipes
        </Link>
      </div>
    </main>
  );
}
