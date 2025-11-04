import { getAllArticleSlugs, getServerArticle } from "@/lib/firebaseAdmin";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleClient from "./ArticleClient";

const BASE_URL = "https://politie-forum.nl";

// ISR Configuration - automatically rebuild pages every 10 minutes
export const revalidate = 600; // 10 minutes

// Generate static pages for existing articles at build time
export async function generateStaticParams() {
  try {
    const slugs = await getAllArticleSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    // Return empty array on error - pages will be generated on-demand
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const article = await getServerArticle(slug);

    if (!article) {
      notFound();
    }

  const articleUrl = `${BASE_URL}/nieuws/${slug}`;
  const imageUrl = article.imageUrl
    ? article.imageUrl.startsWith("http")
      ? article.imageUrl
      : `${BASE_URL}${article.imageUrl}`
    : `${BASE_URL}/og/politie-forum-1200x630.png`;
  const publishedTime = article.publishedAt || new Date().toISOString();
  const modifiedTime = article.updatedAt || publishedTime;
  const keywords = article.tags?.length
    ? article.tags
    : ["politie", "nieuws", "Nederland"];
  const keywordsString = keywords.join(", ");

  return {
    title: article.title,
    description: article.excerpt,
    keywords,
    alternates: {
      canonical: articleUrl,
      languages: {
        "nl-NL": articleUrl,
        "x-default": articleUrl,
      },
    },
    openGraph: {
      type: "article",
      url: articleUrl,
      title: article.title,
      description: article.excerpt,
      siteName: "Politie Forum Nederland",
      locale: "nl_NL",
      publishedTime,
      modifiedTime,
      authors: ["Politie Forum Nederland"],
      section: article.category || "Nieuws",
      tags: keywords,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@politieforum",
      creator: "@politieforum",
      title: article.title,
      description: article.excerpt,
      images: [imageUrl],
    },
    other: {
      "article:published_time": publishedTime,
      "article:modified_time": modifiedTime,
      news_keywords: keywordsString,
    },
    icons: {
      icon: [
        { url: "/police_badge_icon.ico", sizes: "any" },
        {
          url: "/police_badge_icon_32x32.png",
          type: "image/png",
          sizes: "32x32",
        },
        {
          url: "/police_badge_icon_192x192.png",
          type: "image/png",
          sizes: "192x192",
        },
        {
          url: "/police_badge_icon_512x512.png",
          type: "image/png",
          sizes: "512x512",
        },
      ],
      apple: [{ url: "/police_badge_icon_192x192.png", sizes: "192x192" }],
      shortcut: ["/police_badge_icon.ico"],
      other: [
        {
          rel: "mask-icon",
          url: "/favicon.svg",
          color: "#001f5c",
        },
      ],
    },
  };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Return basic metadata as fallback
    return {
      title: "Article | Politie Forum Nederland",
      description: "Politie nieuws en discussies",
    };
  }
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const article = await getServerArticle(slug);

    if (!article) {
      notFound();
    }

    return <ArticleClient article={article} slug={slug} />;
  } catch (error) {
    console.error("Error loading article:", error);
    notFound();
  }
}
