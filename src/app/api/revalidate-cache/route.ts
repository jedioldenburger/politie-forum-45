import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route to invalidate Next.js cache after article changes
 * 
 * Usage (from news-rip.py after publishing):
 * POST /api/revalidate-cache
 * Headers: Authorization: Bearer YOUR_SECRET_TOKEN
 * Body: { "tags": ["articles", "latest"] }
 * 
 * Available tags:
 * - "articles" - All article queries
 * - "latest" - Latest articles homepage
 * - "trending" - Most commented articles
 * - "related" - Related articles sidebar
 * - "all" - Full article list (sitemap)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify secret token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || token !== process.env.REVALIDATE_SECRET) {
      console.warn('[revalidate-cache] Unauthorized attempt');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tags = ['articles'] } = body;

    // Revalidate specified cache tags
    for (const tag of tags) {
      console.log(`[revalidate-cache] Invalidating tag: ${tag}`);
      revalidateTag(tag);
    }

    console.log(`[revalidate-cache] ✅ Successfully invalidated ${tags.length} tags`);

    return NextResponse.json({
      success: true,
      revalidated: true,
      tags: tags,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[revalidate-cache] Error:', error);
    return NextResponse.json(
      { error: 'Revalidation failed', details: error.message },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    message: 'Cache revalidation API is active',
    availableTags: ['articles', 'latest', 'trending', 'related', 'all'],
  });
}
