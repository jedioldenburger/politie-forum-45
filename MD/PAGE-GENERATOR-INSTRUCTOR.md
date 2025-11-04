# Page Generator Instructions - Politie Forum Nederland
**Date**: October 15, 2025
**Project**: politie-forum.nl
**Framework**: Next.js 15.5.4 with App Router

---

## 📋 Missing Pages Overview

### Current Status
**✅ Existing Pages (23)**: /, /nieuws, /forum, /categorieen, /crime-map-nederland, /redactie, /contact (stub), /leden, /profiel, /login, /register, /admin, /privacy, /voorwaarden, /disclaimer, /nieuws-disclaimer, /over, /faq, /zoeken, /topic/[id], /artikel/[slug], /playground, /playground/export

**❌ Missing Pages (25)**:
1. `/cookies` - Cookie Policy
2. `/forum-disclaimer` - Forum Disclaimer
3. `/gebruikersregels` - User Rules/Community Guidelines
4. `/moderatie-beleid` - Moderation Policy
5. `/toegankelijkheid` - Accessibility Statement
6. `/redactionele-principes` - Editorial Principles
7. `/feitencontrole` - Fact-checking
8. `/correcties` - Corrections
9. `/eigendom` - Ownership/Copyright
10. `/tips` - News Tips Submission
11. `/pers` - Press Contact
12. `/categorie/[slug]` - Category Pages (10 total)
13. `/tag/[slug]` - Tag Pages (15 total)

---

## 🏗️ Architecture Pattern

### Server/Client Split Pattern
**Used by**: All existing pages (disclaimer, nieuws-disclaimer)

```
src/app/[page]/
├── page.tsx              # Server Component (Metadata, SEO)
└── [PageName]Client.tsx  # Client Component (Interactive UI)
```

**Why?**
- ✅ Server Component: SEO metadata, JSON-LD, canonical URLs
- ✅ Client Component: Dark mode, AuthModal, useState, user interactions
- ✅ Best of both: Static generation + client-side interactivity

---

## 📐 Page Templates

### Template 1: Legal/Policy Pages
**Used for**: cookies, forum-disclaimer, gebruikersregels, moderatie-beleid, toegankelijkheid

**Files**:
```
src/app/[page-name]/
├── page.tsx                    # Server component
└── [PageName]Client.tsx        # Client component
```

**page.tsx Structure**:
```typescript
import type { Metadata } from 'next';
import { PageNameClient } from './PageNameClient';

export const metadata: Metadata = {
  title: 'Page Title | Politie Forum Nederland',
  description: 'Meta description (145-155 characters)',
  alternates: {
    canonical: 'https://politie-forum.nl/page-url',
  },
  openGraph: {
    title: 'Page Title | Politie Forum Nederland',
    description: 'Meta description',
    url: 'https://politie-forum.nl/page-url',
    siteName: 'Politie Forum Nederland',
    locale: 'nl_NL',
    type: 'website',
  },
  icons: [
    { url: '/police_badge_icon_16x16.png', sizes: '16x16', type: 'image/png' },
    { url: '/police_badge_icon_32x32.png', sizes: '32x32', type: 'image/png' },
    { url: '/police_badge_icon_512x512.png', sizes: '512x512', type: 'image/png' },
  ],
};

export default function PageName() {
  return <PageNameClient />;
}
```

**Client Component Structure**:
```typescript
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

export function PageNameClient() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': 'https://politie-forum.nl/page-url#webpage',
            url: 'https://politie-forum.nl/page-url',
            name: 'Page Title',
            description: 'Page description',
            isPartOf: {
              '@id': 'https://politie-forum.nl/#website',
            },
            breadcrumb: {
              '@id': 'https://politie-forum.nl/page-url#breadcrumb',
            },
            inLanguage: 'nl-NL',
            datePublished: '2025-10-15T00:00:00+00:00',
            dateModified: '2025-10-15T00:00:00+00:00',
            publisher: {
              '@id': 'https://politie-forum.nl/#org',
            },
          }),
        }}
      />

      <Header onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <li><a href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</a></li>
              <li><span className="mx-2">/</span></li>
              <li className="text-gray-900 dark:text-gray-100">Page Name</li>
            </ol>
          </nav>

          {/* Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1>Page Title</h1>

            {/* Content sections with H2/H3 hierarchy */}
            <section>
              <h2>Section 1</h2>
              <p>Introductory paragraph...</p>

              <h3>Subsection 1.1</h3>
              <p>Details...</p>

              {/* Info boxes for important notices */}
              <div className="my-6 p-4 bg-accent-50 dark:bg-accent-900/20 border-l-4 border-accent-500 rounded-r">
                <p className="font-semibold text-accent-900 dark:text-accent-100">
                  Important Notice
                </p>
                <p className="mt-2 text-accent-800 dark:text-accent-200">
                  Details...
                </p>
              </div>
            </section>

            {/* More sections... */}
          </article>
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
```

**Content Requirements**:
- ✅ 1000-1200 words minimum
- ✅ 7 H2 sections with introductory context
- ✅ 9+ H3 subsections for depth
- ✅ 4 styled info boxes (warnings/tips/notes)
- ✅ Internal links to related pages
- ✅ Contact information where relevant

---

### Template 2: Journalistic Pages
**Used for**: redactionele-principes, feitencontrole, correcties

**Same structure as Template 1, but with**:
- ✅ Author bylines (Politie Forum Redactie)
- ✅ Date stamps for updates
- ✅ Citation guidelines
- ✅ Contact forms/email links
- ✅ Examples of past corrections (for /correcties)

**Special Features**:
- `/correcties`: Include date-stamped correction entries (H3 per correction)
- `/feitencontrole`: Methodology explanation + fact-check examples
- `/redactionele-principes`: Mission statement, editorial standards, transparency

---

### Template 3: Contact/Submission Pages
**Used for**: tips, pers

**Additional Features**:
- ✅ Contact forms (client-side)
- ✅ Email addresses: info@politie-forum.nl, redactie@politie-forum.nl, tips@politie-forum.nl
- ✅ WhatsApp tip line: +31 6 48319167
- ✅ Response time expectations
- ✅ Privacy notice (link to /privacy)

**Form Structure**:
```typescript
<form onSubmit={handleSubmit} className="space-y-6">
  <div>
    <label htmlFor="name" className="block text-sm font-medium">Naam</label>
    <input
      type="text"
      id="name"
      name="name"
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      required
    />
  </div>
  {/* More fields... */}
  <button type="submit" className="btn btn-primary">Versturen</button>
</form>
```

---

### Template 4: Dynamic Collection Pages
**Used for**: categorie/[slug], tag/[slug]

**File Structure**:
```
src/app/categorie/[slug]/
├── page.tsx              # Dynamic route with generateStaticParams
└── CategoryClient.tsx    # Client component with topic list

src/app/tag/[slug]/
├── page.tsx              # Dynamic route with generateStaticParams
└── TagClient.tsx         # Client component with article list
```

**generateStaticParams Example**:
```typescript
export async function generateStaticParams() {
  const categories = [
    'advocaten-rechtbanken',
    'burgerparticipatie-wijkveiligheid',
    'community-cafe-off-topic',
    'criminaliteit-opsporing',
    'cybersecurity-digitale-veiligheid',
    'internationale-politie-europol',
    'publieke-veiligheid-maatschappij',
    'rechtspraak-beleid',
    'specialisaties-eenheden',
    'technologie-middelen',
  ];

  return categories.map((slug) => ({ slug }));
}
```

**Dynamic Metadata**:
```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const categoryName = getCategoryName(params.slug);

  return {
    title: `${categoryName} | Politie Forum Nederland`,
    description: `Discussies over ${categoryName.toLowerCase()}. Deel kennis, stel vragen en praat mee over dit onderwerp.`,
    alternates: {
      canonical: `https://politie-forum.nl/categorie/${params.slug}`,
    },
  };
}
```

---

## 🎨 Content Guidelines

### Word Count Targets
- Legal/Policy: 1000-1200 words
- Journalistic: 800-1000 words
- Contact: 500-700 words
- Category/Tag: 300-500 words + dynamic content

### Heading Structure
```
H1: Page Title (once, at top)
├── H2: Main Section 1
│   ├── H3: Subsection 1.1
│   └── H3: Subsection 1.2
├── H2: Main Section 2
│   ├── H3: Subsection 2.1
│   ├── H3: Subsection 2.2
│   └── H3: Subsection 2.3
└── H2: Contact/Call-to-Action
```

### Info Box Types
```tsx
{/* Warning (Red) */}
<div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r">
  <p className="font-semibold text-red-900 dark:text-red-100">⚠️ Waarschuwing</p>
  <p className="mt-2 text-red-800 dark:text-red-200">Details...</p>
</div>

{/* Tip (Blue) */}
<div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
  <p className="font-semibold text-primary-900 dark:text-primary-100">💡 Tip</p>
  <p className="mt-2 text-primary-800 dark:text-primary-200">Details...</p>
</div>

{/* Note (Gray) */}
<div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 rounded-r">
  <p className="font-semibold text-gray-900 dark:text-gray-100">📝 Notitie</p>
  <p className="mt-2 text-gray-800 dark:text-gray-200">Details...</p>
</div>

{/* Citation (Accent) */}
<div className="my-6 p-4 bg-accent-50 dark:bg-accent-900/20 border-l-4 border-accent-500 rounded-r">
  <p className="font-semibold text-accent-900 dark:text-accent-100">📚 Citeren</p>
  <p className="mt-2 text-accent-800 dark:text-accent-200">Details...</p>
</div>
```

---

## 🔍 SEO Checklist

### Per Page
- ✅ Title format: "Page Title | Politie Forum Nederland" (no repetition)
- ✅ Meta description: 145-155 characters
- ✅ Canonical URL: https://politie-forum.nl/page-url
- ✅ Favicon sizes: 16x16, 32x32, 512x512
- ✅ OpenGraph tags: title, description, url, siteName, locale, type
- ✅ JSON-LD WebPage schema with breadcrumbs
- ✅ Heading hierarchy (H1 → H2 → H3)
- ✅ Internal linking (3-5 related pages)
- ✅ Alt text for images (if any)

### JSON-LD Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://politie-forum.nl/page-url#webpage",
  "url": "https://politie-forum.nl/page-url",
  "name": "Page Title",
  "description": "Page description",
  "isPartOf": { "@id": "https://politie-forum.nl/#website" },
  "breadcrumb": { "@id": "https://politie-forum.nl/page-url#breadcrumb" },
  "inLanguage": "nl-NL",
  "datePublished": "2025-10-15T00:00:00+00:00",
  "dateModified": "2025-10-15T00:00:00+00:00",
  "publisher": { "@id": "https://politie-forum.nl/#org" }
}
```

---

## 📦 Generation Priority

### Phase 1: Legal/Policy (High Priority)
1. `/cookies` - Cookie Policy (GDPR compliance)
2. `/forum-disclaimer` - Forum Disclaimer (user-generated content)
3. `/gebruikersregels` - User Rules (community guidelines)
4. `/moderatie-beleid` - Moderation Policy (transparency)
5. `/toegankelijkheid` - Accessibility Statement (WCAG compliance)

### Phase 2: Journalistic (Medium Priority)
6. `/redactionele-principes` - Editorial Principles (E-E-A-T)
7. `/feitencontrole` - Fact-checking (credibility)
8. `/correcties` - Corrections (transparency)

### Phase 3: Company/Contact (Medium Priority)
9. `/eigendom` - Ownership/Copyright
10. `/tips` - News Tips (engagement)
11. `/pers` - Press Contact (media relations)

### Phase 4: Dynamic Pages (Low Priority - Template Setup)
12. `/categorie/[slug]` - Category Pages (10 routes)
13. `/tag/[slug]` - Tag Pages (15 routes)

---

## 🚀 Build & Deploy

### After Creating Pages
```bash
# Build
npm run build

# Check for errors
npm run lint

# Deploy
vercel --prod

# Regenerate sitemap
# Run Python script option 20
```

### Testing Checklist
- ✅ Page loads without errors
- ✅ Dark mode toggle works
- ✅ Login button opens AuthModal
- ✅ Breadcrumb navigation functional
- ✅ Internal links work
- ✅ Mobile responsive
- ✅ JSON-LD validates (Google Rich Results Test)

---

## 📚 Reference Files

**Existing Examples**:
- `src/app/disclaimer/page.tsx` + `DisclaimerClient.tsx` (1050+ words, 9 H3 subsections)
- `src/app/nieuws-disclaimer/page.tsx` + `NieuwsDisclaimerClient.tsx` (1200+ words)

**Components**:
- `src/components/Header.tsx` - Header with dark mode, notifications
- `src/components/Footer.tsx` - 4-column footer
- `src/components/AuthModal.tsx` - Login/register modal

**Styling**:
- Tailwind CSS with custom colors (primary-600, accent-500)
- Dark mode: `dark:` prefix classes
- Prose plugin: `prose prose-lg dark:prose-invert`

---

## ✅ Success Criteria

Per page completion:
- ✅ File structure matches template
- ✅ Server/Client split implemented
- ✅ Metadata complete with all SEO fields
- ✅ JSON-LD schema present and valid
- ✅ Content meets word count (1000+ for legal)
- ✅ Heading hierarchy logical (H1 → H2 → H3)
- ✅ 4+ info boxes for important notices
- ✅ Internal links to 3-5 related pages
- ✅ Dark mode styling functional
- ✅ AuthModal integration works
- ✅ Build succeeds with 0 errors
- ✅ Page added to sitemap.xml

---

**Status**: Ready for implementation
**Next**: Start with Phase 1 (Legal/Policy pages)
**Priority**: `/cookies`, `/forum-disclaimer`, `/gebruikersregels`
