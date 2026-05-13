import Link from "next/link";

export default function RecipesPage() {
  return (
    <main className="min-h-screen bg-primary px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold text-primaryaccent">Recipes</h1>
          <Link href="/add-recipe" className="rounded-lg bg-primaryaccent px-4 py-2 font-medium text-primary">
            Add recipe
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {["Pasta Primavera", "Tomato Soup", "Banana Bread", "Greek Salad"].map((name) => (
            <article key={name} className="rounded-xl bg-secondary p-5">
              <h2 className="text-xl font-serif text-primaryaccent mb-1">{name}</h2>
              <p className="text-secondaryaccent">Simple, delicious, and ready to save.</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
