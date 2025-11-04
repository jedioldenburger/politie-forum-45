import { AIEnhancedArticle } from '@/lib/types';
import Script from 'next/script';

interface ArticleAISEOProps {
  article: AIEnhancedArticle;
}

/**
 * 🚀 AI-ENHANCED SEO COMPONENT
 *
 * Injects AI-generated structured data and meta tags into <head>:
 *
 * 1. **structuredData**: Complete JSON-LD from MCP pipeline
 *    - NewsArticle schema
 *    - FAQPage schema (if FAQ detected)
 *    - Event schema (if event detected)
 *    - HowTo schema (if steps detected)
 *    - Review schema (if ratings detected)
 *    - Comment schema (nested, max 10)
 *    - Place + GeoCoordinates (100+ Dutch locations)
 *
 * 2. **seoMetaTags**: Next-gen AI search engine metadata
 *    - trustworthiness score (0-100)
 *    - readability score (0-100)
 *    - contentTone (e.g., "concerned", "hopeful")
 *    - semanticSignals (emotions, keyTopics, primaryEntities)
 *
 * This component should be added to article pages alongside existing <Head> meta tags.
 */
export default function ArticleAISEO({ article }: ArticleAISEOProps) {

  // Only render if article has AI enhancements
  if (!article.structuredData && !article.seoMetaTags) {
    return null;
  }

  return (
    <>
      {/* 📊 STRUCTURED DATA (JSON-LD) */}
      {article.structuredData && (
        <Script
          id="ai-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(article.structuredData, null, 0) // Minified for performance
          }}
          strategy="beforeInteractive" // Load before page interaction
        />
      )}

      {/* 🤖 NEXT-GEN AI SEARCH META TAGS */}
      {article.seoMetaTags && (
        <>
          {/* Trustworthiness score (for AI fact-checkers) */}
          {article.seoMetaTags.trustwoAI && (
            <meta
              name="trustworthiness"
              content={article.seoMetaTags.trustwoAI.toString()}
            />
          )}

          {/* Readability score (for content personalization engines) */}
          {article.seoMetaTags.readability && (
            <meta
              name="readability"
              content={article.seoMetaTags.readability.toString()}
            />
          )}

          {/* Content tone (for emotional context-aware search) */}
          {article.seoMetaTags.contentTone && (
            <meta
              name="content-tone"
              content={article.seoMetaTags.contentTone}
            />
          )}

          {/* Sentiment classification (for mood-based filtering) */}
          {article.seoMetaTags.sentiment && (
            <meta
              name="sentiment"
              content={article.seoMetaTags.sentiment}
            />
          )}

          {/* Semantic signals (for AI knowledge graphs) */}
          {article.seoMetaTags.semanticSignals && (
            <>
              {article.seoMetaTags.semanticSignals.emotions && (
                <meta
                  name="emotions"
                  content={article.seoMetaTags.semanticSignals.emotions.join(', ')}
                />
              )}

              {article.seoMetaTags.semanticSignals.keyTopics && (
                <meta
                  name="key-topics"
                  content={article.seoMetaTags.semanticSignals.keyTopics.join(', ')}
                />
              )}

              {article.seoMetaTags.semanticSignals.primaryEntities && (
                <meta
                  name="primary-entities"
                  content={article.seoMetaTags.semanticSignals.primaryEntities.join(', ')}
                />
              )}
            </>
          )}
        </>
      )}

      {/* 🏷️ AI-ENHANCED KEYWORDS (for search engines) */}
      {article.keywords && article.keywords.length > 0 && (
        <meta
          name="keywords"
          content={article.keywords.join(', ')}
        />
      )}

      {/* 📝 AI-GENERATED SUMMARY (for rich snippets) */}
      {article.aiSummary && (
        <meta
          name="description"
          content={article.aiSummary}
        />
      )}

      {/* 🧠 KNOWLEDGE GRAPH HINTS (for Google Knowledge Panel) */}
      {article.aiEntities && (
        <>
          {article.aiEntities.people.length > 0 && (
            <meta
              name="article:author"
              content={article.aiEntities.people.join(', ')}
            />
          )}

          {article.aiEntities.organizations.length > 0 && (
            <meta
              name="article:publisher"
              content={article.aiEntities.organizations[0]}
            />
          )}

          {article.aiEntities.locations.length > 0 && (
            <meta
              name="article:location"
              content={article.aiEntities.locations.join(', ')}
            />
          )}
        </>
      )}

      {/* 🔍 QUALITY SIGNALS (for ranking algorithms) */}
      {article.aiQuality && (
        <>
          <meta
            name="quality-score"
            content={article.aiQuality.qualityScore.toString()}
          />
          <meta
            name="credibility-score"
            content={article.aiQuality.credibilityScore.toString()}
          />
        </>
      )}

      {/* 🎭 SENTIMENT ANALYSIS (for emotional search) */}
      {article.aiSentiment && (
        <>
          <meta
            name="sentiment-score"
            content={article.aiSentiment.score.toString()}
          />
          <meta
            name="emotional-tone"
            content={article.aiSentiment.tone}
          />
          {article.aiSentiment.emotions && (
            <meta
              name="detected-emotions"
              content={article.aiSentiment.emotions.join(', ')}
            />
          )}
        </>
      )}

      {/* 🤖 AI PROCESSING METADATA (for transparency) */}
      {article.aiVersion && (
        <>
          <meta name="ai-version" content={article.aiVersion} />
          {article.aiModel && (
            <meta name="ai-model" content={article.aiModel} />
          )}
          {article.aiProvider && (
            <meta name="ai-provider" content={article.aiProvider} />
          )}
          {article.optimizedAt && (
            <meta name="ai-optimized-at" content={article.optimizedAt} />
          )}
        </>
      )}
    </>
  );
}

/**
 * USAGE EXAMPLE:
 *
 * ```tsx
 * // In your article page (e.g., app/nieuws/[slug]/page.tsx)
 * import ArticleAISEO from '@/components/ArticleAISEO';
 *
 * export default async function ArticlePage({ params }) {
 *   const article = await getServerArticle(params.slug);
 *
 *   return (
 *     <>
 *       <head>
 *         <ArticleAISEO article={article} />
 *       </head>
 *
 *       <article>
 *         <h1>{article.title}</h1>
 *         <div dangerouslySetInnerHTML={{ __html: article.content }} />
 *       </article>
 *     </>
 *   );
 * }
 * ```
 *
 * NEXT.JS 15 APP ROUTER NOTE:
 * In Next.js 15 with App Router, you should use `metadata` export instead of <head>:
 *
 * ```tsx
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const article = await getServerArticle(params.slug);
 *
 *   return {
 *     title: article.title,
 *     description: article.aiSummary || article.excerpt,
 *     keywords: article.keywords,
 *     other: {
 *       'trustworthiness': article.seoMetaTags?.trustwoAI,
 *       'readability': article.seoMetaTags?.readability,
 *       'content-tone': article.seoMetaTags?.contentTone,
 *       // ... add all AI meta tags here
 *     }
 *   };
 * }
 * ```
 */
