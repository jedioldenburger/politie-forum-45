# 🧩 Schema.org Strategy & Roadmap
**Politie Forum Nederland - Semantisch Ecosysteem**

**Datum**: 14 oktober 2025
**Status**: Living Document
**Doel**: Maximale zichtbaarheid in Google Search, News, Discover + Knowledge Graph autoriteit

---

## 📋 **Huidige Implementatie (✅ Live)**

### **Core Infrastructure** (layout.tsx - Global)
```
✅ Organization (#org) - Politie Forum Nederland
✅ WebSite (#website) - Root site entity met SearchAction
✅ ImageObject (#logo) - Brand identity
✅ BreadcrumbList - Navigatie hiërarchie
✅ SiteNavigationElement - Hoofdmenu structuur
```

### **Content & Publishing** (Per pagina type)
```
✅ NewsArticle - Nieuws artikelen (/nieuws/[slug])
✅ DiscussionForumPosting - Forum threads (/nieuws/[slug] + comments)
✅ ItemList - Artikel overzichten (/forum, /nieuws)
✅ CollectionPage - Categorie overzichten (/forum, /categorieen)
✅ WebPage - Statische pagina's (/over, /contact, /privacy)
✅ FAQPage - Voorwaarden + FAQ secties (conditional)
```

### **Community & Interaction**
```
✅ Comment - Nested reacties (max 10 in JSON-LD)
✅ Person (#editor) - Redactie team entity
✅ InteractionCounter - CommentAction + ViewAction statistieken
⚠️ TODO: Person profiles voor leden
⚠️ TODO: ProgramMembership voor lidmaatschap
```

### **Location & Events** (Conditional detection)
```
✅ Place - Auto-detectie van 100+ NL steden
✅ GeoCoordinates - Lat/long voor locaties
✅ Event - Auto-detectie van events in artikelen
✅ HowTo - Auto-detectie van instructies
✅ Review - Auto-detectie van beoordelingen
```

---

## 🎯 **Implementatie Strategie per Laag**

## 1. **Content & Publicatie – Redactionele Autoriteit**

| Schema          | Status | Toepassing                          | Impact                                      | Priority |
|-----------------|--------|-------------------------------------|---------------------------------------------|----------|
| **NewsArticle** | ✅ Live | Nieuws items in `/nieuws/[slug]`    | Google News, Top Stories carrousel          | ⭐⭐⭐    |
| **BlogPosting** | 📋 Todo | Columns, opinies, interviews        | Rijke snippets met auteur + read time       | ⭐⭐     |
| **HowTo**       | ✅ Live | Auto-detect (conditional)           | Visuele step-by-step rich results           | ⭐⭐     |
| **ClaimReview** | 📋 Todo | Fact-check artikelen                | Fact Check label + Knowledge Graph          | ⭐       |

### **Implementatie Details**

#### **A. NewsArticle** (✅ Current)
```json
{
  "@type": "NewsArticle",
  "headline": "...",
  "datePublished": "2025-10-14T10:00:00+02:00",
  "dateModified": "2025-10-14T11:30:00+02:00",
  "author": { "@type": "Person", "name": "Redactie" },
  "publisher": { "@id": "https://politie-forum.nl/#org" },
  "image": { "@type": "ImageObject", "url": "...", "width": 1200, "height": 630 },
  "articleSection": "Binnenland",
  "keywords": ["politie", "nederland", ...],
  "mainEntityOfPage": { "@type": "WebPage", "@id": "..." }
}
```

**Locatie**: `src/components/ArticleJsonLd.tsx`
**Triggers**: Alle artikelen in `/nieuws/[slug]`

#### **B. BlogPosting** (📋 Roadmap)
```typescript
// src/lib/schemas/blogPostingSchema.ts
export function generateBlogPostingSchema(article: Article) {
  if (article.type !== 'opinion' && article.type !== 'interview') return null;

  return {
    "@type": "BlogPosting",
    "headline": article.title,
    "author": {
      "@type": "Person",
      "@id": `${baseUrl}/auteur/${article.authorId}`,
      "name": article.authorName,
      "jobTitle": article.authorRole,
      "image": article.authorPhoto
    },
    "wordCount": article.wordCount,
    "timeRequired": `PT${Math.ceil(article.wordCount / 200)}M`,
    "articleBody": article.content,
    "commentCount": article.commentCount
  };
}
```

**Triggers**: `article.type === 'opinion' || 'interview' || 'column'`
**Target**: Q1 2026

#### **C. ClaimReview** (📋 Roadmap)
```typescript
// Voor fact-checking artikelen
{
  "@type": "ClaimReview",
  "datePublished": "2025-10-14",
  "author": { "@id": "https://politie-forum.nl/#org" },
  "claimReviewed": "Statement being checked",
  "itemReviewed": {
    "@type": "CreativeWork",
    "datePublished": "2025-10-13",
    "author": { "@type": "Person", "name": "Original author" }
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": 1,
    "bestRating": 5,
    "worstRating": 1,
    "alternateName": "Onwaar"
  }
}
```

**Triggers**: `article.tags.includes('fact-check')`
**Target**: Q2 2026

---

## 2. **Interactie & Community – Sociaal Hart**

| Schema               | Status | Toepassing                      | Impact                                | Priority |
|----------------------|--------|---------------------------------|---------------------------------------|----------|
| **Person**           | ⚠️ Partial | Redactie (#editor), TODO: leden | Profielen indexeerbaar, auteurschap  | ⭐⭐⭐    |
| **Comment**          | ✅ Live | Nested reacties (max 10)        | Levendige discussies, engagement      | ⭐⭐⭐    |
| **ProgramMembership**| 📋 Todo | Lidmaatschapssysteem            | Community context voor Google         | ⭐⭐     |
| **OrganizationRole** | 📋 Todo | Moderators, redacteuren         | Authoritatieve relaties               | ⭐       |
| **Audience**         | 📋 Todo | Doelgroep definitie             | AI relevantie bepaling                | ⭐       |

### **Implementatie Details**

#### **A. Person Profiles** (⚠️ In Progress)
```typescript
// src/lib/schemas/personSchema.ts
export function generatePersonSchema(user: User) {
  return {
    "@type": "Person",
    "@id": `${baseUrl}/profiel/${user.id}`,
    "name": user.displayName,
    "image": user.photoURL,
    "url": `${baseUrl}/profiel/${user.id}`,
    "memberOf": {
      "@type": "ProgramMembership",
      "@id": `${baseUrl}/#membership-${user.membershipLevel}`,
      "programName": `${user.membershipLevel} Lid`,
      "hostingOrganization": { "@id": `${baseUrl}/#org` },
      "membershipNumber": user.memberNumber,
      "member": { "@id": `${baseUrl}/profiel/${user.id}` }
    },
    "interactionStatistic": [
      { "@type": "InteractionCounter", "interactionType": "CommentAction", "userInteractionCount": user.commentCount },
      { "@type": "InteractionCounter", "interactionType": "LikeAction", "userInteractionCount": user.upvotesReceived }
    ]
  };
}
```

**Locatie**: `/profiel/[userId]` page
**Target**: Q4 2025

#### **B. OrganizationRole** (📋 Roadmap)
```json
{
  "@type": "OrganizationRole",
  "@id": "https://politie-forum.nl/#role-moderator",
  "roleName": "Moderator",
  "memberOf": { "@id": "https://politie-forum.nl/#org" },
  "namedPosition": ["Community Moderator", "Discussie Moderator"]
}
```

**Koppeling**: `Person.hasOccupation → OrganizationRole`
**Target**: Q1 2026

---

## 3. **Navigatie & Structuur – Informatiearchitectuur**

| Schema                | Status | Toepassing                       | Impact                          | Priority |
|-----------------------|--------|----------------------------------|---------------------------------|----------|
| **CollectionPage**    | ✅ Live | `/forum`, `/categorieen`         | Categorie indexering            | ⭐⭐⭐    |
| **BreadcrumbList**    | ✅ Live | Alle pagina's                    | Hiërarchie in search results    | ⭐⭐⭐    |
| **SearchResultsPage** | 📋 Todo | `/zoeken`                        | Crawling optimalisatie          | ⭐⭐     |
| **SitelinksSearchBox**| ✅ Live | In WebSite (SearchAction)        | Zoekveld in Google results      | ⭐⭐⭐    |
| **SiteNavigationElement** | ✅ Live | Hoofdmenu                   | Navigatie context               | ⭐⭐     |

### **Implementatie Details**

#### **A. SearchResultsPage** (📋 Roadmap)
```typescript
// src/app/zoeken/page.tsx
export const metadata: Metadata = {
  title: 'Zoekresultaten',
  robots: { index: false, follow: true } // No-index search pages
};

export default function SearchPage({ searchParams }) {
  const schema = {
    "@type": "SearchResultsPage",
    "@id": `${baseUrl}/zoeken#webpage`,
    "url": `${baseUrl}/zoeken?q=${searchParams.q}`,
    "name": `Zoekresultaten voor "${searchParams.q}"`,
    "isPartOf": { "@id": `${baseUrl}/#website` },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": results.length,
      "itemListElement": results.map((r, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": r.url,
        "name": r.title
      }))
    }
  };
}
```

**Target**: Q4 2025

---

## 4. **Technisch & Contextueel – Infrastructuurlaag**

| Schema                    | Status | Toepassing                      | Impact                          | Priority |
|---------------------------|--------|---------------------------------|---------------------------------|----------|
| **WebApplication**        | 📋 Todo | PWA manifest linking            | App indexing, PWA discovery     | ⭐⭐     |
| **SoftwareApplication**   | 📋 Todo | Mobile app (toekomst)           | Google Play visibility          | ⭐       |
| **WebPageElement**        | 📋 Todo | Sidebar, breaking news ticker   | Analytische context             | ⭐       |
| **SpeakableSpecification**| 📋 Todo | Voice assistant content         | Alexa/Google Assistant support  | ⭐       |

### **Implementatie Details**

#### **A. WebApplication** (📋 Roadmap)
```json
{
  "@type": "WebApplication",
  "@id": "https://politie-forum.nl/#webapp",
  "name": "Politie Forum Nederland",
  "url": "https://politie-forum.nl/",
  "applicationCategory": "SocialNetworkingApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript and HTML5 support",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "featureList": [
    "Real-time discussions",
    "News aggregation",
    "Comment system",
    "Crime map"
  ]
}
```

**Locatie**: `manifest.webmanifest` + schema in layout.tsx
**Target**: Q1 2026

#### **B. SpeakableSpecification** (📋 Roadmap)
```typescript
// Voor nieuws artikelen
{
  "@type": "NewsArticle",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".article-headline", ".article-summary"],
    "xpath": ["/html/body/article/h1", "/html/body/article/p[1]"]
  }
}
```

**Target**: Q2 2026

---

## 5. **Beoordeling & Betrouwbaarheid – Vertrouwen**

| Schema             | Status | Toepassing                      | Impact                      | Priority |
|--------------------|--------|---------------------------------|-----------------------------|----------|
| **Review**         | ✅ Live | Auto-detect in comments         | User feedback visibility    | ⭐⭐     |
| **AggregateRating**| ✅ Live | Organization level              | Trust signals               | ⭐⭐⭐    |
| **ClaimReview**    | 📋 Todo | Fact-checking artikelen         | Fact-check label            | ⭐⭐     |

### **Current Implementation**
```json
// In layout.tsx Organization
{
  "@type": "Organization",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.7,
    "reviewCount": 1250,
    "bestRating": 5,
    "worstRating": 1
  }
}
```

---

## 6. **Veiligheid & Transparantie – Juridisch**

| Schema                   | Status | Toepassing           | Impact                | Priority |
|--------------------------|--------|----------------------|-----------------------|----------|
| **Policy**               | 📋 Todo | `/privacy`           | Privacy compliance    | ⭐⭐     |
| **TermsOfService**       | 📋 Todo | `/voorwaarden`       | Legal clarity         | ⭐⭐     |
| **Complaint**            | 📋 Todo | `/melden`            | Reporting mechanism   | ⭐       |
| **GovernmentOrganization**| 📋 Todo | Partnerships     | Authority signals     | ⭐       |

### **Implementatie Details**

#### **A. Policy Schema** (📋 Roadmap)
```typescript
// src/app/privacy/page.tsx
{
  "@type": "WebPage",
  "@id": "https://politie-forum.nl/privacy#webpage",
  "name": "Privacybeleid",
  "about": {
    "@type": "DigitalDocument",
    "name": "Privacy Policy",
    "url": "https://politie-forum.nl/privacy",
    "datePublished": "2025-01-01",
    "dateModified": "2025-10-14",
    "author": { "@id": "https://politie-forum.nl/#org" }
  }
}
```

**Target**: Q4 2025

---

## 7. **Zoek & Sitelinks-integratie (Enhanced)**

### **Current Implementation** (✅ Live)
```json
{
  "@type": "WebSite",
  "@id": "https://politie-forum.nl/#website",
  "url": "https://politie-forum.nl/",
  "name": "Politie Forum Nederland",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://politie-forum.nl/zoeken?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### **Enhanced Version** (📋 Roadmap - JSON-LD 1.1 + Legacy)
```json
{
  "potentialAction": [
    {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://politie-forum.nl/zoeken?q={search_term_string}",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "query-input": "required name=search_term_string"
    },
    {
      "@type": "SearchAction",
      "target": "https://politie-forum.nl/zoeken?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  ]
}
```

**Target**: Q4 2025

---

## 8. **Kennisnetwerk-relaties (Entity Graph)**

### **Current Architecture**
```
Organization (#org)
    ├── parentOrganization → DigestPaper (#org)
    ├── publisher of → WebSite (#website)
    ├── author/editor → Person (#editor)
    └── aggregateRating → AggregateRating

WebSite (#website)
    ├── isPartOf → Organization (#org)
    ├── mainEntity → WebPage (per pagina)
    └── potentialAction → SearchAction

WebPage (#webpage per route)
    ├── isPartOf → WebSite (#website)
    ├── breadcrumb → BreadcrumbList
    ├── mainEntity → ItemList / NewsArticle / DiscussionForumPosting
    └── about → Thing[]

DiscussionForumPosting
    ├── author → Person
    ├── publisher → Organization (#org)
    ├── comment[] → Comment (max 10)
    └── interactionStatistic → InteractionCounter[]

Comment
    ├── author → Person
    ├── upvoteCount → Integer
    └── parentItem → Comment (nested)
```

### **Target Architecture** (📋 Q1 2026)
```
Organization (#org)
    ├── member[] → Person (leden)
    ├── employee[] → Person (moderators/redactie)
    └── offers → ProgramMembership (gratis/premium)

Person (lid/moderator)
    ├── memberOf → ProgramMembership
    ├── hasOccupation → OrganizationRole (voor moderators)
    ├── author of → DiscussionForumPosting / Comment
    └── interactionStatistic → UserInteractionCount

ProgramMembership
    ├── programName → "Gratis Lid" / "Premium Lid"
    ├── hostingOrganization → Organization (#org)
    └── member → Person
```

---

## 🧠 **Strategisch Advies & Best Practices**

### **1. Modulaire Implementatie**
```
✅ Phase 1 (DONE): Core (Organization, WebSite, WebPage, NewsArticle)
✅ Phase 2 (DONE): Forum (DiscussionForumPosting, Comment, ItemList)
✅ Phase 3 (DONE): Conditional (Place, Event, HowTo, Review, FAQPage)
📋 Phase 4 (Q4 2025): Community (Person profiles, ProgramMembership)
📋 Phase 5 (Q1 2026): Advanced (BlogPosting, ClaimReview, SearchResultsPage)
📋 Phase 6 (Q2 2026): Technical (WebApplication, SpeakableSpecification)
```

### **2. Vaste ID-patronen**
```typescript
// src/lib/schemaIds.ts
export const SCHEMA_IDS = {
  org: 'https://politie-forum.nl/#org',
  website: 'https://politie-forum.nl/#website',
  logo: 'https://politie-forum.nl/#logo',
  editor: 'https://politie-forum.nl/#editor',

  // Dynamic IDs
  person: (userId: string) => `https://politie-forum.nl/profiel/${userId}`,
  article: (slug: string) => `https://politie-forum.nl/nieuws/${slug}`,
  comment: (articleSlug: string, commentId: string) =>
    `https://politie-forum.nl/nieuws/${articleSlug}#comment-${commentId}`,
};
```

### **3. Validatie Pipeline**
```bash
# CI/CD integration
npm run schema:validate  # Local validation
npm run schema:test      # Google Rich Results Test API
npm run schema:report    # Generate coverage report
```

**Tools**:
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
- Structured Data Testing Tool (legacy): https://search.google.com/structured-data/testing-tool

### **4. Impact Meting**
```
Google Search Console:
  → Verbeteringen → Gestructureerde gegevens
  → Performance → Rich results

Google Analytics:
  → Acquisition → Organic Search
  → Engagement → Landing pages met rich results

Custom Events:
  → Rich result impressions
  → Rich result clicks
  → CTR comparison (with vs without rich results)
```

### **5. Toekomstige Uitbreidingen**

#### **A. Dataset Schema** (Voor Crime Map)
```json
{
  "@type": "Dataset",
  "name": "Nederland Criminaliteitsdata 2025",
  "description": "Real-time misdaadstatistieken per regio",
  "url": "https://politie-forum.nl/crime-map-nederland",
  "temporalCoverage": "2025-01-01/..",
  "spatialCoverage": {
    "@type": "Place",
    "geo": {
      "@type": "GeoShape",
      "box": "50.75 3.2 53.7 7.2"
    }
  },
  "distribution": {
    "@type": "DataDownload",
    "encodingFormat": "application/json",
    "contentUrl": "https://politie-forum.nl/api/crimes"
  }
}
```

**Target**: Q2 2026

#### **B. DataFeed Schema** (Voor RSS)
```json
{
  "@type": "DataFeed",
  "dataFeedElement": [
    {
      "@type": "NewsArticle",
      "url": "...",
      "headline": "...",
      "datePublished": "..."
    }
  ]
}
```

**Target**: Q1 2026

---

## 📊 **Implementation Tracking**

### **Current Coverage (October 2025)**
```
✅ Core Infrastructure:     100% (5/5 schemas)
✅ Content & Publishing:     60% (3/5 schemas)
✅ Community & Interaction:  40% (2/5 schemas)
✅ Navigation & Structure:   80% (4/5 schemas)
⚠️ Technical & Contextual:   0% (0/4 schemas)
✅ Trust & Reviews:          66% (2/3 schemas)
⚠️ Legal & Transparency:     0% (0/4 schemas)

Overall Coverage: 58% (16/28 planned schemas)
```

### **Target Coverage (Q2 2026)**
```
Target: 85% (24/28 schemas)
Missing: Advanced technical schemas (WebApplication, SpeakableSpec, etc.)
Reason: Low priority, specialized use cases
```

---

## 🎯 **Priority Matrix**

| Priority | Schemas | Target | Business Impact |
|----------|---------|--------|-----------------|
| ⭐⭐⭐ (Critical) | NewsArticle, DiscussionForumPosting, Organization, WebSite | ✅ Live | Core visibility |
| ⭐⭐ (High) | Person, BlogPosting, SearchResultsPage, WebApplication | Q4 2025 - Q1 2026 | Community growth |
| ⭐ (Medium) | ClaimReview, Policy, OrganizationRole, Dataset | Q2 2026 | Authority building |
| 💡 (Nice-to-have) | SpeakableSpec, WebPageElement, SoftwareApplication | Future | Advanced features |

---

## 🔗 **Resources**

- **Schema.org Docs**: https://schema.org/
- **Google Search Central**: https://developers.google.com/search/docs/appearance/structured-data
- **JSON-LD Playground**: https://json-ld.org/playground/
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema Validator**: https://validator.schema.org/

---

**Status**: ✅ Living Document
**Last Updated**: 14 oktober 2025
**Next Review**: Q4 2025 (Phase 4 kickoff)
**Owner**: SEO/Technical Team

