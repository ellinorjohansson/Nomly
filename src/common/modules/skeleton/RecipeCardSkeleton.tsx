"use client";

const RecipeCardSkeleton = () => {
  return (
    <article
      className="flex h-full w-full max-w-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-md animate-pulse sm:max-w-85"
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <div className="relative h-56 w-full bg-gray-200" />

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Name */}
        <div className="mb-2 h-6 min-h-8 w-3/4 rounded bg-gray-200" />

        {/* Description */}
        <div className="h-4 min-h-14 w-11/12 rounded bg-gray-200" />

        {/* Bottom row */}
        <div className="mt-auto flex flex-col items-start gap-3 pt-5 sm:flex-row sm:items-end sm:justify-between">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-14 rounded-full bg-gray-200" />
            <div className="h-6 w-16 rounded-full bg-gray-200" />
          </div>

          {/* Cooking time */}
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded bg-gray-200" />
            <div className="h-4 w-10 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default RecipeCardSkeleton;
