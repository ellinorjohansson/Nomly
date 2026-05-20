"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/recipes";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Det gick inte att skapa konto");
      }

      router.push(nextPath);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Det gick inte att skapa konto",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-primary px-4 py-16">
      <div className="max-w-md mx-auto bg-secondary rounded-xl p-8">
        <h1 className="text-3xl font-serif font-bold text-primaryaccent mb-4">
          Skapa konto
        </h1>
        <p className="text-secondaryaccent mb-6">Skapa ditt Nomly-konto.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Namn"
            value={formData.name}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, name: event.target.value }))
            }
            className="w-full rounded-lg border border-primaryaccent/30 bg-primary px-3 py-2 text-primaryaccent"
          />
          <input
            type="email"
            placeholder="E-post"
            value={formData.email}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, email: event.target.value }))
            }
            className="w-full rounded-lg border border-primaryaccent/30 bg-primary px-3 py-2 text-primaryaccent"
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={formData.password}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, password: event.target.value }))
            }
            className="w-full rounded-lg border border-primaryaccent/30 bg-primary px-3 py-2 text-primaryaccent"
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primaryaccent px-4 py-2 font-medium text-primary"
          >
            {isSubmitting ? "Skapar konto..." : "Skapa konto"}
          </button>
        </form>
        <p className="mt-4 text-secondaryaccent">
          Har du redan ett konto?{" "}
          <Link
            href={`/login?next=${encodeURIComponent(nextPath)}`}
            className="underline"
          >
            Logga in
          </Link>
        </p>
      </div>
    </main>
  );
}
