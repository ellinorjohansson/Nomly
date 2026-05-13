import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-primary px-4 py-16">
      <div className="max-w-md mx-auto bg-secondary rounded-xl p-8">
        <h1 className="text-3xl font-serif font-bold text-primaryaccent mb-4">Login</h1>
        <p className="text-secondaryaccent mb-6">Sign in to access your recipes.</p>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-primaryaccent/30 bg-primary px-3 py-2 text-primaryaccent"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-primaryaccent/30 bg-primary px-3 py-2 text-primaryaccent"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-primaryaccent px-4 py-2 font-medium text-primary"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-secondaryaccent">
          No account? <Link href="/signup" className="underline">Create one</Link>
        </p>
      </div>
    </main>
  );
}
