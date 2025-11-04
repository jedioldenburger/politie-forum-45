import { toISO } from "@/lib/dates";
import { getAllArticleSlugs, getServerArticle, getServerArticleComments } from "@/lib/firebaseAdmin";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleClient from "./ArticleClient";
import ArticleJsonLd from "@/components/ArticleJsonLd";

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
      return {
        title: "Artikel niet gevonden | Politie Forum Nederland",
        description: "Het gevraagde artikel kon niet worden gevonden.",
      };
    }

    const articleUrl = `${BASE_URL}/nieuws/${slug}`;
    const imageUrl = `${BASE_URL}/og/politie-forum-1200x630.png`;

    // Convert timestamps to ISO8601
    const publishedTime = toISO(article.publishedAt);
    const modifiedTime = toISO(article.updatedAt || article.publishedAt);

    // Clean section (remove trailing dot) and description
    const section = (article.category || "Nieuws").replace(/\.$/, "").trim();
    const description = (article.excerpt || "").replace(/…$/, "").slice(0, 158).trim();

    const keywords = article.tags?.length ? article.tags : ["politie", "nieuws", "Nederland"];

    return {
      title: `${article.title} | Politie Forum Nederland`,
      description,
      keywords,
      alternates: {
        canonical: articleUrl,
        languages: {
          "nl-NL": articleUrl,
          "x-default": articleUrl,
        },
      },
      robots: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
        },
      },
      openGraph: {
        type: "article",
        url: articleUrl,
        title: article.title,
        description,
        siteName: "Politie Forum Nederland",
        locale: "nl_NL",
        publishedTime,
        modifiedTime,
        authors: ["Politie Forum Redactie"],
        section,
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
        description,
        images: [imageUrl],
      },
      other: {
        "application/ld+json": JSON.stringify(jsonLd),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Artikel | Politie Forum Nederland",
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

    // Fetch comments for JSON-LD schema
    const comments = await getServerArticleComments(slug);

    return (
      <>
        <ArticleJsonLd article={article} slug={slug} comments={comments} />
        <ArticleClient article={article} slug={slug} />
      </>
    );
  } catch (error) {
    console.error("Error loading article:", error);
    notFound();
  }
}

    // Helper functions to detect schema types in content - REMOVE THIS
    const detectFAQs_OLD = (content: string) => {
      const faqPattern = /(?:##\s*(?:Veelgestelde\s+vragen|FAQ|Vragen\s+en\s+antwoorden)[\s\S]*?)(?=##|$)/gi;
      const match = content.match(faqPattern);
      if (!match) return [];

      const qaPairs: Array<{question: string, answer: string}> = [];
      const qaPattern = /\*\*([^*]+)\*\*\s*\n>?\s*"?([^"\n]+)/g;
      let qaMatch;
      while ((qaMatch = qaPattern.exec(match[0])) !== null) {
        qaPairs.push({
          question: qaMatch[1].trim(),
          answer: qaMatch[2].trim()
        });
      }
      return qaPairs.slice(0, 5); // Max 5 FAQ's
    };

    const detectEvents = (content: string) => {
      const eventPattern = /(?:intake|open\s+dag|informatie(?:sessie|bijeenkomst)|cursus|training|workshop)/gi;
      const datePattern = /(\d{1,2}\s+(?:januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)\s+\d{4})/gi;

      if (eventPattern.test(content) && datePattern.test(content)) {
        const dates = content.match(datePattern);
        return dates ? dates[0] : null;
      }
      return null;
    };

    const detectHowTo = (content: string) => {
      const howToPattern = /(?:##\s*(?:Hoe|Stappen?|Tips?|Procedure)[\s\S]*?)(?=##|$)/gi;
      const match = content.match(howToPattern);
      if (!match) return [];

      const steps: string[] = [];
      const stepPattern = /(?:###\s*(?:Stap|Fase)\s*\d+:?\s*(.+)|^\d+\.\s*\*\*(.+?)\*\*)/gm;
      let stepMatch;
      while ((stepMatch = stepPattern.exec(match[0])) !== null) {
        steps.push((stepMatch[1] || stepMatch[2]).trim());
      }
      return steps.slice(0, 8); // Max 8 steps
    };

    const detectReviews = (comments: any[]) => {
      // Detect reviews from comments with ratings/stars
      return comments.filter(c =>
        /⭐|★|rating|beoordeling|cijfer/i.test(c.content)
      ).slice(0, 5);
    };

    // Detect schema types
    const faqs = article.content ? detectFAQs(article.content) : [];
    const eventDate = article.content ? detectEvents(article.content) : null;
    const howToSteps = article.content ? detectHowTo(article.content) : [];
    const reviews = detectReviews(comments);

    // Build Place JSON-LD with dynamic geo-coordinates
    const placeSchema: any = {
      "@type": "Place",
      "@id": `${articleUrl}#place`,
      "name": locationName,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NL"
      }
    };

    // Add geo coordinates if available
    if (hasGeoCoordinates) {
      placeSchema.geo = {
        "@type": "GeoCoordinates",
        "latitude": article.location!.latitude,
        "longitude": article.location!.longitude
      };
    }

    // Enhanced JSON-LD with NewsArticle + DiscussionForumPosting + Geo
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        // Place (Geo-locatie - dynamisch uit artikel)
        placeSchema,
        // NewsArticle schema
        {
          "@type": "NewsArticle",
          "@id": `${articleUrl}#article`,
          "headline": article.title,
          "description": article.excerpt || article.title,
          "url": articleUrl,
          "mainEntityOfPage": articleUrl,
          "image": {
            "@type": "ImageObject",
            "url": imageUrl,
            "width": 1200,
            "height": 630
          },
          "datePublished": publishedTime,
          "dateModified": modifiedTime,
          "author": {
            "@type": "Person",
            "name": "Politie Forum Redactie"
          },
          "publisher": {
            "@id": "https://politie-forum.nl/#org"
          },
          "articleSection": section,
          "keywords": keywords,
          "inLanguage": "nl-NL",
          "isAccessibleForFree": true,
          "contentLocation": {
            "@id": `${articleUrl}#place`
          }
        },
        // DiscussionForumPosting schema (voor reacties)
        {
          "@type": "DiscussionForumPosting",
          "@id": `${articleUrl}#discussion`,
          "headline": `Discussie: ${article.title}`,
          "articleBody": `Forumdiscussie over: ${article.excerpt || article.title}`,
          "url": `${articleUrl}#reacties`,
          "about": {
            "@id": `${articleUrl}#article`
          },
          "author": {
            "@id": "https://politie-forum.nl/#org"
          },
          "datePublished": publishedTime,
          "inLanguage": "nl-NL",
          "commentCount": comments.length,
          "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/CommentAction",
            "userInteractionCount": comments.length
          },
          "comment": comments.slice(0, 10).map((comment) => ({
            "@type": "Comment",
            "text": comment.content.length > 200
              ? comment.content.slice(0, 200) + "..."
              : comment.content,
            "dateCreated": toISO(comment.createdAt),
            "author": {
              "@type": "Person",
              "name": comment.authorName || "Anoniem"
            }
          }))
        },
        // FAQPage schema (indien FAQ's gedetecteerd)
        ...(faqs.length > 0 ? [{
          "@type": "FAQPage",
          "@id": `${articleUrl}#faq`,
          "mainEntity": faqs.map((faq, index) => ({
            "@type": "Question",
            "@id": `${articleUrl}#faq-${index + 1}`,
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }] : []),
        // Event schema (indien event gedetecteerd)
        ...(eventDate ? [{
          "@type": "Event",
          "@id": `${articleUrl}#event`,
          "name": article.title,
          "description": article.excerpt || article.title,
          "startDate": eventDate,
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
          "location": {
            "@id": `${articleUrl}#place`
          },
          "organizer": {
            "@id": "https://politie-forum.nl/#org"
          },
          "image": imageUrl,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          }
        }] : []),
        // HowTo schema (indien stappen gedetecteerd)
        ...(howToSteps.length > 0 ? [{
          "@type": "HowTo",
          "@id": `${articleUrl}#howto`,
          "name": article.title,
          "description": article.excerpt || article.title,
          "image": imageUrl,
          "totalTime": "PT30M",
          "step": howToSteps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step,
            "text": step,
            "url": `${articleUrl}#stap-${index + 1}`
          }))
        }] : []),
        // Review/Rating schema (indien reviews gedetecteerd in comments)
        ...(reviews.length > 0 ? [{
          "@type": "Article",
          "@id": `${articleUrl}#reviews`,
          "about": {
            "@id": `${articleUrl}#article`
          },
          "review": reviews.map((review, index) => ({
            "@type": "Review",
            "@id": `${articleUrl}#review-${index + 1}`,
            "author": {
              "@type": "Person",
              "name": review.authorName || "Anoniem"
            },
            "datePublished": toISO(review.createdAt),
            "reviewBody": review.content.slice(0, 200),
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "4",
              "bestRating": "5"
            }
          }))
        }] : [])
      ]
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ArticleClient article={article} slug={slug} />
      </>
    );
  } catch (error) {
    console.error("Error loading article:", error);
    notFound();
  }
}
