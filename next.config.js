/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  compress: true,
  generateEtags: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'politie-forum.nl' },
      { protocol: 'https', hostname: '*.vercel.app' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: '*.unsplash.com' },
    ],
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: isDev
              ? 'no-store, no-cache, must-revalidate'
              : 'public, s-maxage=300, stale-while-revalidate=600, stale-if-error=86400',
          },
          { key: 'Vary', value: 'Accept-Encoding, User-Agent' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
          },
          {
            key: 'Content-Security-Policy',
            value: isDev 
              ? [
                  // Development: Relaxed CSP for hot reload
                  "default-src 'self'",
                  "worker-src 'self' blob:",
                  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com",
                  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                  "connect-src 'self' blob: data: https: wss: https://*.firebaseio.com https://*.googleapis.com https://*.google-analytics.com",
                  "img-src 'self' data: blob: https:",
                  "font-src 'self' data: https://fonts.gstatic.com",
                  "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com",
                  "object-src 'none'",
                  "base-uri 'self'",
                  "form-action 'self'",
                  "frame-ancestors 'self'",
                ].join('; ')
              : [
                  // Production: Balanced CSP for YMYL trust (removed 'unsafe-eval')
                  "default-src 'self'",
                  "worker-src 'self' blob:",
                  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com",
                  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                  "connect-src 'self' blob: data: https: wss: https://*.firebaseio.com https://*.googleapis.com https://*.google-analytics.com",
                  "img-src 'self' data: blob: https:",
                  "font-src 'self' data: https://fonts.gstatic.com",
                  "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com",
                  "object-src 'none'",
                  "base-uri 'self'",
                  "form-action 'self'",
                  "frame-ancestors 'self'",
                  "upgrade-insecure-requests",
                ].join('; '),
          },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
        ],
      },

      // Sitemap & feeds — maximale toegankelijkheid
      {
        source: '/(sitemap.xml|news-sitemap.xml|feed.xml|atom.xml|news-feed.xml)',
        headers: [
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, s-maxage=600, stale-while-revalidate=600' },
          { key: 'X-Allow-Crawler', value: 'true' },
          { key: 'X-Robots-Tag', value: 'index, follow' },
        ],
      },

      // Nieuwsartikelen
      {
        source: '/nieuws/:slug*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value:
              'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1, noarchive',
          },
          { key: 'Cache-Control', value: 'public, s-maxage=900, stale-while-revalidate=600' },
        ],
      },

      // Admin & API
      {
        source: '/(admin|api)/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },

      // Login & register
      {
        source: '/(login|register)/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, follow' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        ],
      },

      // Assets caching
      {
        source: '/:path*.(js|css|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },

  // ✅ Redirects for old/incorrect URLs
  async redirects() {
    return [
      // EN language (not supported)
      { source: '/en/:path*', destination: '/', permanent: true },
      
      // /tip → /tips (singular to plural)
      { source: '/tip', destination: '/tips', permanent: true },
      
      // /categorieen variants → canonical (but exclude exact /categorieen to prevent loop)
      { source: '/categorieën', destination: '/categorieen', permanent: true },
      
      // Old URL patterns → correct ones
      { source: '/forum-rules', destination: '/gebruikersregels', permanent: true },
      { source: '/forum-rules/', destination: '/gebruikersregels', permanent: true },
      { source: '/terms', destination: '/voorwaarden', permanent: true },
      { source: '/terms-of-service', destination: '/voorwaarden', permanent: true },
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/cookie-policy', destination: '/cookies', permanent: true },
      { source: '/accessibility', destination: '/toegankelijkheid', permanent: true },
      { source: '/accessibility/', destination: '/toegankelijkheid', permanent: true },
      { source: '/search', destination: '/zoeken', permanent: true },
      { source: '/search/', destination: '/zoeken', permanent: true },
      
      // Non-existent features → homepage
      { source: '/opsporingen', destination: '/', permanent: false },
      { source: '/opsporingen/', destination: '/', permanent: false },
      { source: '/vermissingen', destination: '/', permanent: false },
      { source: '/vermissingen/', destination: '/', permanent: false },
      { source: '/events/:path*', destination: '/', permanent: false },
      { source: '/popular', destination: '/', permanent: false },
      { source: '/user/:path*', destination: '/', permanent: false },
      
      // AMP pages (not supported)
      { source: '/article/:path*/amp', destination: '/nieuws/:path*', permanent: true },
      { source: '/article/:path*/amp/', destination: '/nieuws/:path*', permanent: true },
      { source: '/article/:path*', destination: '/nieuws/:path*', permanent: true },
      { source: '/sitemap-amp.xml', destination: '/sitemap.xml', permanent: true },
      
      // Old URL formats → new format
      { source: '/home.html', destination: '/', permanent: true },
      { source: '/tag/:slug/', destination: '/tag/:slug', permanent: true },
      { source: '/categorie/:slug/', destination: '/categorie/:slug', permanent: true },
      
      // ✅ Google Search Console 404s - Nov 5, 2025
      
      // /public/ and development files → homepage
      { source: '/public/:path*', destination: '/', permanent: true },
      { source: '/database-seeder.html', destination: '/', permanent: true },
      { source: '/database-seeder.html/', destination: '/', permanent: true },
      { source: '/firebase-test.html', destination: '/', permanent: true },
      { source: '/firebase-test.html/', destination: '/', permanent: true },
      { source: '/code/:path*', destination: '/', permanent: true },
      
      // /forum template variables → homepage
      { source: '/forum/${section.id}', destination: '/', permanent: true },
      { source: '/forum/${section.id}/', destination: '/', permanent: true },
      { source: '/forum/${discussion.slug}', destination: '/', permanent: true },
      { source: '/forum/${discussion.slug}/', destination: '/', permanent: true },
      
      // /forum/threads variants → forum homepage
      { source: '/forum/threads', destination: '/forum', permanent: true },
      { source: '/forum/threads/', destination: '/forum', permanent: true },
      { source: '/forum/threads/:path*', destination: '/forum', permanent: true },
      
      // /forum/topics → forum homepage
      { source: '/forum/topics', destination: '/forum', permanent: true },
      { source: '/forum/topics/', destination: '/forum', permanent: true },
      
      // /forum/aankondigingen → forum homepage
      { source: '/forum/aankondigingen', destination: '/forum', permanent: true },
      { source: '/forum/aankondigingen/', destination: '/forum', permanent: true },
      
      // /forum/welkom variants → forum homepage
      { source: '/forum/welkom', destination: '/forum', permanent: true },
      { source: '/forum/welkom/', destination: '/forum', permanent: true },
      { source: '/forum/welkom/:path*', destination: '/forum', permanent: true },
      
      // /forum/trending → forum homepage
      { source: '/forum/trending', destination: '/forum', permanent: true },
      { source: '/forum/trending/', destination: '/forum', permanent: true },
      
      // /forum/recente-incidenten → forum homepage
      { source: '/forum/recente-incidenten', destination: '/forum', permanent: true },
      { source: '/forum/recente-incidenten/', destination: '/forum', permanent: true },
      
      // /forum/juridische-kwesties → forum homepage
      { source: '/forum/juridische-kwesties', destination: '/forum', permanent: true },
      { source: '/forum/juridische-kwesties/', destination: '/forum', permanent: true },
      
      // /forum with region parameter → homepage
      { source: '/forum', has: [{ type: 'query', key: 'region' }], destination: '/', permanent: true },
      
      // /forum/noord-nederland variants → forum homepage
      { source: '/forum/noord-nederland/:path*', destination: '/forum', permanent: true },
      
      // /category variants → /categorie
      { source: '/category', destination: '/categorieen', permanent: true },
      { source: '/category/', destination: '/categorieen', permanent: true },
      { source: '/category/:path*', destination: '/categorieen', permanent: true },
      
      // /article variants → /nieuws
      { source: '/article', destination: '/nieuws', permanent: true },
      { source: '/article/', destination: '/nieuws', permanent: true },
      { source: '/article/:slug', destination: '/nieuws/:slug', permanent: true },
      { source: '/article/:slug/', destination: '/nieuws/:slug', permanent: true },
      { source: '/article/:slug/amp.html', destination: '/nieuws/:slug', permanent: true },
      { source: '/article/:slug/amp.html/', destination: '/nieuws/:slug', permanent: true },
      
      // /nieuws without trailing slash variants
      { source: '/nieuws/:slug([^/]+)$', destination: '/nieuws/:slug', permanent: true },
      
      // /over-ons variants → correct pages
      { source: '/over-ons/correcties', destination: '/correcties', permanent: true },
      { source: '/over-ons/correcties/', destination: '/correcties', permanent: true },
      { source: '/over-ons/redactiebeleid', destination: '/redactionele-principes', permanent: true },
      { source: '/over-ons/redactiebeleid/', destination: '/redactionele-principes', permanent: true },
      { source: '/over-ons/financiering', destination: '/eigendom', permanent: true },
      { source: '/over-ons/financiering/', destination: '/eigendom', permanent: true },
      
      // /voorwaarden/ with trailing slash → canonical without
      { source: '/voorwaarden/', destination: '/voorwaarden', permanent: true },
      
      // /user variants → profiel
      { source: '/user', destination: '/profiel', permanent: true },
      { source: '/user/', destination: '/profiel', permanent: true },
      
      // Query parameter redirects
      { source: '/', has: [{ type: 'query', key: 'region' }], destination: '/', permanent: true },
      
      // /nieuws/verkeersveiligheid variants → nieuws homepage
      { source: '/nieuws/verkeersveiligheid', destination: '/nieuws', permanent: true },
      { source: '/nieuws/verkeersveiligheid/', destination: '/nieuws', permanent: true },
    ];
  },
};

module.exports = nextConfig;