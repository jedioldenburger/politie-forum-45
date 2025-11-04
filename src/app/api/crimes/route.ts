import { adminDb } from '@/lib/firebaseAdmin';
import { Crime } from '@/utils/types';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * GET /api/crimes
 *
 * Fetch crime data from Firebase Realtime Database
 * Includes news articles synced via Python script (menu option 17)
 *
 * Query parameters:
 * - category: Filter by crime category (e.g., "Inbraak", "Diefstal")
 * - region: Filter by province/region
 * - period: Filter by time period (24h, 7d, 30d, year, all)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const region = searchParams.get('region');
  const period = searchParams.get('period') || '30d';

  let crimes: Crime[] = [];

  try {
    // Fetch crimes from Firebase Realtime Database with timeout
    const crimesRef = adminDb.ref('crimes');

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firebase query timeout')), 25000)
    );

    const snapshot = await Promise.race([
      crimesRef.once('value'),
      timeoutPromise
    ]).catch(error => {
      console.error('Firebase query failed:', error);
      return null;
    });

    if (!snapshot) {
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      });
    };
    const crimesData = snapshot.val();

    if (crimesData) {
      Object.entries(crimesData).forEach(([key, value]: [string, any]) => {
        crimes.push({
          id: value.id || key,
          category: value.category,
          lat: value.lat,
          lng: value.lng,
          region: value.region,
          timestamp: value.timestamp,
          description: value.description,
          severity: value.severity || 'medium',
          articleSlug: value.articleSlug,
          articleTitle: value.articleTitle,
        });
      });
    }

    console.log(`📊 Fetched ${crimes.length} crimes from Firebase`);
  } catch (error) {
    console.error('❌ Error fetching crimes from Firebase:', error);
    // Return empty array on error
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  }

  // Apply filters
  let filtered = crimes;

  if (category) {
    filtered = filtered.filter(crime => crime.category === category);
  }

  if (region) {
    filtered = filtered.filter(crime => crime.region === region);
  }

  if (period !== 'all') {
    const now = Date.now();
    const periodMs: Record<string, number> = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      'year': 365 * 24 * 60 * 60 * 1000,
    };

    const cutoff = now - (periodMs[period] || periodMs['30d']);
    filtered = filtered.filter(crime => crime.timestamp >= cutoff);
  }

  return NextResponse.json(filtered, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
