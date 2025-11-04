import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for On-Demand Revalidation
 *
 * Usage from Python script:
 * ```python
 * import requests
 * requests.post('https://politie-forum.nl/api/revalidate', json={
 *   'secret': 'your-secret-token',
 *   'path': '/nieuws/article-slug'
 * })
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, path } = body;

    // Verify secret token
    const expectedSecret = process.env.REVALIDATE_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { message: 'REVALIDATE_SECRET not configured' },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    if (!path) {
      return NextResponse.json(
        { message: 'Missing path parameter' },
        { status: 400 }
      );
    }

    // Revalidate the specific path
    revalidatePath(path);

    // Also revalidate the news index page
    revalidatePath('/nieuws');

    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    );
  }
}
