"use client";

const RecipeCardSkeleton = () => {
  return (
    <article
      className="w-full cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md animate-pulse sm:max-w-90"
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <div className="relative h-56 w-full bg-gray-200" />

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />

        {/* Description */}
        <div className="mb-5 h-4 w-11/12 rounded bg-gray-200" />

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-5">
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
