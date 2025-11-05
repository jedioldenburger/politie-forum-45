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
    "Het grootste Nederlandse veiligheidsforum voor politie discussie. " +
    "Forum voor politie professionals, aspiranten en criminologie studenten: discussieer over sollicitaties, assessments, forensisch onderzoek en opleidingen. " +
    "Sluit je aan bij onze community van 10.000+ actieve leden — waar Nederland over justitie en veiligheid praat.",
  authors: [
    { name: "Politie Forum Nederland", url: "https://politie-forum.nl/" },
  ],
  creator: "Politie Forum Nederland",
  publisher: "Politie Forum Nederland",
  alternates: {
    canonical: "https://politie-forum.nl/",
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
    // Note: 'keywords' meta is obsolete per Google guidelines (removed for compliance)
    "topic": "Veiligheidsforum, Justitienieuws, Criminele Analyse, Forensisch Onderzoek, Politieopleiding",
    "abstract": "Politie Forum Nederland is het grootste online veiligheidsforum waar professionals en geïnteresseerden discussiëren over criminaliteit, justitie, politieopleidingen en forensische opsporing",
    // Geo-targeting meta tags for Netherlands (SEO optimization)
    "geo.region": "NL",
    "geo.placename": "Amsterdam",
    "geo.position": "52.3676;4.9041",
    "ICBM": "52.3676, 4.9041",

    // IndexNow API key for instant Bing indexing
    "indexnow-verify": "politie-forum-nl-indexnow-2025",
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
        {/* Hreflang for Dutch content (SEO Audit: simplified single-locale) */}
        <link rel="alternate" hrefLang="nl" href="https://politie-forum.nl/" />
        <link rel="alternate" hrefLang="x-default" href="https://politie-forum.nl/" />

        {/* RSS/Atom Feed Autodiscovery (canonical, no duplicates) */}
        <link rel="alternate" type="application/rss+xml" title="Politie Forum Nederland - RSS Feed" href="/feed.xml" />
        <link rel="alternate" type="application/atom+xml" title="Politie Forum Nederland - Atom Feed" href="/atom.xml" />

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

        {/* Google Analytics 4 (GA4) - Only preconnect to most critical origin (110ms LCP savings) */}
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        {/* Load GA after page is interactive to minimize TBT */}
        <Script
          id="ga4-lib"
          src="https://www.googletagmanager.com/gtag/js?id=G-PYNT9RRWHB"
          strategy="lazyOnload"
        />

        {/* OpenSearch for browser search integration */}
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="Politie Forum Nederland"
          href="/opensearch.xml"
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

        {/* iOS Splash Screens - PWA Support (using modern media features) */}
        <link
          rel="apple-touch-startup-image"
          href="/splash/iphone-se.png"
          media="(viewport-width: 320px) and (viewport-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/iphone-8.png"
          media="(viewport-width: 375px) and (viewport-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/iphone-11.png"
          media="(viewport-width: 414px) and (viewport-height: 896px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/iphone-14.png"
          media="(viewport-width: 430px) and (viewport-height: 932px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/ipad-9.7.png"
          media="(viewport-width: 768px) and (viewport-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/ipad-pro-11.png"
          media="(viewport-width: 834px) and (viewport-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/ipad-pro-12.9.png"
          media="(viewport-width: 1024px) and (viewport-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        />

        {/* Sitemap (already linked via robots.txt, single reference) */}
        <link
          rel="sitemap"
          type="application/xml"
          href="/sitemap.xml"
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
        {/* Skip link for accessibility (SEO Audit fix) */}
        <a 
          href="#hoofdinhoud" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:shadow-lg"
        >
          Ga naar hoofdinhoud
        </a>
        {/* Microdata removed - using JSON-LD only for cleaner, non-duplicate structured data */}
        <ServiceWorkerRegistration />
        <WebVitalsReporter />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <ConditionalAuthProvider>
          <main id="hoofdinhoud">
            {children}
          </main>
        </ConditionalAuthProvider>
      </body>
    </html>
  );
}
