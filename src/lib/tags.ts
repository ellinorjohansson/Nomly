const TAG_ALIASES: Record<string, string> = {
  appetizer: "Starter",
  appetizers: "Starter",
  starter: "Starter",
  starters: "Starter",
  dessert: "Dessert",
  desserts: "Dessert",
  main: "Main",
  mains: "Main",
  "main course": "Main",
  "main courses": "Main",
  side: "Side",
  sides: "Side",
  "side dish": "Side",
  "side dishes": "Side",
  veggie: "Vegetarian",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  "gluten free": "Gluten-Free",
  "gluten-free": "Gluten-Free",
  "dairy free": "Dairy-Free",
  "dairy-free": "Dairy-Free",
};

const formatWord = (word: string) =>
  word ? word.charAt(0).toUpperCase() + word.slice(1) : "";

export const normalizeTag = (tag: string) => {
  const baseTag = tag
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  if (!baseTag) {
    return "";
  }

  const aliasMatch = TAG_ALIASES[baseTag];

  if (aliasMatch) {
    return aliasMatch;
  }

  return baseTag.split(" ").map(formatWord).join(" ");
};

export const normalizeTags = (tags: string[]) => {
  const uniqueTags = new Map<string, string>();

  tags.forEach((tag) => {
    const normalizedTag = normalizeTag(tag);

    if (!normalizedTag) {
      return;
    }

    uniqueTags.set(normalizedTag.toLowerCase(), normalizedTag);
  });

  return Array.from(uniqueTags.values());
};
