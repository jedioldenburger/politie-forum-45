import type { Article as FirebaseArticle } from "@/lib/firebaseAdmin";

export interface ArticleCategoryInfo {
  /** Original category value from the data source */
  raw: string | null | undefined;
  /** Normalised, lowercase version without punctuation */
  normalized: string;
  /** Human friendly label used in breadcrumbs and UI */
  displayName: string;
  /** Value used for Open Graph `article:section` and Schema.org */
  articleSection: string;
  /** Genre string for Schema.org */
  genre: string;
  /** Canonical slug used in URLs (no leading slash) */
  slug: string;
  /** Canonical path for breadcrumb links (includes trailing slash) */
  path: string;
  /** Value for the page level `meta[name="category"]` */
  metaCategory: string;
}

type ArticleInput = Pick<FirebaseArticle, "category" | "tags" | "location">;

const CATEGORY_PRESETS: Record<
  string,
  Omit<ArticleCategoryInfo, "raw" | "normalized" | "path">
> = {
  "veiligheid-overlast": {
    displayName: "Veiligheid / Overlast",
    articleSection: "Veiligheid / Overlast",
    genre: "Nieuws / Veiligheid",
    slug: "veiligheid-overlast",
    metaCategory: "Nieuws",
  },
  binnenland: {
    displayName: "Binnenland",
    articleSection: "Nieuws / Binnenland",
    genre: "Nieuws / Binnenland",
    slug: "binnenland",
    metaCategory: "Nieuws",
  },
  politiek: {
    displayName: "Politiek",
    articleSection: "Nieuws / Politiek",
    genre: "Nieuws / Politiek",
    slug: "politiek",
    metaCategory: "Nieuws",
  },
  justitie: {
    displayName: "Justitie & Rechtspraak",
    articleSection: "Nieuws / Justitie",
    genre: "Nieuws / Justitie",
    slug: "justitie",
    metaCategory: "Nieuws",
  },
};

const SAFETY_KEYWORDS = [
  "overlast",
  "veiligheid",
  "incident",
  "politie",
  "brandweer",
  "misdaad",
  "criminaliteit",
  "ongeval",
  "calamiteit",
];

const JUSTITIE_KEYWORDS = ["rechtbank", "justitie", "rechtszaak", "rechtspraak"];

function normalise(value?: string | null): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .replace(/[._]/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function pickPresetKey(article: ArticleInput): string {
  const normalizedCategory = normalise(article.category);

  const tagKeys = new Set(
    (article.tags || []).map((tag) => normalise(tag))
  );

  const matchesKeyword = (keywords: string[]) =>
    keywords.some(
      (keyword) =>
        normalizedCategory.includes(keyword) ||
        Array.from(tagKeys).some((tag) => tag.includes(keyword))
    );

  if (matchesKeyword(SAFETY_KEYWORDS)) {
    return "veiligheid-overlast";
  }

  if (matchesKeyword(JUSTITIE_KEYWORDS)) {
    return "justitie";
  }

  if (normalizedCategory.includes("politiek")) {
    return "politiek";
  }

  if (
    normalizedCategory.includes("binnenland") ||
    normalizedCategory.includes("nederland") ||
    (article.location?.name &&
      article.location.name.toLowerCase() !== "nederland")
  ) {
    return "binnenland";
  }

  return "binnenland";
}

export function resolveArticleCategory(
  article: ArticleInput
): ArticleCategoryInfo {
  const presetKey = pickPresetKey(article);
  const preset =
    CATEGORY_PRESETS[presetKey] ?? CATEGORY_PRESETS["binnenland"];
  const raw = article.category;
  const normalized = normalise(raw);

  return {
    raw,
    normalized,
    displayName: preset.displayName,
    articleSection: preset.articleSection,
    genre: preset.genre,
    slug: preset.slug,
    path: `/nieuws/${preset.slug}/`,
    metaCategory: preset.metaCategory,
  };
}

export function shortenSeoTitle(title: string, maxLength = 66): string {
  if (!title) return title;
  if (title.length <= maxLength) return title;

  const separators = [" – ", " - ", " | ", ": "];
  for (const separator of separators) {
    if (title.includes(separator)) {
      const [firstPart] = title.split(separator);
      if (firstPart.length >= Math.min(24, maxLength)) {
        return firstPart.slice(0, maxLength);
      }
    }
  }

  const words = title.split(/\s+/);
  let shortened = "";

  for (const word of words) {
    if ((shortened + word).length + 1 > maxLength) {
      break;
    }
    shortened = `${shortened}${shortened ? " " : ""}${word}`;
  }

  if (!shortened) {
    return title.slice(0, maxLength);
  }

  return `${shortened.trim()}…`;
}
