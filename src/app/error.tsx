"use client";

import { useTranslation } from "@/common/hooks/useTranslation";

export default function Error({
  error,
}: {
  error: Error;
  reset: () => void;
}) {
  const errorT = useTranslation("error");
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-primary gap-8 p-8">
      <div className="max-w-xl text-center">
        <h2 className="text-3xl text-primaryaccent mb-2">
          {errorT("uhoh_something_tripped")}
        </h2>
        <p className="text-secondaryaccent mb-4">
          {errorT("an_unexpected_error_occurred")}{" "}
          {error?.message ? `(${error.message})` : ""}
        </p>
      </div>

      <div className="flex justify-center gap-4">
        
      </div>
    </main>

  );
}
