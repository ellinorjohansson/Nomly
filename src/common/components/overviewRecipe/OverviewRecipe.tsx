interface OverviewRecipeProps {
  name: string;
  description: string;
  tag: string[];
  cookingTime: string;
  imageSrc: string;
}

const OverviewRecipe = ({
  name,
  description,
  tag,
  cookingTime,
  imageSrc,
}: OverviewRecipeProps) => {
  return (
    <article className="rounded-2xl overflow-hidden shadow-md bg-white w-[400] cursor-pointer hover:shadow-primaryaccent/70 hover:shadow-2xl transition duration-600">
      {/* Image */}
      <div className="relative w-full h-full">
        <img src={imageSrc} alt={name} className="object-cover"></img>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-black!">{name}</h2>

        <p className="text-sm text-primaryaccent">{description}</p>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-5">
          {/* Tags */}
          <ul className="flex flex-wrap gap-2">
            {tag.map((t, index) => (
              <li
                key={index}
                className="text-xs bg-secondaryaccent/20 px-2 py-1 rounded-full font-bold text-primaryaccent"
              >
                {t}
              </li>
            ))}
          </ul>

          {/* Cooking time */}
          <span className="flex items-center gap-1 text-xs text-secondaryaccent">
            <span className="material-symbols-outlined text-sm!">schedule</span>
            {cookingTime}
          </span>
        </div>
      </div>
    </article>
  );
};

export default OverviewRecipe;
