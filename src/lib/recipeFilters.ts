export const RECIPE_FILTERS = [
  { key: "all", label: "Alla", keywords: [] },
  {
    key: "efterratt",
    label: "Efterrätt",
    keywords: [
      "efterratt",
      "dessert",
      "cake",
      "cookie",
      "sweet",
      "kladdkaka",
      "paj",
      "brownie",
      "glass",
    ],
  },
  {
    key: "pasta",
    label: "Pasta",
    keywords: [
      "pasta",
      "spaghetti",
      "penne",
      "lasagne",
      "macaroni",
      "tagliatelle",
      "fettuccine",
      "linguine",
    ],
  },
  {
    key: "ris",
    label: "Ris",
    keywords: ["ris", "rice", "fried rice", "risotto"],
  },
  {
    key: "bulgur",
    label: "Bulgur",
    keywords: ["bulgur"],
  },
  {
    key: "gryta",
    label: "Gryta",
    keywords: ["gryta", "stew", "casserole", "ragu"],
  },
  {
    key: "kyckling",
    label: "Kyckling",
    keywords: ["kyckling", "chicken"],
  },
  {
    key: "kott",
    label: "Kött",
    keywords: ["kött", "kott", "beef", "pork", "lamb", "meat"],
  },
  {
    key: "fisk",
    label: "Fisk",
    keywords: ["fisk", "fish", "lax", "salmon", "torsk", "cod"],
  },
  {
    key: "vegetariskt",
    label: "Vegetariskt",
    keywords: [
      "vegetarisk",
      "vegetariskt",
      "vegetarian",
      "veggie",
      "halloumi",
      "linser",
      "lentil",
      "tofu",
    ],
  },
  {
    key: "soppa",
    label: "Soppa",
    keywords: ["soppa", "soup", "broth"],
  },
  {
    key: "sallad",
    label: "Sallad",
    keywords: ["sallad", "salad"],
  },
  {
    key: "snabbt",
    label: "Snabbt",
    keywords: ["snabb", "quick", "easy", "15 min", "20 min", "30 min"],
  },
  {
    key: "ugn",
    label: "Ugn",
    keywords: ["ugn", "oven", "bakad", "roasted", "baked"],
  },
] as const;

export const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
