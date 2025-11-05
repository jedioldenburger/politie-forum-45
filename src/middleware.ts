import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // Toegestane bots voor SEO en indexatie
  const allowedBots = [
    'googlebot',
    'googlebot-news',
    'googlebot-image',
    'google-extended',
    'bingbot',
    'duckduckbot',
    'slurp',
    'yandexbot',
  ];

  // Toegestane SEO-routes
  const seoPaths = [
    '/robots.txt',
    '/sitemap.xml',
    '/news-sitemap.xml',
    '/feed.xml',
    '/atom.xml',
    '/news-feed.xml',
  ];

  const isSEOPath = seoPaths.some(path => pathname.startsWith(path));
  const isCrawler = allowedBots.some(bot => userAgent.includes(bot));

  // ✅ Crawler bypass: voorkom rate limiting of edge blocking
  if (isCrawler && isSEOPath) {
    const response = NextResponse.next();
    response.headers.set('X-Allow-Crawler', 'true');
    response.headers.set('Cache-Control', 'public, max-age=600');
    response.headers.set('X-Robots-Tag', 'all');
    return response;
  }

  // ✅ Browserbezoekers en API-verkeer gewoon doorlaten
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match alle verzoeken behalve de volgende paden:
     * - api (API routes)
     * - _next/static (statische bestanden)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - sw.js (service worker)
     * - manifest.webmanifest (PWA manifest)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest).*)',
  ],
};