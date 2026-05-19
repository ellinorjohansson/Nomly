import RecipeCardSkeleton from "@/common/modules/skeleton/RecipeCardSkeleton";

const MENU_DAYS = ["Monday", "Wednesday", "Friday"];

const WeeklyMenuSkeleton = () => {
  return (
    <section className="bg-primary px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <div className="mb-2 h-3 w-28 rounded-full bg-secondaryaccent/20" />
          <div className="h-10 w-72 rounded-full bg-secondaryaccent/20" />
          <div className="mt-3 h-4 w-full max-w-xl rounded-full bg-secondaryaccent/15" />
          <div className="mt-2 h-4 w-full max-w-lg rounded-full bg-secondaryaccent/15" />
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-6 py-2 sm:grid-cols-2 lg:grid-cols-3 lg:py-4 justify-items-stretch">
          {MENU_DAYS.map((day) => (
            <div key={day} className="flex w-full flex-col gap-3">
              <div className="h-4 w-24 rounded-full bg-secondaryaccent/20" />
              <div className="w-full">
                <RecipeCardSkeleton />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeeklyMenuSkeleton;