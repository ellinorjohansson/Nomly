const TAG_ALIASES: Record<string, string> = {
  appetizer: "Förrätt",
  appetizers: "Förrätt",
  starter: "Förrätt",
  starters: "Förrätt",
  dessert: "Dessert",
  desserts: "Dessert",
  main: "Huvudrätt",
  mains: "Huvudrätt",
  "main course": "Huvudrätt",
  "main courses": "Huvudrätt",
  side: "Tillbehör",
  sides: "Tillbehör",
  "side dish": "Tillbehör",
  "side dishes": "Tillbehör",
  veggie: "Vegetarisk",
  vegetarian: "Vegetarisk",
  vegan: "Vegansk",
  "gluten free": "Glutenfri",
  "gluten-free": "Glutenfri",
  "dairy free": "Mjölkfri",
  "dairy-free": "Mjölkfri",
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
