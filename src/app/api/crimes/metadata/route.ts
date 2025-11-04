import { NextResponse } from 'next/server';

/**
 * GET /api/crimes/metadata
 *
 * Returns metadata about available crime data:
 * - Available categories
 * - Available regions
 * - Statistics
 *
 * Currently returns empty arrays - ready for real crime data integration
 */
export async function GET() {
  // TODO: Replace with real crime data source
  // When implementing, populate these from your actual data source

  const metadata = {
    categories: [
      'Inbraak',
      'Diefstal',
      'Geweld',
      'Vandalisme',
      'Vermissing',
    ],
    regions: [
      'Noord-Holland',
      'Zuid-Holland',
      'Utrecht',
      'Noord-Brabant',
      'Gelderland',
      'Overijssel',
      'Limburg',
      'Friesland',
      'Groningen',
      'Drenthe',
      'Flevoland',
      'Zeeland',
    ],
    stats: {
      total: 2, // Updated by Crime Map sync
      byCategory: {
        'Geweld': 1,
        'Vandalisme': 1,
      },
      byRegion: {
        'Drenthe': 1, // Emmen
        'Zuid-Holland': 1, // Den Haag
      },
      bySeverity: {
        low: 0,
        medium: 2,
        high: 0,
        critical: 0,
      },
    },
  };

  return NextResponse.json(metadata, {
    headers: {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
    },
  });
}
