/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforce React's strict checks in development
  reactStrictMode: true,

  // Hide the "X-Powered-By: Next.js" header for security
  poweredByHeader: false,

  // ✅ Enable trailing slash for SEO-friendly URLs
  trailingSlash: true,

  // ✅ Turbopack configuration for faster builds
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.ts',
    },
  },

  // ✅ Output optimization
  compress: true,
  generateEtags: true,
  productionBrowserSourceMaps: false,
  // Note: swcMinify is enabled by default in Next.js 15+

  // ✅ Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year cache for static images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 90, 100], // ✅ Explicitly configure quality values for Next.js 16
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    // ✅ Modern remotePatterns (replaces deprecated domains)
    remotePatterns: [
      // Local dev
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'localhost' },

      // Firebase hosting
      { protocol: 'https', hostname: '*.firebaseapp.com' },
      { protocol: 'https', hostname: '*.web.app' },

      // Production domains
      { protocol: 'https', hostname: 'politie-forum.nl' },
      { protocol: 'https', hostname: 'www.politie-forum.nl' },

      // Vercel deployments
      { protocol: 'https', hostname: '*.vercel.app' },

      // Firebase Storage
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },

      // External CDN sources
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  // ✅ Ignore build-time linting & TS errors during development
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // ✅ Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep console.error and console.warn in production
    } : false,
    // Remove React properties and debug info in production (includes local paths cleanup)
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // ✅ Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'firebase/app', 'firebase/auth', 'firebase/database'],
    // Note: optimizeCss requires 'critters' module - disabled to prevent build errors
    // optimizeCss: true,
    // Enable granular chunks for better caching
    optimizeServerReact: true,
  },

  // ✅ Transpile only for truly necessary legacy browsers (removes polyfills for modern browsers)
  transpilePackages: [],

  // ✅ Headers: Optimized for Google SERP, Bing, Google News, and Google Discover
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: "/(.*)",
        headers: [
          // Development: no cache | Production: 5min Edge cache with stale-while-revalidate
          // Optimized for: Googlebot, Bingbot, Google News crawler, Google Discover
          { 
            key: "Cache-Control", 
            value: isDevelopment 
              ? "no-store, no-cache, must-revalidate" 
              : "public, s-maxage=300, stale-while-revalidate=300, stale-if-error=86400" 
          },
          
          // Vary header: Important for Google Discover (mobile-first) and Bing caching
          { key: "Vary", value: "Accept-Encoding, User-Agent" },

          // Security headers (Lowest safe settings)
          { key: "X-Frame-Options", value: "SAMEORIGIN" }, // Allows framing by your own site
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },

          // HSTS: Force HTTPS for 1 year
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },

          // X-Robots-Tag: SEO control for all pages (default: index, follow)
          { key: "X-Robots-Tag", value: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },

          // CSP: Balanced security - allows Firebase/GTM while protecting against XSS
          // Note: 'unsafe-inline' required for React hydration, 'unsafe-eval' for Firebase SDK
          // Production: Consider implementing nonce-based CSP for stricter security
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.firebaseapp.com https://*.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https: wss: https://*.firebaseio.com https://*.googleapis.com https://*.google-analytics.com",
              "frame-src 'self' https://accounts.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; ")
          },

          // COOP for Firebase Auth popups
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
      // News articles: Google News optimization
      {
        source: "/nieuws/:slug*",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1, noarchive" },
          { key: "Cache-Control", value: "public, s-maxage=600, stale-while-revalidate=300" },
        ],
      },
      // Admin & API routes: No indexing
      {
        source: "/(admin|api)/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      // Auth pages: No indexing
      {
        source: "/(login|register)/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, follow" },
        ],
      },
      // Static assets: Long-term immutable caching
      {
        source: "/:path*.(js|css|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // ✅ SEO-friendly redirects
  async redirects() {
    return [
      // www → non-www redirect
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.politie-forum.nl",
          },
        ],
        destination: "https://politie-forum.nl/:path*",
        permanent: true,
      },
      // Vercel preview domain → production domain
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "politie-forum-45.vercel.app",
          },
        ],
        destination: "https://politie-forum.nl/:path*",
        statusCode: 301,
      },
    ];
  },
};

module.exports = nextConfig;
