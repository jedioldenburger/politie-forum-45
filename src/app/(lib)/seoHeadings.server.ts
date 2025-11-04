"use server";

export type Evidence = { citation?: boolean; sources?: string[] };

export type NewsArticleSEO = {
  headline: string;
  description?: string;
  articleSection?: string;
  keywords?: string[];
  contentLocation?: { name?: string };
  datePublished?: string;
  dateModified?: string;
  commentCount?: number;
  evidence?: Evidence;
};

export type SeoHeadings = {
  h1: string;
  h2: string[];
  h3: Record<string, string[]>;
};

const smartTrim = (s: string, max = 65) => {
  if (s.length <= max) return s;
  const cut = s.slice(0, max + 1);
  const last = Math.max(cut.lastIndexOf(" "), cut.lastIndexOf("—"), cut.lastIndexOf(":"));
  return (last > 40 ? cut.slice(0, last) : cut.slice(0, max)).trimEnd() + "…";
};

const sentenceCase = (s: string) =>
  s
    .toLowerCase()
    .replace(/(^|[.!?]\s+)([a-zà-ÿ])/g, (_, p1, p2) => p1 + p2.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();

const flaggedTerms = [
  "roekeloos",
  "fraude",
  "corrupt",
  "onrechtmatig",
  "illegaal",
  "geschorst",
  "verboden",
];

const needsCaution = (title: string, ev?: Evidence) =>
  flaggedTerms.some((w) => new RegExp(`\\b${w}\\b`, "i").test(title)) && !ev?.citation;

function presetH2(section: string, place?: string, year?: number): string[] {
  const base = [
    "Wat is er beslist?",
    "Achtergrond & context",
    `Tijdlijn${year ? ` ${year}` : ""}`,
    `Gevolgen${place ? ` voor ${place}` : ""}`,
    "Reacties & duiding",
    "FAQ",
  ];
  if (section.toLowerCase().includes("internation")) {
    base[0] = "Wat is er beslist en door wie?";
    base[1] = "Aanleiding & juridische basis";
    base[4] = "Scenario's & risico's";
  } else if (section.toLowerCase().includes("misdaad") || section.toLowerCase().includes("crime")) {
    base[0] = "Feiten en stand van zaken";
    base[1] = "Achtergrond & context";
    base[3] = `Opsporing & gevolgen${place ? ` voor ${place}` : ""}`;
  }
  return base;
}

export async function generateSeoHeadingsServer(article: NewsArticleSEO): Promise<SeoHeadings> {
  const year = article.datePublished ? new Date(article.datePublished).getFullYear() : undefined;
  const place = article.contentLocation?.name?.trim();
  const section = article.articleSection?.trim() || "Nieuws";
  const baseTitle = article.headline?.trim() || "Update";

  let h1 = baseTitle;
  if (needsCaution(baseTitle, article.evidence)) {
    h1 = h1
      .replace(/\broekeloos(heid)?/gi, "besluit")
      .replace(/\bgeschorst(e|)/gi, "geschorste topbestuurder");
  }
  if (year && !/\b20\d{2}\b/.test(h1)) h1 += ` (${year})`;
  if (place && !new RegExp(`\\b${place}\\b`, "i").test(h1)) h1 += ` – ${place}`;
  h1 = smartTrim(h1);

  const h2 = presetH2(section, place, year);

  const h3: Record<string, string[]> = {
    [h2[0]]: ["Kernpunten in 60 seconden", place ? `Wie / Wat / Waar — focus: ${place}` : "Wie / Wat / Waar"],
    [h2[1]]: ["Wie zijn de betrokken partijen?", "Relevante wet- en regelgeving"],
    [h2[2]]: ["Belangrijkste datums", "Documenten & brieven"],
    [h2[3]]: ["Directe en indirecte impact", "Effect op 0–6 maanden"],
    [h2[4]]: ["Officiële reacties", "Analyse & vooruitblik"],
    FAQ: ["Wat verandert er nu?", "Wat kan er nog volgen?"],
  };

  // Normalize casing for headings
  const normalize = (s: string) => sentenceCase(s).replace(/\s+/g, " ").trim();

  const h1Norm = normalize(h1);
  const h2Norm = h2.map(normalize);
  const h3NormEntries = Object.entries(h3).map(([k, v]) => [normalize(k), v.map(normalize)] as [string, string[]]);
  const h3Norm: Record<string, string[]> = Object.fromEntries(h3NormEntries);

  return { h1: h1Norm, h2: h2Norm, h3: h3Norm };
}
