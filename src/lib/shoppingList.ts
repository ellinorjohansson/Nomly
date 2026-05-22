import type { IRecipe } from "@/models/Recipe";
import { parseRecipeSections } from "@/lib/recipeSections";

export interface ShoppingListSource {
  recipeId: string;
  recipeName: string;
  sectionTitle: string | null;
  originalLabel: string;
}

export interface ShoppingListItem {
  label: string;
  normalizedLabel: string;
  categoryKey: ShoppingCategoryKey;
  sources: ShoppingListSource[];
  variants: string[];
  totalQuantity: number | null;
  quantityUnit: string | null;
  hasConsistentQuantity: boolean;
  isChecked: boolean;
}

export interface ShoppingListGroup {
  key: ShoppingCategoryKey;
  label: string;
  items: ShoppingListItem[];
}

const INGREDIENT_CHECKLIST_STORAGE_PREFIX = "nomly:ingredients:";

const SHOPPING_CATEGORIES = [
  {
    key: "vegetables",
    label: "Grönsaker",
    keywords: [
      "lök",
      "gul lök",
      "rödlök",
      "vitlök",
      "morot",
      "paprika",
      "tomat",
      "gurka",
      "spenat",
      "broccoli",
      "blomkål",
      "potatis",
      "sallad",
      "avokado",
      "chili",
      "citron",
      "lime",
      "svamp",
      "zucc",
      "aubergine",
      "selleri",
      "purjolök",
      "majs",
      "kål",
      "ärtor",
      "bönor",
    ],
  },
  {
    key: "fruit-herbs",
    label: "Frukt & örter",
    keywords: [
      "äpple",
      "päron",
      "banan",
      "jordgubb",
      "blåbär",
      "hallon",
      "apelsin",
      "mango",
      "basilika",
      "persilja",
      "koriander",
      "dill",
      "timjan",
      "rosmarin",
      "mynta",
    ],
  },
  {
    key: "meat",
    label: "Kött & fågel",
    keywords: [
      "kyckling",
      "nöt",
      "ox",
      "fläsk",
      "bacon",
      "korv",
      "färs",
      "skinka",
      "kalkon",
      "lamm",
    ],
  },
  {
    key: "fish",
    label: "Fisk & skaldjur",
    keywords: [
      "lax",
      "torsk",
      "tonfisk",
      "räk",
      "skaldjur",
      "mussl",
      "fisk",
      "ansjovis",
    ],
  },
  {
    key: "dairy",
    label: "Mejeri & ägg",
    keywords: [
      "mjölk",
      "grädde",
      "smör",
      "ost",
      "yoghurt",
      "creme fraiche",
      "crème fraîche",
      "kvarg",
      "ägg",
      "mozzarella",
      "parmesan",
      "feta",
    ],
  },
  {
    key: "bakery",
    label: "Bröd & bageri",
    keywords: ["bröd", "tortilla", "pitabröd", "hamburgerbröd", "baguette"],
  },
  {
    key: "pantry",
    label: "Skafferi",
    keywords: [
      "pasta",
      "ris",
      "bulgur",
      "quinoa",
      "mjöl",
      "socker",
      "honung",
      "olja",
      "olivolja",
      "vinäger",
      "krossade tomater",
      "kokosmjölk",
      "bönor",
      "linser",
      "nudlar",
      "havre",
      "ströbröd",
    ],
  },
  {
    key: "spices",
    label: "Kryddor & smak",
    keywords: [
      "salt",
      "peppar",
      "paprikapulver",
      "spiskummin",
      "oregano",
      "kanel",
      "kardemumma",
      "buljong",
      "senap",
      "soja",
      "tabasco",
      "sriracha",
      "curry",
      "chiliflakes",
      "vanilj",
    ],
  },
] as const;

export type ShoppingCategoryKey =
  | (typeof SHOPPING_CATEGORIES)[number]["key"]
  | "other";

const OTHER_CATEGORY = {
  key: "other" as const,
  label: "Övrigt",
};

export const SHOPPING_CATEGORY_OPTIONS = [
  ...SHOPPING_CATEGORIES,
  OTHER_CATEGORY,
];

const MEASUREMENT_TOKENS = new Set([
  "g",
  "gram",
  "gr",
  "kg",
  "hg",
  "mg",
  "ml",
  "cl",
  "dl",
  "l",
  "tsk",
  "msk",
  "krm",
  "st",
  "pkt",
  "förp",
  "förpackning",
  "burk",
  "burkar",
  "paket",
  "nypa",
  "nypor",
  "skiva",
  "skivor",
  "bit",
  "bitar",
  "knippe",
  "näve",
  "naven",
]);

const PREFIX_TOKENS = new Set(["ca", "cirka", "ungefär"]);

const TOKEN_NORMALIZATIONS: Record<string, string> = {
  gula: "gul",
  röda: "röd",
  gröna: "grön",
  mogna: "mogen",
  färska: "färsk",
  hackade: "hackad",
  skivade: "skivad",
  tärnade: "tärnad",
  vispgrädde: "grädde",
  matgrädde: "grädde",
  lökar: "lök",
  rödlökar: "rödlök",
  vitlöksklyftor: "vitlök",
  morötter: "morot",
  tomater: "tomat",
  potatisar: "potatis",
  paprikor: "paprika",
  citroner: "citron",
  limefrukter: "lime",
  chilifrukter: "chili",
  äpplen: "äpple",
  päron: "päron",
  kycklingfiléer: "kycklingfilé",
  filéer: "filé",
  äggulor: "äggula",
  äggvitor: "äggvita",
};

const FRACTION_PATTERN = /^[\d.,/¼½¾]+$/;
const FRACTION_VALUES: Record<string, number> = {
  "¼": 0.25,
  "½": 0.5,
  "¾": 0.75,
};

const normalizeIngredientLabel = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,;:()]/g, "")
    .trim();

const normalizeIngredientToken = (token: string) => {
  const normalizedToken = TOKEN_NORMALIZATIONS[token];

  if (normalizedToken) {
    return normalizedToken;
  }

  if (token.endsWith("or") && token.length > 5) {
    return token.slice(0, -2);
  }

  if (token.endsWith("ar") && token.length > 5) {
    return token.slice(0, -2);
  }

  if (token.endsWith("er") && token.length > 5) {
    return token.slice(0, -2);
  }

  return token;
};

const parseQuantityToken = (token: string): number | null => {
  if (FRACTION_VALUES[token] !== undefined) {
    return FRACTION_VALUES[token];
  }

  if (token.includes("/")) {
    const [numerator, denominator] = token.split("/");
    const left = Number.parseFloat(numerator.replace(",", "."));
    const right = Number.parseFloat(denominator.replace(",", "."));

    if (!Number.isNaN(left) && !Number.isNaN(right) && right !== 0) {
      return left / right;
    }
  }

  const parsed = Number.parseFloat(token.replace(",", "."));

  return Number.isNaN(parsed) ? null : parsed;
};

const parseIngredientAmount = (value: string) => {
  const normalizedLabel = normalizeIngredientLabel(value)
    .replace(/[+*-]/g, " ")
    .replace(/\s+/g, " ");
  const tokens = normalizedLabel.split(" ").filter(Boolean);

  if (!tokens.length) {
    return null;
  }

  let currentIndex = 0;

  while (
    currentIndex < tokens.length &&
    PREFIX_TOKENS.has(tokens[currentIndex])
  ) {
    currentIndex += 1;
  }

  const quantityToken = tokens[currentIndex];

  if (!quantityToken || !FRACTION_PATTERN.test(quantityToken)) {
    return null;
  }

  const quantity = parseQuantityToken(quantityToken);

  if (quantity === null) {
    return null;
  }

  const unitToken = tokens[currentIndex + 1];
  const quantityUnit =
    unitToken && MEASUREMENT_TOKENS.has(unitToken)
      ? normalizeIngredientToken(unitToken)
      : null;

  return {
    quantity,
    unit: quantityUnit,
  };
};

const formatQuantity = (value: number) => {
  if (Number.isInteger(value)) {
    return `${value}`;
  }

  return value
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/0$/, "")
    .replace(".", ",");
};

const getIngredientMergeKey = (value: string) => {
  const normalizedLabel = normalizeIngredientLabel(value)
    .replace(/[+*-]/g, " ")
    .replace(/\s+/g, " ");
  const tokens = normalizedLabel.split(" ").filter(Boolean);
  let startIndex = 0;

  while (startIndex < tokens.length) {
    const token = tokens[startIndex];

    if (
      PREFIX_TOKENS.has(token) ||
      FRACTION_PATTERN.test(token) ||
      MEASUREMENT_TOKENS.has(token)
    ) {
      startIndex += 1;
      continue;
    }

    break;
  }

  const ingredientTokens = tokens
    .slice(startIndex)
    .map(normalizeIngredientToken);

  return ingredientTokens.join(" ").trim() || normalizedLabel;
};

const categorizeIngredient = (ingredient: string): ShoppingCategoryKey => {
  const normalizedIngredient = normalizeIngredientLabel(ingredient);

  for (const category of SHOPPING_CATEGORIES) {
    if (
      category.keywords.some((keyword) =>
        normalizedIngredient.includes(keyword.toLowerCase()),
      )
    ) {
      return category.key;
    }
  }

  return OTHER_CATEGORY.key;
};

export const getCheckedIngredientIndexes = (recipeId: string): number[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(
      `${INGREDIENT_CHECKLIST_STORAGE_PREFIX}${recipeId}`,
    );

    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((index): index is number => typeof index === "number");
  } catch {
    return [];
  }
};

export const buildShoppingList = (recipes: IRecipe[]): ShoppingListGroup[] => {
  const itemMap = new Map<string, ShoppingListItem>();

  for (const recipe of recipes) {
    const recipeId = recipe._id || "";

    if (!recipeId) {
      continue;
    }

    const checkedIndexes = new Set(getCheckedIngredientIndexes(recipeId));
    const sections = parseRecipeSections(recipe.ingredients || "");
    let ingredientIndex = 0;

    for (const section of sections) {
      for (const item of section.items) {
        const currentIndex = ingredientIndex;
        ingredientIndex += 1;

        if (checkedIndexes.has(currentIndex)) {
          continue;
        }

        const normalizedLabel = getIngredientMergeKey(item);
        const parsedAmount = parseIngredientAmount(item);

        if (!normalizedLabel) {
          continue;
        }

        const existingItem = itemMap.get(normalizedLabel);

        if (existingItem) {
          existingItem.sources.push({
            recipeId,
            recipeName: recipe.name,
            sectionTitle: section.title,
            originalLabel: item.trim(),
          });

          if (!existingItem.variants.includes(item.trim())) {
            existingItem.variants.push(item.trim());
          }

          if (
            existingItem.hasConsistentQuantity &&
            existingItem.totalQuantity !== null &&
            parsedAmount &&
            existingItem.quantityUnit === parsedAmount.unit
          ) {
            existingItem.totalQuantity += parsedAmount.quantity;
          } else {
            existingItem.hasConsistentQuantity = false;
            existingItem.totalQuantity = null;
            existingItem.quantityUnit = null;
          }

          continue;
        }

        itemMap.set(normalizedLabel, {
          label: normalizedLabel,
          normalizedLabel,
          categoryKey: categorizeIngredient(item),
          sources: [
            {
              recipeId,
              recipeName: recipe.name,
              sectionTitle: section.title,
              originalLabel: item.trim(),
            },
          ],
          variants: [item.trim()],
          totalQuantity: parsedAmount?.quantity ?? null,
          quantityUnit: parsedAmount?.unit ?? null,
          hasConsistentQuantity: Boolean(parsedAmount),
          isChecked: false,
        });
      }
    }
  }

  return SHOPPING_CATEGORY_OPTIONS.map((category) => ({
    key: category.key,
    label: category.label,
    items: [...itemMap.values()]
      .filter((item) => item.categoryKey === category.key)
      .sort((left, right) => left.label.localeCompare(right.label, "sv")),
  })).filter((group) => group.items.length > 0);
};

export const formatShoppingListItemLabel = (item: ShoppingListItem) => {
  if (item.hasConsistentQuantity && item.totalQuantity !== null) {
    const formattedQuantity = formatQuantity(item.totalQuantity);

    return item.quantityUnit
      ? `${formattedQuantity} ${item.quantityUnit} ${item.label}`
      : `${formattedQuantity} ${item.label}`;
  }

  if (item.variants.length === 1) {
    return item.variants[0];
  }

  return item.label;
};

export const createShoppingListText = (groups: ShoppingListGroup[]) =>
  groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.isChecked),
    }))
    .filter((group) => group.items.length > 0)
    .map((group) => {
      const items = group.items
        .map((item) => {
          const label = formatShoppingListItemLabel(item);

          if (item.variants.length === 1 || item.hasConsistentQuantity) {
            return `- ${label}`;
          }

          return `- ${label} (${item.variants.join(", ")})`;
        })
        .join("\n");

      return `${group.label}\n${items}`;
    })
    .join("\n\n");
