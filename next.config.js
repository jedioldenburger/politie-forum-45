/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforce React's strict checks in development
  reactStrictMode: true,

  // Hide the "X-Powered-By: Next.js" header for security
  poweredByHeader: false,

  // ✅ T1: Disable trailing slash for clean URLs (matches Firebase config)
  trailingSlash: false,

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
  },

  // ✅ Transpile only for truly necessary legacy browsers (removes polyfills for modern browsers)
  transpilePackages: [],

  // ✅ Headers: Broadly compatible, safe baseline settings
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // No cache for development
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },

          // Security headers (Lowest safe settings)
          { key: "X-Frame-Options", value: "SAMEORIGIN" }, // Allows framing by your own site
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },

          // HSTS: Force HTTPS for 1 year
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },

          // CSP: Permissive policy allowing 'self', https:, data:, and unsafe-inline/eval
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https: wss:",
              "frame-src 'self' https:",
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
      // Trailing slash enforcement: redirect non-trailing to trailing
      {
        source: "/:path((?!.*\\.).*[^/]$)",
        destination: "/:path/",
        permanent: true,
      },
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
