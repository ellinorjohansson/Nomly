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
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-10 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primaryaccent">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h1 className="mb-3 text-4xl font-bold text-primaryaccent">
          Sign in to add recipes
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-primaryaccent/70">
          Everyone can browse recipes, but creating one requires an account so
          each recipe can be linked to its author.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login?next=/add-recipe"
            className="rounded-full bg-primaryaccent px-6 py-3 font-semibold text-primary transition hover:bg-primaryaccent/90"
          >
            Sign in
          </Link>
          <Link
            href="/signup?next=/add-recipe"
            className="rounded-full border border-primaryaccent/15 bg-secondary px-6 py-3 font-semibold text-primaryaccent transition hover:bg-secondaryaccent/15"
          >
            Create account
          </Link>
        </div>
        <Link
          href="/recipes"
          className="mt-6 inline-block text-sm text-primaryaccent/65 transition hover:text-primaryaccent"
        >
          Back to recipes
        </Link>
      </div>
    </main>
  );
}
