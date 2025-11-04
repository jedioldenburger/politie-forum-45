import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // COOP: same-origin-allow-popups preserves opener relationship for Firebase Auth popups
  // This allows window.closed checks to work correctly for OAuth flows

  // CSP: Development-friendly policy for Firebase + Google services + Analytics + User Avatars
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.googletagmanager.com https://*.google-analytics.com https://apis.google.com https://*.firebaseapp.com https://blockchainkix-com-fy.firebaseapp.com https://*.firebasedatabase.app https://*.firebaseio.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.googleusercontent.com https://secure.gravatar.com https://*.firebasestorage.app https://*.tile.openstreetmap.org https://tile.openstreetmap.org",
    "font-src 'self' data:",
    "connect-src 'self' https://*.firebaseapp.com https://blockchainkix-com-fy.firebaseapp.com https://*.firebasedatabase.app wss://*.firebasedatabase.app https://apis.google.com https://*.googleapis.com https://accounts.google.com https://*.google-analytics.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://oauth2.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.firebasestorage.app https://*.googleusercontent.com",
    "frame-src 'self' https://*.firebaseapp.com https://blockchainkix-com-fy.firebaseapp.com https://*.firebasedatabase.app https://accounts.google.com https://www.google.com https://www.facebook.com https://twitter.com https://github.com https://login.microsoftonline.com https://appleid.apple.com",
    "child-src 'self' https://*.firebaseapp.com https://blockchainkix-com-fy.firebaseapp.com https://accounts.google.com",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  // COOP set to same-origin-allow-popups: preserves opener relationship for Firebase Auth popups
  // This allows window.closed checks to work correctly without severing the connection
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match alle routes behalve:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
