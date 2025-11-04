import { adminFirestore } from '@/lib/firebaseAdmin';
import { AIEnhancedArticle } from '@/lib/types';
import Link from 'next/link';

interface RelatedArticlesProps {
  currentSlug: string;
  article: AIEnhancedArticle;
  limit?: number;
}

/**
 * 🧠 SEMANTIC ARTICLE LINKING COMPONENT (Server Component)
 *
 * Uses AI-enhanced entity extraction (aiEntities) to find related articles based on:
 * - Shared people (e.g., same suspect, same victim)
 * - Shared organizations (e.g., same police department, same institution)
 * - Shared locations (e.g., same city, same district)
 * - Shared keywords (e.g., same crime type, same topic)
 * - Similar sentiment (e.g., both urgent/concerned tone)
 *
 * This provides better semantic matching than simple tag-based recommendations.
 *
 * NOTE: This is a SERVER COMPONENT - it runs on the server and fetches data at build/request time
 */
export default async function RelatedArticles({
  currentSlug,
  article,
  limit = 5
}: RelatedArticlesProps) {

  // Extract AI entities from current article
  const { aiEntities } = article;

  if (!aiEntities) {
    return null; // No AI data available, skip related articles
  }

  try {
    // Fetch all AI-enhanced articles for semantic matching
    const snapshot = await adminFirestore
      .collection('ai_news')
      .orderBy('publishedAt', 'desc')
      .limit(50) // Search within recent 50 articles
      .get();

    if (snapshot.empty) return null;

    // Score articles based on entity overlap
    const scoredArticles = snapshot.docs
      .map(doc => {
        const data = doc.data() as any;
        const slug = doc.id;

        // Skip current article
        if (slug === currentSlug) return null;

        // Skip articles without AI entities
        if (!data.aiEntities) return null;

        let score = 0;

        // +5 points per shared person
        const sharedPeople = aiEntities.people?.filter(
          p => data.aiEntities.people?.includes(p)
        ).length || 0;
        score += sharedPeople * 5;

        // +4 points per shared organization
        const sharedOrgs = aiEntities.organizations?.filter(
          o => data.aiEntities.organizations?.includes(o)
        ).length || 0;
        score += sharedOrgs * 4;

        // +3 points per shared location
        const sharedLocations = aiEntities.locations?.filter(
          l => data.aiEntities.locations?.includes(l)
        ).length || 0;
        score += sharedLocations * 3;

        // +2 points per shared keyword
        const sharedKeywords = aiEntities.keywords?.filter(
          k => data.aiEntities.keywords?.includes(k)
        ).length || 0;
        score += sharedKeywords * 2;

        // +3 points if same sentiment tone
        if (article.aiSentiment?.tone === data.aiSentiment?.tone) {
          score += 3;
        }

        // +2 points if both from same category
        if (article.category === data.category) {
          score += 2;
        }

        // Bonus for recent articles (within 7 days)
        const daysOld = (Date.now() - data.publishedAt) / (1000 * 60 * 60 * 24);
        if (daysOld < 7) score += 3;
        else if (daysOld < 30) score += 1;

        return {
          slug,
          title: data.title,
          excerpt: data.aiSummary || data.excerpt,
          publishedAt: data.publishedAt,
          image: data.imageUrl || data.image,
          sentiment: data.aiSentiment?.tone || 'neutral',
          sharedEntities: {
            people: sharedPeople,
            organizations: sharedOrgs,
            locations: sharedLocations,
            keywords: sharedKeywords
          },
          score
        };
      })
      .filter(item => item !== null && item.score > 0) // Only show articles with entity overlap
      .sort((a, b) => (b?.score || 0) - (a?.score || 0))
      .slice(0, limit);

    if (scoredArticles.length === 0) return null;

    return (
      <section className="related-articles mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          📚 Gerelateerde verhalen
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Op basis van gedeelde personen, organisaties en locaties
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scoredArticles.map((item: any) => (
            <Link
              key={item.slug}
              href={`/nieuws/${item.slug}`}
              className="group block rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
            >
              {item.image && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {item.excerpt}
                </p>

                {/* Entity overlap badges */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {item.sharedEntities.people > 0 && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      👤 {item.sharedEntities.people} persoon{item.sharedEntities.people > 1 ? 'en' : ''}
                    </span>
                  )}
                  {item.sharedEntities.organizations > 0 && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      🏢 {item.sharedEntities.organizations} org.
                    </span>
                  )}
                  {item.sharedEntities.locations > 0 && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                      📍 {item.sharedEntities.locations} locatie{item.sharedEntities.locations > 1 ? 's' : ''}
                    </span>
                  )}

                  {/* Sentiment tone badge */}
                  <span className={`px-2 py-1 rounded ${
                    item.sentiment === 'urgent' ? 'bg-red-100 text-red-700' :
                    item.sentiment === 'concerned' ? 'bg-orange-100 text-orange-700' :
                    item.sentiment === 'hopeful' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.sentiment}
                  </span>
                </div>

                {/* Relevance score (debug mode - can be hidden in production) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-2 text-xs text-gray-400">
                    Relevantie: {item.score} punten
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Knowledge graph hint */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            💡 <strong>Semantische koppeling:</strong> Deze artikelen zijn automatisch gekoppeld
            op basis van AI-gedetecteerde entiteiten (personen, organisaties, locaties) in plaats
            van simpele tags. Dit zorgt voor relevantere aanbevelingen.
          </p>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return null;
  }
}
