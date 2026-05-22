export interface RecipeTextSection {
  title: string | null;
  items: string[];
}

export type SectionedRecipeField = "ingredients" | "instructions";

const MARKDOWN_SECTION_HEADING_PATTERN = /^\s*#{1,3}\s*(.+?)\s*$/;
const BRACKET_SECTION_HEADING_PATTERN = /^\s*\[(.+?)\]\s*$/;

export const INGREDIENT_SECTION_SUGGESTIONS = [
  "Bas",
  "Sås",
  "Topping",
  "Servering",
] as const;

export const INSTRUCTION_SECTION_SUGGESTIONS = [
  "Förbered",
  "Sås",
  "Montering",
  "Servering",
] as const;

const pushSection = (
  sections: RecipeTextSection[],
  section: RecipeTextSection | null,
) => {
  if (!section || section.items.length === 0) {
    return;
  }

  sections.push({
    title: section.title,
    items: section.items,
  });
};

const parseSectionHeading = (line: string): string | null => {
  const markdownMatch = line.match(MARKDOWN_SECTION_HEADING_PATTERN);

  if (markdownMatch?.[1]) {
    return markdownMatch[1].trim();
  }

  const bracketMatch = line.match(BRACKET_SECTION_HEADING_PATTERN);

  if (bracketMatch?.[1]) {
    return bracketMatch[1].trim();
  }

  return null;
};

export const parseRecipeSections = (text: string): RecipeTextSection[] => {
  const lines = text.split(/\r?\n/);
  const sections: RecipeTextSection[] = [];
  let currentSection: RecipeTextSection | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    const heading = parseSectionHeading(line);

    if (heading) {
      pushSection(sections, currentSection);
      currentSection = {
        title: heading,
        items: [],
      };
      continue;
    }

    if (!currentSection) {
      currentSection = {
        title: null,
        items: [],
      };
    }

    currentSection.items.push(line);
  }

  pushSection(sections, currentSection);

  return sections;
};

export const serializeRecipeSections = (
  sections: RecipeTextSection[],
): string =>
  sections
    .map((section) => {
      const lines = [
        section.title ? `[${section.title}]` : null,
        ...section.items.map((item) => item.trim()).filter(Boolean),
      ].filter((line): line is string => Boolean(line));

      return lines.join("\n");
    })
    .filter(Boolean)
    .join("\n\n");

export const normalizeSectionedText = (text: string): string =>
  serializeRecipeSections(parseRecipeSections(text));

export const appendRecipeSectionHeading = (
  text: string,
  title: string,
): string => {
  const normalizedTitle = title.trim();

  if (!normalizedTitle) {
    return text;
  }

  const currentValue = text.trimEnd();
  const prefix = currentValue ? "\n\n" : "";

  return `${currentValue}${prefix}[${normalizedTitle}]\n`;
};
