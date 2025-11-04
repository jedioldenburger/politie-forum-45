import { getServerArticles } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface NewsLocation {
  id: string;
  title: string;
  slug: string;
  url: string;
  timestamp: string;
  location: {
    city: string | null;
    region: string | null;
    lat: number | null;
    lng: number | null;
  };
  category: string;
  summary: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const region = searchParams.get('region') || '';
    const period = searchParams.get('period') || '30d';

    // Get articles from Firebase Realtime Database
    const articles = await getServerArticles();

    if (!articles || articles.length === 0) {
      return NextResponse.json([]);
    }

    // Filter articles that have valid location data
    let newsLocations: NewsLocation[] = articles
      .filter((article: any) => {
        const hasLocation = article.location &&
                          article.location.lat &&
                          article.location.lng &&
                          article.location.city;
        return hasLocation;
      })
      .map((article: any) => ({
        id: article.slug,
        title: article.title,
        slug: article.slug,
        url: article.url || `/nieuws/${article.slug}`,
        timestamp: article.timestamp || article.datePublished || new Date().toISOString(),
        location: {
          city: article.location.city,
          region: article.location.region,
          lat: parseFloat(article.location.lat),
          lng: parseFloat(article.location.lng),
        },
        category: article.category || 'Nieuws',
        summary: article.summary || article.excerpt || '',
      }));

    // Apply filters
    if (category) {
      newsLocations = newsLocations.filter((loc) =>
        loc.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (region) {
      newsLocations = newsLocations.filter((loc) =>
        loc.location.region?.toLowerCase().includes(region.toLowerCase())
      );
    }

    // Apply period filter
    if (period !== 'all') {
      const now = new Date();
      const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const cutoffDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

      newsLocations = newsLocations.filter((loc) => {
        const articleDate = new Date(loc.timestamp);
        return articleDate >= cutoffDate;
      });
    }

    // Sort by timestamp descending (newest first)
    newsLocations.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });

    return NextResponse.json(newsLocations);
  } catch (error) {
    console.error('Error fetching news locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news locations' },
      { status: 500 }
    );
  }
}
