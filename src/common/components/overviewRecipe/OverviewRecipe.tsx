/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { formatDuration } from "@/lib/duration";

interface OverviewRecipeProps {
  id: string;
  name: string;
  description: string;
  isPrivate?: boolean;
  tag: string[];
  cookingTime: string;
  imageSrc: string;
}

const formatTag = (tag: string) =>
  tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : "";

const OverviewRecipe = ({
  id,
  name,
  description,
  isPrivate = false,
  tag,
  cookingTime,
  imageSrc,
}: OverviewRecipeProps) => {
  return (
    <Link
      href={`/recipes/${id}`}
      className="block h-full w-full max-w-full sm:max-w-85"
    >
      <article className="flex h-full flex-col rounded-2xl overflow-hidden bg-white shadow-md transition duration-600 hover:shadow-2xl hover:shadow-primaryaccent/70">
        <div className="relative w-full h-56 bg-secondaryaccent/10">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-secondaryaccent">
              <span className="material-symbols-outlined text-5xl">
                restaurant
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          {isPrivate && (
            <p className="pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primaryaccent/55">
              Private
            </p>
          )}

          <h2 className="text-lg font-semibold text-black! line-clamp-2 min-h-8 pb-2">
            {name}
          </h2>

          <p className="text-sm text-primaryaccent line-clamp-3 min-h-14">
            {description}
          </p>

          <div className="mt-auto flex flex-col items-start gap-3 pt-5 sm:flex-row sm:items-end sm:justify-between">
            <ul className="flex flex-wrap gap-2">
              {tag.slice(0, 3).map((t, index) => (
                <li
                  key={index}
                  className="text-xs bg-secondaryaccent/20 px-2 py-1 rounded-full font-bold text-primaryaccent"
                >
                  {formatTag(t)}
                </li>
              ))}
            </ul>

            <span className="flex items-center gap-1 text-xs text-secondaryaccent">
              <span className="material-symbols-outlined text-sm!">
                schedule
              </span>
              {formatDuration(cookingTime)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default OverviewRecipe;
