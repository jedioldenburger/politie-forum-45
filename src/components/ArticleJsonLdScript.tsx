'use client';

import Script from 'next/script';

interface ArticleJsonLdScriptProps {
  jsonLd: Record<string, any>;
}

export default function ArticleJsonLdScript({ jsonLd }: ArticleJsonLdScriptProps) {
  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}
