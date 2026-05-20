import Link from "next/link";
import { cookies } from "next/headers";
import AddRecipeForm from "@/common/components/addRecipeForm/AddRecipeForm";
import { getSessionFromCookies } from "@/lib/auth";

export default async function AddRecipePage() {
  const session = getSessionFromCookies(await cookies());

  return session ? (
    <AddRecipeForm authorName={session.name} />
  ) : (
    <main className="min-h-screen bg-primary px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2rem bg-white p-10 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primaryaccent">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h1 className="mb-3 text-4xl font-bold text-primaryaccent">
          Logga in för att lägga till recept
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-primaryaccent/70">
          Alla kan bläddra bland recept, men för att skapa ett eget behöver du
          ett konto så att receptet kan kopplas till sin författare.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login?next=/add-recipe"
            className="rounded-full bg-primaryaccent px-6 py-3 font-semibold text-primary transition hover:bg-primaryaccent/90"
          >
            Logga in
          </Link>
          <Link
            href="/signup?next=/add-recipe"
            className="rounded-full border border-primaryaccent/15 bg-secondary px-6 py-3 font-semibold text-primaryaccent transition hover:bg-secondaryaccent/15"
          >
            Skapa konto
          </Link>
        </div>
        <Link
          href="/recipes"
          className="mt-6 inline-block text-sm text-primaryaccent/65 transition hover:text-primaryaccent"
        >
          Tillbaka till recept
        </Link>
      </div>
    </main>
  );
}
