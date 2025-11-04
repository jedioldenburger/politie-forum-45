import { Analytics } from "@/components/Analytics";
import { ConditionalAuthProvider } from "@/components/ConditionalAuthProvider";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";

// Performance monitoring (development only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  import('@/lib/performance');
}


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false // Disable preload to prevent unused preload warning
});

// Viewport configuration (Next.js 15+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // iOS PWA full-screen
};

export const metadata: Metadata = {
  metadataBase: new URL("https://politie-forum.nl"),
  title: {
    default: "Politie Forum Nederland - Het Grootste Nederlandse Politie Forum",
    template: "%s | Politie Forum Nederland",
  },
  description:
    "Het grootste Nederlandse forum over de politie. " +
    "Discussieer over werken bij de politie, sollicitaties, opleidingen en assessments. " +
    "Deel ervaringen en stel vragen aan duizenden actieve leden.",
  authors: [
    { name: "Politie Forum Nederland", url: "https://politie-forum.nl/" },
  ],
  creator: "Politie Forum Nederland",
  publisher: "Politie Forum Nederland",
  alternates: {
    canonical: "https://politie-forum.nl/",
    languages: {
      "nl-NL": "https://politie-forum.nl/",
      "x-default": "https://politie-forum.nl/",
    },
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://politie-forum.nl/",
    siteName: "Politie Forum Nederland",
    title:
      "Politie Forum Nederland | Discussies over Politie, Nieuws en Veiligheid",
    description:
      "Het grootste Nederlandse forum over politie, criminaliteit, veiligheid en justitie. " +
      "Discussieer mee over actueel politienieuws en blijf op de hoogte.",
    images: [
      {
        url: "/og/politie-forum-1200x630.png", // Relative to metadataBase
        secureUrl: "/og/politie-forum-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Politie Forum Nederland — Forum, nieuws & discussie",
        type: "image/png",
      },
    ],
    countryName: "Nederland",
    // ✅ T5: Freshness signal voor betere SERP ranking
    modifiedTime: new Date().toISOString(),
  },
  other: {
    // Note: og:updated_time should use property, not name (handled in metadata generation)
  },
  twitter: {
    card: "summary_large_image",
    site: "@politieforum",
    creator: "@politieforum",
    title: "Politie Forum Nederland | Discussies over Politie en Veiligheid",
    description:
      "Het grootste Nederlandse forum over politie, criminaliteit en veiligheid. " +
      "Discussieer mee en blijf op de hoogte van actueel nieuws.",
    images: {
      url: "https://politie-forum.nl/og/politie-forum-1200x630.png", // Absolute URL for Twitter
      alt: "Politie Forum Nederland — Forum, nieuws & discussie",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
  //   yandex: "YOUR_YANDEX_VERIFICATION_CODE",
  //   other: {
  //     "msvalidate.01": "YOUR_BING_VERIFICATION_CODE",
  //   },
  // },
  applicationName: "Politie Forum Nederland",
  referrer: "strict-origin-when-cross-origin",
  category: "Forum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl-NL">
      <head>
        {/* Critical CSS for instant LCP render */}
        <link rel="stylesheet" href="/styles/critical.css" />

        {/* DNS prefetch for external resources - micro-optimization */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />

        {/* Consent Mode v2 - Set defaults BEFORE loading GA */}
        <Script id="consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'functionality_storage': 'granted',
              'security_storage': 'granted'
            });
          `}
        </Script>

        {/* Google Analytics 4 (GA4) - defer to reduce main-thread work */}
        {/* Preconnect to critical origins */}
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.google-analytics.com"
          crossOrigin="anonymous"
        />
        {/* Load GA after page is interactive to minimize TBT */}
        <Script
          id="ga4-lib"
          src="https://www.googletagmanager.com/gtag/js?id=G-PYNT9RRWHB"
          strategy="lazyOnload"
        />

        {/* Icons & Manifest */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/police_badge_icon_32x32.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/police_badge_icon_192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/police_badge_icon_180x180.png"
        />
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* Theme & App Configuration */}
        <meta
          name="theme-color"
          content="#001f5c"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="theme-color"
          content="#f8fafc"
          media="(prefers-color-scheme: light)"
        />
        <meta name="color-scheme" content="dark light" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Politie Forum" />
        <meta name="msapplication-TileColor" content="#001f5c" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Feeds & Sitemap */}
        <link
          rel="sitemap"
          type="application/xml"
          href="/sitemap.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Politie Forum Nederland — RSS"
          href="/feed.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Politie Forum Nederland — Atom"
          href="/atom.xml"
        />

        {/* JSON-LD Schema: Each page (including homepage) generates its own consolidated graph.
            Layout.tsx no longer injects a separate graph to avoid duplication.
            Homepage uses consolidateKnowledgeGraphs() to merge layout + page-specific entities. */}

        {/* Dark mode by default - initialize before page render to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (!theme || theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  if (!theme) localStorage.setItem('theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Microdata removed - using JSON-LD only for cleaner, non-duplicate structured data */}
        <ServiceWorkerRegistration />
        <WebVitalsReporter />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <ConditionalAuthProvider>
          <main id="hoofdinhoud" role="main">
            {children}
          </main>
        </ConditionalAuthProvider>
      </body>
    </html>
  );
}
