"use client";

export default function Error({ error }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-primary gap-8 p-8">
      <div className="max-w-xl text-center">
        <h2 className="text-3xl text-primaryaccent mb-2">Något gick fel!</h2>
        <p className="text-secondaryaccent mb-4">
          {"Försök igen senare"} {error?.message ? `(${error.message})` : ""}
        </p>
      </div>

      <div className="flex justify-center gap-4"></div>
    </main>
  );
}
