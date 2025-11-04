/**
 * Complete Knowledge Graph Generator for Politie Forum Nederland
 *
 * Generates a comprehensive JSON-LD @graph with all semantic entities:
 * - Organization, WebSite, WebPage, Forum
 * - Person (editors, members), ProgramMembership
 * - DiscussionForumPosting, Comment, Review
 * - FAQPage, HowTo, Event, ClaimReview
 * - All interconnected with proper @id references
 *
 * @version 2.0
 * @date October 14, 2025
 */

const BASE_URL = "https://politie-forum.nl";

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Convert date to ISO-8601 string (handles epoch milliseconds, Date objects, and strings)
 */
function toISO8601(date: string | number | Date | undefined): string | undefined {
  if (!date) return undefined;

  try {
    // If it's already a valid ISO string, return it
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return date;
    }

    // Convert epoch milliseconds or Date object to ISO string
    const dateObj = typeof date === 'number' || typeof date === 'string'
      ? new Date(date)
      : date;

    return dateObj.toISOString();
  } catch (e) {
    console.error('Invalid date:', date, e);
    return undefined;
  }
}

// ===========================
// TYPE DEFINITIONS
// ===========================

export interface Article {
  slug: string;
  title: string;
  content?: string;
  excerpt?: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags?: string[];
  commentCount?: number;
  viewCount?: number;
  location?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  topicCount?: number;
}

export interface FAQItem {
  question: string;
  answer: string; // Answer text for FAQ schema (use shortAnswer for optimal rich results)
  url?: string; // Contextual link for direct FAQ access
  slug?: string; // Auto-generate from question
}

export interface Member {
  id: string;
  name: string;
  role?: string;
  joinedAt?: string;
  avatarUrl?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  eventType?: string;
  attendanceMode?: 'offline' | 'online' | 'mixed';
  organizer?: string;
}

export interface Comment {
  id?: string;
  text: string;
  author: string;
  authorName?: string;
  dateCreated: string;
  parentId?: string;
}

export interface Review {
  id: string;
  rating: number;
  reviewBody: string;
  author: string;
  authorName?: string;
  datePublished: string;
  itemReviewed?: string;
}

export interface WebPageElement {
  id: string;
  name: string;
  description?: string;
  cssSelector?: string;
  about?: string;
}

export interface AggregateRating {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export interface VideoObject {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
}

export interface LiveBlogPosting {
  headline: string;
  description: string;
  coverageStartTime: string;
  coverageEndTime?: string;
  liveBlogUpdate?: Array<{
    headline: string;
    articleBody: string;
    datePublished: string;
  }>;
}

export interface QAPage {
  question: string;
  answer: string;
  author?: string;
  datePublished?: string;
  upvoteCount?: number;
}

export interface DataCatalog {
  name: string;
  description: string;
  url: string;
  dataset?: Array<{
    name: string;
    description: string;
    distribution?: string;
  }>;
}

export interface CreativeWorkSeries {
  name: string;
  description: string;
  url: string;
  hasPart?: string[];
}

export interface SocialMediaPosting {
  headline: string;
  articleBody: string;
  datePublished: string;
  author: string;
  url: string;
}

// ===========================
// CORE ENTITIES
// ===========================

/**
 * ImageObject for logo (reusable)
 */
function getLogoEntity() {
  return {
    "@type": "ImageObject",
    "@id": `${BASE_URL}/#logo`,
    "url": `${BASE_URL}/logo.svg`,
    "contentUrl": `${BASE_URL}/logo.svg`,
    "width": 512,
    "height": 512,
    "caption": "Politie Forum Nederland Logo",
    "encodingFormat": "image/svg+xml",
  };
}

/**
 * Organization entity (primary identity)
 */
function getOrganizationEntity() {
  return {
    "@type": "NewsMediaOrganization",
    "@id": `${BASE_URL}/#org`,
    "name": "Politie Forum Nederland",
    "legalName": "Politie Forum Nederland",
    "alternateName": ["Politie Forum", "Het Politie Forum", "Politie Forum NL", "Politie-Forum.nl"],
    "url": `${BASE_URL}/`,
    "logo": { "@id": `${BASE_URL}/#logo` },
    "image": { "@id": `${BASE_URL}/#logo` },
    "email": "info@politie-forum.nl",
    "telephone": "+31648319167",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sint Olofssteeg 4",
      "postalCode": "1012AK",
      "addressLocality": "Amsterdam",
      "addressRegion": "Noord-Holland",
      "addressCountry": "NL",
    },
    "foundingDate": "2020-01-01",
    "masthead": `${BASE_URL}/redactie/`,
    "publishingPrinciples": `${BASE_URL}/redactionele-principes/`,
    "ethicsPolicy": `${BASE_URL}/redactionele-principes/`,
    "correctionsPolicy": `${BASE_URL}/correcties/`,
    "verificationFactCheckingPolicy": `${BASE_URL}/feitencontrole/`,
    "ownershipFundingInfo": `${BASE_URL}/over/`,
    "parentOrganization": {
      "@type": "Organization",
      "@id": "https://digestpaper.com/#org",
      "name": "DigestPaper",
      "url": "https://digestpaper.com/",
    },
    "foundingLocation": {
      "@type": "Place",
      "name": "Amsterdam",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Amsterdam",
        "addressCountry": "NL",
      },
    },
    "areaServed": [
      { "@type": "Country", "name": "Nederland" },
      { "@type": "Country", "name": "België" },
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "DigestPaper Publisher Network",
      "url": "https://digestpaper.com",
    },
    "knowsAbout": [
      "Nederlandse Politie",
      "Criminaliteitsanalyse",
      "Veiligheidszaken",
      "Justitie en Rechtspraak",
      "Politie Organisatie",
      "Misdaadpreventie",
      "Politie Opleidingen",
      "Politie Sollicitatie",
    ],
    "sameAs": [
      "https://x.com/politieforum",
      "https://facebook.com/politieforum",
      "https://instagram.com/politieforum",
      "https://linkedin.com/company/politie-forum",
      "https://www.youtube.com/@politieforum",
      "https://www.threads.net/@politieforum",
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "telephone": "+31648319167",
        "email": "info@politie-forum.nl",
        "url": `${BASE_URL}/contact`,
        "availableLanguage": ["nl"],
        "areaServed": "NL",
      },
      {
        "@type": "ContactPoint",
        "contactType": "Tip Line",
        "telephone": "+31648319167",
        "email": "tip@politie-forum.nl",
        "url": `${BASE_URL}/tip`,
        "availableLanguage": ["nl"],
        "areaServed": "NL",
        "description": "Anonieme tip lijn voor politie-gerelateerde informatie",
      },
    ],
    // Founder adjusted: use an Organizational founder entity instead of referencing editorial Person directly
    "founder": {
      "@type": "Organization",
      "@id": `${BASE_URL}/#founder-redactie`,
      "name": "Redactie Politie Forum Nederland",
      "url": `${BASE_URL}/over`,
      "description": "Redactioneel team verantwoordelijk voor content curatie, kwaliteitsbewaking en fact-checking rondom politie, veiligheid en justitie.",
      "parentOrganization": { "@id": `${BASE_URL}/#org` }
    },
    // Note: 'audience' removed - not a valid Organization property per Schema.org
    // Target audiences are now defined separately in the knowledge graph if needed
  };
}

/**
 * WebSite entity with SearchAction
 */
function getWebSiteEntity() {
  return {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "url": `${BASE_URL}/`,
    "name": "Politie Forum Nederland",
    "alternateName": ["Politie Forum", "Het Politie Forum", "Politie Forum NL"],
    "description": "Politie Forum Nederland is het grootste politie forum van Nederland over politie, criminaliteit, veiligheid en justitie. Het politie forum voor actueel politienieuws, discussies en ervaringen.",
    "inLanguage": "nl-NL",
    "publisher": { "@id": `${BASE_URL}/#org` },
    "copyrightHolder": { "@id": `${BASE_URL}/#org` },
    "copyrightYear": "2025",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/zoeken?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Forum CollectionPage entity (community structure)
 * Note: DiscussionForum is not a valid Schema.org type, using CollectionPage instead
 */
function getForumEntity(categories: Category[] = []) {
  return {
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/#forum-collection`,
    "name": "Politie Forum Nederland Community",
    "url": `${BASE_URL}/`,
    "description": "Actieve discussiecommunity over politie, veiligheid en justitie in Nederland",
    "inLanguage": "nl-NL",
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    "about": [
      { "@type": "Thing", "name": "Nederlandse Politie" },
      { "@type": "Thing", "name": "Criminaliteit" },
      { "@type": "Thing", "name": "Veiligheid" },
      { "@type": "Thing", "name": "Justitie" },
    ],
    ...(categories.length > 0 && {
      "hasPart": categories.slice(0, 10).map((cat) => ({
        "@type": "CollectionPage",
        "@id": `${BASE_URL}/categorie/${cat.slug || cat.id}`,
        "name": cat.name,
        "description": cat.description || `Discussies in de categorie ${cat.name}`,
        "url": `${BASE_URL}/categorie/${cat.slug || cat.id}`,
      })),
    }),
  };
}

// ===========================
// EDITORIAL & MEMBERSHIP
// ===========================

/**
 * Person entity for editorial team (E-E-A-T signal)
 */
function getEditorPersonEntity() {
  return {
    "@type": "Person",
    "@id": `${BASE_URL}/#editor`,
    "name": "Politie Forum Redactie",
    "jobTitle": "Hoofdredacteur",
    "description": "Ervaren redactieteam gespecialiseerd in politie, veiligheid en justitiezaken met jarenlange expertise in Nederlandse criminaliteitsanalyse.",
    "worksFor": { "@id": `${BASE_URL}/#org` },
    "knowsAbout": [
      "Nederlandse Politie",
      "Criminaliteitsanalyse",
      "Veiligheidszaken",
      "Justitie en Rechtspraak",
      "Politie Organisatie",
      "Misdaadpreventie",
    ],
    "url": `${BASE_URL}/over`,
    "sameAs": [
      "https://x.com/politieforum",
      "https://linkedin.com/company/politie-forum",
    ],
  };
}

/**
 * Dynamic BreadcrumbList generator
 * Supports multiple page types with proper hierarchy for Google rich results
 *
 * @param pageType - Type of page: 'home' | 'category' | 'article' | 'generic'
 * @param pageName - Current page name (for position 2 or 3)
 * @param categoryName - Category name (for article pages, position 2)
 * @param categorySlug - Category slug for URL (for article pages)
 */
function getBreadcrumbListEntity(
  pageType: 'home' | 'category' | 'article' | 'generic' = 'home',
  pageName?: string,
  categoryName?: string,
  categorySlug?: string
) {
  const items: any[] = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${BASE_URL}/`,
    },
  ];

  // Homepage: only 1 item (Home) - no duplication
  if (pageType === 'home') {
    // Single breadcrumb for homepage (no duplicate)
    // Google prefers minimal breadcrumb on root URL
  }

  // Category page: Home → Category
  else if (pageType === 'category' && pageName) {
    items.push({
      "@type": "ListItem",
      "position": 2,
      "name": pageName,
      "item": categorySlug ? `${BASE_URL}/categorieen/${categorySlug}` : `${BASE_URL}/categorieen`,
    });
  }

  // Article page: Home → Category → Article
  else if (pageType === 'article' && pageName) {
    if (categoryName && categorySlug) {
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": categoryName,
        "item": `${BASE_URL}/categorieen/${categorySlug}`,
      });
      items.push({
        "@type": "ListItem",
        "position": 3,
        "name": pageName,
        // Note: item URL should be current page, not needed for last item
      });
    } else {
      // Fallback: Home → Nieuws → Article
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Nieuws",
        "item": `${BASE_URL}/nieuws`,
      });
      items.push({
        "@type": "ListItem",
        "position": 3,
        "name": pageName,
      });
    }
  }

  // Generic page: Home → Page Name
  else if (pageType === 'generic' && pageName) {
    items.push({
      "@type": "ListItem",
      "position": 2,
      "name": pageName,
    });
  }

  return {
    "@type": "BreadcrumbList",
    "@id": `${BASE_URL}/#breadcrumb`,
    "itemListElement": items,
  };
}

/**
 * Breaking News WebPageElement entity
 * REMOVED: CSS selector '.breaking-news-marquee' does not exist in HTML
 * Keeping function stub for potential future use
 */
function getBreakingNewsElement() {
  // Disabled - element not present in current HTML structure
  return null;
}

/**
 * ProgramMembership entity (forum membership structure)
 */
function getMembershipEntity() {
  return {
    "@type": "ProgramMembership",
    "@id": `${BASE_URL}/#membership`,
    "name": "Politie Forum Lidmaatschap",
    "description": "Gratis lidmaatschap van Politie Forum Nederland met toegang tot alle discussies en content",
    "membershipType": "Free",
    "membershipPointsEarned": 0,
    "hostingOrganization": { "@id": `${BASE_URL}/#org` },
    "programName": "Forum Community",
    "url": `${BASE_URL}/registreren`,
  };
}

// ===========================
// CONTENT ENTITIES
// ===========================

/**
 * Generate DiscussionForumPosting for articles
 */
// Extended Article shape for schema consumption can include pre-fetched firstCommentsForSchema
interface ArticleWithSchemaComments extends Article {
  schemaComments?: Array<{
    id: string;
    authorName?: string;
    content: string;
    createdAt: number | string;
    likes?: number;
  }>;
}

function getForumPostingEntity(article: ArticleWithSchemaComments) {
  // Ensure we never leak full article body into JSON-LD (cap excerpt fallback at 280 chars)
  const safeExcerpt = (article.excerpt || article.content?.substring(0, 300) || '').substring(0, 280);

  // Helper: Sanitize comment text for JSON-LD (strip HTML, emoji, markdown, limit length)
  const sanitizeCommentText = (text: string) => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove markdown bold
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '') // Remove markdown images
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
      .replace(/[🎉💪👍✅🔥👏🚀💯⭐🏆]/g, '') // Remove common emoji
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 300); // Limit to 300 chars
  };

  // Lightweight placeholder comment to demonstrate discussion activity (only if commentCount > 0)
  const placeholderComment = (article.schemaComments && article.schemaComments.length > 0)
    ? article.schemaComments.slice(0, 2).map(c => ({
        "@type": "Comment",
        "@id": `${BASE_URL}/nieuws/${article.slug}#comment-${c.id}`,
        "text": sanitizeCommentText(c.content || ''),
        "datePublished": typeof c.createdAt === 'number' ? toISO8601(c.createdAt) : c.createdAt,
        "author": { "@type": "Person", "name": c.authorName || 'Gast' },
        ...(typeof c.likes === 'number' && c.likes > 0 ? {
          "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/UpvoteAction",
            "userInteractionCount": c.likes
          }
        } : {})
      }))
    : (article.commentCount && article.commentCount > 0) ? [{
    "@type": "Comment",
    "@id": `${BASE_URL}/nieuws/${article.slug}#comment-placeholder-1`,
    "text": "Discussie gestart – bekijk de volledige thread voor alle reacties.",
    "datePublished": toISO8601(article.publishedAt),
    "author": {
      "@type": "Person",
      "@id": `${BASE_URL}/#editor`,
      "name": "Politie Forum Redactie",
      "url": `${BASE_URL}/over`
    }
  }] : [];

  return {
    "@type": "DiscussionForumPosting",
    "@id": `${BASE_URL}/nieuws/${article.slug}/#discussion`,
    "headline": article.title,
    "text": safeExcerpt,
    "datePublished": toISO8601(article.publishedAt),
    "dateModified": toISO8601(article.updatedAt || article.publishedAt),
    "author": {
      "@type": "Person",
      "@id": `${BASE_URL}/#editor`,
      "name": "Politie Forum Redactie",
      "url": `${BASE_URL}/over`,
      "jobTitle": "Hoofdredacteur",
      "worksFor": { "@id": `${BASE_URL}/#org` }
    },
    "publisher": { "@id": `${BASE_URL}/#org` },
    "isPartOf": { "@id": `${BASE_URL}/#discussion-list` },
    "discussionUrl": `${BASE_URL}/nieuws/${article.slug}/#reacties`,
    "url": `${BASE_URL}/nieuws/${article.slug}/#reacties`,
    "comment": placeholderComment,
    "interactionStatistic": [
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/CommentAction",
        "userInteractionCount": article.commentCount || 0,
      },
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/ViewAction",
        "userInteractionCount": article.viewCount || 0,
      }
    ],
  };
}

/**
 * FAQPage entity
 */
function getFAQPageEntity(faqData: FAQItem[]) {
  if (!faqData || faqData.length === 0) {
    return null;
  }

  return {
    "@type": "FAQPage",
    "@id": `${BASE_URL}/#faq`,
    "mainEntity": faqData.map((faq, index) => {
      // Generate URL-friendly slug from question
      const questionSlug = faq.question
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 60);

      return {
        "@type": "Question",
        "@id": `${BASE_URL}/#faq-${questionSlug}`,
        "name": faq.question,
        "url": `${BASE_URL}/#faq-${questionSlug}`, // Contextual link for rich snippets
        "position": index + 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
          "url": `${BASE_URL}/#faq-${questionSlug}`,
        },
      };
    }),
  };
}

/**
 * HowTo entity (example: police application process)
 */
function getHowToEntity() {
  return {
    "@type": "HowTo",
    "@id": `${BASE_URL}/#howto-sollicitatie`,
    "name": "Hoe solliciteer je bij de politie?",
    "description": "Stapsgewijze handleiding voor het solliciteren bij de Nederlandse politie",
    "inLanguage": "nl-NL",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Controleer de functievereisten",
        "text": "Bekijk de functie-eisen en minimale kwalificaties op politie.nl/werken-bij",
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Dien je sollicitatie in",
        "text": "Upload je CV en motivatiebrief via het online sollicitatieportaal",
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Assessment en tests",
        "text": "Doorloop de psychologische tests, fysieke testen en assessment center",
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Medische keuring",
        "text": "Voltooi de medische keuring en veiligheidsscreening",
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Start je opleiding",
        "text": "Begin aan de Politieacademie opleiding (3-4 jaar)",
      },
    ],
  };
}

/**
 * Event entity (example: open day)
 */
function getEventEntity(event?: Event) {
  if (!event) {
    // Default example event
    return {
      "@type": "Event",
      "@id": `${BASE_URL}/#event-opendag`,
      "name": "Politieacademie Open Dag 2025",
      "description": "Bezoek de Politieacademie en ontdek wat een opleiding tot politieagent inhoudt",
      "startDate": "2025-03-15T10:00:00+01:00",
      "endDate": "2025-03-15T16:00:00+01:00",
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": "Politieacademie",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Apeldoorn",
          "addressCountry": "NL",
        },
      },
      "organizer": { "@id": `${BASE_URL}/#org` },
      "isAccessibleForFree": true,
      "image": `${BASE_URL}/og/politie-forum-1200x630.png`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": `${BASE_URL}/#event-opendag`,
      },
    };
  }

  // Map attendanceMode string to Schema.org URL
  const attendanceModeMap = {
    'offline': 'https://schema.org/OfflineEventAttendanceMode',
    'online': 'https://schema.org/OnlineEventAttendanceMode',
    'mixed': 'https://schema.org/MixedEventAttendanceMode',
  };

  return {
    "@type": "Event",
    "@id": `${BASE_URL}/event/${event.id}`,
    "name": event.name,
    "description": event.description,
    "startDate": event.startDate,
    ...(event.endDate && { "endDate": event.endDate }),
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": event.attendanceMode
      ? attendanceModeMap[event.attendanceMode]
      : "https://schema.org/MixedEventAttendanceMode",
    "organizer": { "@id": `${BASE_URL}/#org` },
    ...(event.location && {
      "location": {
        "@type": "Place",
        "name": event.location,
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "NL",
        },
      },
    }),
    "image": `${BASE_URL}/og/politie-forum-1200x630.png`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
    },
  };
}

/**
 * Discussion List ItemList (popular discussions)
 */
function getDiscussionListEntity(articles: Article[] = []) {
  return {
    "@type": "ItemList",
    "@id": `${BASE_URL}/#discussion-list`,
    "name": "Populaire Discussies",
    "description": "Meest populaire forum discussies over politie en veiligheid",
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "numberOfItems": articles.length,
    "itemListElement": articles.map((article, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": { "@id": `${BASE_URL}/nieuws/${article.slug}#discussion` },
    })),
  };
}

/**
 * Crime Map WebApplication entity
 */
function getCrimeMapEntity() {
  return {
    "@type": "WebApplication",
    "@id": `${BASE_URL}/#crime-map`,
    "name": "Crime Map Nederland",
    "alternateName": "Interactieve Misdaadkaart Nederland",
    "description": "Interactieve kaart met recente misdaadincidenten in Nederland op basis van openbare politieberichten. Dagelijks bijgewerkt met locaties, categorieën en tijdstippen.",
    "url": `${BASE_URL}/crime-map-nederland/`,
    "operatingSystem": "All",
    "applicationCategory": "MapApplication",
    "browserRequirements": "Requires JavaScript. HTML5-compatible browser.",
    "creator": { "@id": `${BASE_URL}/#org` },
    "provider": { "@id": `${BASE_URL}/#org` },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
    },
    "featureList": [
      "Dagelijkse updates van misdaadincidenten",
      "Interactieve kaart met OpenStreetMap",
      "Filter op misdaadtype en locatie",
      "Tijdlijn van incidenten",
      "Koppeling naar originele politieberichten",
    ],
  };
}

/**
 * WebAPI schema for Crime Map endpoints
 */
function getCrimeMapWebAPIEntity() {
  return {
    "@type": "WebAPI",
    "@id": `${BASE_URL}/api/crime-map#api`,
    "name": "Crime Map API",
    "description": "RESTful API voor toegang tot Nederlandse criminaliteitsdata. Ondersteunt GeoJSON, CSV en JSON formaten.",
    "url": `${BASE_URL}/api/crime-map`,
    "documentation": `${BASE_URL}/api/crime-map/docs`,
    "provider": { "@id": `${BASE_URL}/#org` },
    "termsOfService": `${BASE_URL}/terms`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/api/crime-map/search?q={query}&format={format}`,
        "httpMethod": "GET",
      },
      "query-input": [
        "required name=query",
        "name=format enum=json,csv,geojson",
      ],
    },
  };
}

/**
 * DataCatalog wrapper for Crime Map datasets
 */
function getCrimeMapDataCatalogEntity() {
  return {
    "@type": "DataCatalog",
    "@id": `${BASE_URL}/data#catalog`,
    "name": "Politie Forum Nederland Data Catalog",
    "description": "Collectie van open datasets over criminaliteit en veiligheid in Nederland",
    "url": `${BASE_URL}/data`,
    "publisher": { "@id": `${BASE_URL}/#org` },
    "dataset": [{ "@id": `${BASE_URL}/crime-map-nederland#dataset` }],
  };
}

/**
 * Crime Map Dataset entity (for Google Dataset Search)
 */
function getCrimeMapDatasetEntity() {
  return {
    "@type": "Dataset",
    "@id": `${BASE_URL}/crime-map-nederland#dataset`,
    "includedInDataCatalog": { "@id": `${BASE_URL}/data#catalog` },
    "name": "Nederlandse Criminaliteitskaart - Politie Forum Nederland",
    "description": "Interactieve dataset met meldingen van criminaliteit en incidenten in Nederland. Gebaseerd op openbare politieberichten en nieuwsbronnen. Real-time updates van incidenten, inbraken, overvallen, vernielingen en andere misdrijven.",
    "url": `${BASE_URL}/crime-map-nederland/`,
    "keywords": [
      "criminaliteit Nederland",
      "politie meldingen",
      "incidenten kaart",
      "crime map",
      "veiligheid Nederland",
      "misdaad statistieken",
      "inbraak meldingen",
      "openbare orde",
      "geografische data",
    ],
    "license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "isAccessibleForFree": true,
    "creator": { "@id": `${BASE_URL}/#org` },
    "publisher": { "@id": `${BASE_URL}/#org` },
    "datePublished": "2025-01-01",
    "dateModified": new Date().toISOString(),
    "temporalCoverage": "2024-01-01/" + new Date().toISOString().split('T')[0],
    "spatialCoverage": {
      "@type": "Place",
      "name": "Nederland",
      "geo": {
        "@type": "GeoShape",
        "box": "50.7503837 3.3316117 53.5547201 7.2274985",
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NL",
      },
    },
    "distribution": [
      {
        "@type": "DataDownload",
        "encodingFormat": "application/geo+json",
        "contentUrl": `${BASE_URL}/api/crime-map/geojson`,
        "description": "GeoJSON formaat voor GIS-toepassingen",
      },
      {
        "@type": "DataDownload",
        "encodingFormat": "text/csv",
        "contentUrl": `${BASE_URL}/api/crime-map/csv`,
        "description": "CSV export van alle incidenten",
      },
      {
        "@type": "DataDownload",
        "encodingFormat": "application/json",
        "contentUrl": `${BASE_URL}/api/crime-map/json`,
        "description": "JSON API endpoint voor developers",
      },
    ],
    "measurementTechnique": "Automated aggregation of public police reports and news articles",
    "variableMeasured": [
      {
        "@type": "PropertyValue",
        "name": "Incident Type",
        "description": "Categorie van het gemelde incident (inbraak, overval, vernieling, etc.)",
      },
      {
        "@type": "PropertyValue",
        "name": "Location",
        "description": "Geografische locatie (stad, straat) van het incident",
      },
      {
        "@type": "PropertyValue",
        "name": "Date",
        "description": "Datum en tijdstip van het incident",
      },
      {
        "@type": "PropertyValue",
        "name": "Coordinates",
        "description": "WGS84 coördinaten (latitude, longitude)",
      },
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "name": "Zoek incident op locatie",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/crime-map-nederland?search={search_term}`,
      },
      "query-input": "required name=search_term",
    },
  };
}

/**
 * ClaimReview entity (fact-checking)
 */
function getClaimReviewEntity() {
  return {
    "@type": "ClaimReview",
    "@id": `${BASE_URL}/#claimreview-example`,
    "url": `${BASE_URL}/factcheck/voorbeeld`,
    "claimReviewed": "Voorbeeld claim over politie statistieken",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": 3,
      "bestRating": 5,
      "worstRating": 1,
      "alternateName": "Deels Waar",
    },
    "author": {
      "@type": "Person",
      "@id": `${BASE_URL}/#editor`,
      "name": "Politie Forum Redactie",
      "url": `${BASE_URL}/over`,
      "jobTitle": "Hoofdredacteur",
      "worksFor": { "@id": `${BASE_URL}/#org` }
    },
    "datePublished": "2025-10-01",
    "itemReviewed": {
      "@type": "CreativeWork",
      "author": {
        "@type": "Organization",
        "name": "Voorbeeld Bron",
      },
    },
  };
}

/**
 * Comment entity (for discussion threads)
 */
function getCommentEntity(comment: Comment) {
  const entity: any = {
    "@type": "Comment",
    "@id": comment.id ? `${BASE_URL}/comment/${comment.id}` : undefined,
    "text": comment.text,
    "dateCreated": comment.dateCreated,
    "author": {
      "@type": "Person",
      "name": comment.authorName || comment.author,
    },
  };

  if (comment.parentId) {
    entity.parentItem = { "@id": `${BASE_URL}/comment/${comment.parentId}` };
  }

  // Add interaction statistics if available
  if ((comment as any).upvoteCount !== undefined) {
    entity.interactionStatistic = {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/UpvoteAction",
      "userInteractionCount": (comment as any).upvoteCount,
    };
  }

  return entity;
}

/**
 * Review entity (user feedback)
 */
function getReviewEntity(review: Review) {
  return {
    "@type": "Review",
    "@id": `${BASE_URL}/review/${review.id}`,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": 5,
      "worstRating": 1,
    },
    "reviewBody": review.reviewBody,
    "datePublished": review.datePublished,
    "author": {
      "@type": "Person",
      "name": review.authorName || review.author,
    },
    ...(review.itemReviewed && {
      "itemReviewed": { "@id": review.itemReviewed },
    }),
  };
}

/**
 * WebPageElement entity (for page sections)
 */
function getWebPageElementEntity(element: WebPageElement) {
  return {
    "@type": "WebPageElement",
    "@id": `${BASE_URL}/#${element.id}`,
    "name": element.name,
    "description": element.description,
    "isPartOf": { "@id": `${BASE_URL}/#webpage` },
    ...(element.cssSelector && { "cssSelector": element.cssSelector }),
    ...(element.about && { "about": element.about }),
  };
}

/**
 * AggregateRating entity (for overall ratings)
 */
function getAggregateRatingEntity(rating: AggregateRating) {
  return {
    "@type": "AggregateRating",
    "ratingValue": rating.ratingValue,
    "reviewCount": rating.reviewCount,
    "bestRating": rating.bestRating || 5,
    "worstRating": rating.worstRating || 1,
  };
}

/**
 * Site AggregateRating (REMOVED - self-serving ratings are not eligible for rich results)
 * Only use AggregateRating for genuine third-party reviews
 */
// function getSiteAggregateRating() {
//   return {
//     "@type": "AggregateRating",
//     "@id": `${BASE_URL}/#site-rating`,
//     "ratingValue": "4.8",
//     "bestRating": "5",
//     "ratingCount": "124",
//     "itemReviewed": {
//       "@type": "WebSite",
//       "@id": `${BASE_URL}/#website`,
//     },
//   };
// }

/**
 * VideoObject entity (for video content)
 */
function getVideoObjectEntity(video: VideoObject) {
  return {
    "@type": "VideoObject",
    "name": video.name,
    "description": video.description,
    "thumbnailUrl": video.thumbnailUrl,
    "uploadDate": video.uploadDate,
    ...(video.duration && { "duration": video.duration }),
    ...(video.contentUrl && { "contentUrl": video.contentUrl }),
    "publisher": { "@id": `${BASE_URL}/#org` },
  };
}

/**
 * LiveBlogPosting entity (for live coverage)
 */
/**
 * Community Events WebPageElement
 */

/**
 * Community Events WebPageElement
 * REMOVED: CSS selector '#community-events' does not exist in HTML
 * Keeping function stub for potential future use
 */
function getCommunityEventsElement() {
  // Disabled - element not present in current HTML structure
  return null;
}

/**
 * Sample Community Event entity
 */
function getCommunityEventEntity() {
  // Helper to format a Date in Europe/Amsterdam with correct DST offset (+01:00 / +02:00)
  function toAmsterdamISO(d: Date) {
    const tz = 'Europe/Amsterdam';
    const dtf = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const parts = Object.fromEntries(dtf.formatToParts(d).map(p => [p.type, p.value]));
    const year = Number(parts.year);
    const month = Number(parts.month);
    const day = Number(parts.day);
    const hour = Number(parts.hour);
    const minute = Number(parts.minute);
    const second = Number(parts.second);
    // Create a UTC date from the Amsterdam wall time to derive the offset
    const utcEquivalent = Date.UTC(year, month - 1, day, hour, minute, second);
    const actualTime = d.getTime();
    const offsetMinutes = Math.round((utcEquivalent - actualTime) / 60000); // FIXED: flipped for correct positive offset (Amsterdam = UTC+1/+2)
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const abs = Math.abs(offsetMinutes);
    const oh = String(Math.floor(abs / 60)).padStart(2, '0');
    const om = String(abs % 60).padStart(2, '0');
    return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}${sign}${oh}:${om}`;
  }

  const start = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // next week
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2 hours

  return {
    "@type": "Event",
    "@id": `${BASE_URL}/events/wijkagent-spreekuur`,
    "name": "Wijkagent Spreekuur",
    "description": "Maandelijks inloopspreekuur waar buurtbewoners vragen kunnen stellen aan de wijkagent",
    "startDate": toAmsterdamISO(start),
    "endDate": toAmsterdamISO(end),
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "Politiebureau Amsterdam-Centrum",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Nieuwezijds Voorburgwal 104",
        "addressLocality": "Amsterdam",
        "postalCode": "1012 SG",
        "addressCountry": "NL"
      }
    },
    "organizer": { "@id": `${BASE_URL}/#org` },
    "isAccessibleForFree": true
  };
}

/**
 * Latest Comments WebPageElement
 * REMOVED: CSS selector '.recent-comments' does not exist in HTML
 * Keeping function stub for potential future use
 */
function getLatestCommentsElement() {
  // Disabled - element not present in current HTML structure
  return null;
}

/**
 * QAPage entity (vraag-en-antwoord structuur)
 */
function getQAPageEntity(qa: QAPage) {
  return {
    "@type": "QAPage",
    "@id": `${BASE_URL}/qa/${qa.question.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    "mainEntity": {
      "@type": "Question",
      "name": qa.question,
      "text": qa.question,
      "answerCount": 1,
      "upvoteCount": qa.upvoteCount || 0,
      "dateCreated": qa.datePublished || new Date().toISOString(),
      "author": qa.author ? {
        "@type": "Person",
        "name": qa.author
      } : undefined,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": qa.answer,
        "dateCreated": qa.datePublished || new Date().toISOString(),
        "upvoteCount": qa.upvoteCount || 0,
        "author": qa.author ? {
          "@type": "Person",
          "name": qa.author
        } : { "@id": `${BASE_URL}/#org` }
      }
    }
  };
}

/**
 * Discussion Forum CollectionPage (wrapper voor alle forum discussions)
 * Note: Schema.org doesn't have DiscussionForum type, using CollectionPage instead
 */
function getDiscussionForumEntity(categories: Category[]) {
  return {
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/#forum-discussions`,
    "name": "Politie Forum Nederland Discussies",
    "description": "Nederlands discussieforum over politie, criminaliteit en veiligheid",
    "url": `${BASE_URL}/`,
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    "hasPart": categories.map(cat => ({
      "@type": "CollectionPage",
      "@id": `${BASE_URL}/categorie/${cat.id || cat.slug}`,
      "name": cat.name,
      "description": cat.description || `Discussies over ${cat.name}`
      // Note: numberOfItems removed - not valid for CollectionPage per Schema.org
    }))
  };
}

/**
 * CreativeWorkSeries entity (voor terugkerende artikelreeksen)
 */
function getCreativeWorkSeriesEntity(series: CreativeWorkSeries) {
  return {
    "@type": "CreativeWorkSeries",
    "@id": `${BASE_URL}/series/${series.url}`,
    "name": series.name,
    "description": series.description,
    "url": `${BASE_URL}/${series.url}`,
    "hasPart": series.hasPart?.map(slug => ({ "@id": `${BASE_URL}/nieuws/${slug}` })) || [],
    "publisher": { "@id": `${BASE_URL}/#org` }
  };
}

/**
 * DataCatalog entity (voor open-data datasets)
 */
function getDataCatalogEntity(catalog: DataCatalog) {
  return {
    "@type": "DataCatalog",
    "@id": `${BASE_URL}/#data-catalog`,
    "name": catalog.name,
    "description": catalog.description,
    "url": catalog.url,
    "publisher": { "@id": `${BASE_URL}/#org` },
    "dataset": catalog.dataset?.map((ds, i) => ({
      "@type": "Dataset",
      "@id": `${BASE_URL}/data/${i}`,
      "name": ds.name,
      "description": ds.description,
      "distribution": ds.distribution ? {
        "@type": "DataDownload",
        "contentUrl": ds.distribution,
        "encodingFormat": "application/json"
      } : undefined
    })) || []
  };
}

/**
 * SocialMediaPosting entity (voor korte updates)
 */
function getSocialMediaPostingEntity(post: SocialMediaPosting) {
  return {
    "@type": "SocialMediaPosting",
    "@id": post.url,
    "headline": post.headline,
    "articleBody": post.articleBody,
    "datePublished": toISO8601(post.datePublished),
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": { "@id": `${BASE_URL}/#org` },
    "url": post.url
  };
}

/**
 * LiveBlogPosting entity (voor real-time berichtgeving)
 */
function getLiveBlogPostingEntity(liveblog: LiveBlogPosting) {
  return {
    "@type": "LiveBlogPosting",
    "@id": `${BASE_URL}/live/${liveblog.headline.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    "headline": liveblog.headline,
    "description": liveblog.description,
    "coverageStartTime": toISO8601(liveblog.coverageStartTime),
    "coverageEndTime": liveblog.coverageEndTime ? toISO8601(liveblog.coverageEndTime) : undefined,
    "liveBlogUpdate": liveblog.liveBlogUpdate?.map((update, i) => ({
      "@type": "BlogPosting",
      "@id": `${BASE_URL}/live/${liveblog.headline.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/update-${i}`,
      "headline": update.headline,
      "articleBody": update.articleBody,
      "datePublished": toISO8601(update.datePublished)
    })) || [],
    "publisher": { "@id": `${BASE_URL}/#org` }
  };
}

/**
 * AboutPage entity
 */
function getAboutPageEntity() {
  return {
    "@type": "AboutPage",
    "@id": `${BASE_URL}/over/`,
    "name": "Over Politie Forum Nederland",
    "description": "Informatie over onze missie, visie en team",
    "url": `${BASE_URL}/over/`,
    "mainEntity": { "@id": `${BASE_URL}/#org` },
    "isPartOf": { "@id": `${BASE_URL}/#website` }
  };
}

/**
 * ContactPage entity
 */
function getContactPageEntity() {
  return {
    "@type": "ContactPage",
    "@id": `${BASE_URL}/contact/`,
    "name": "Contact",
    "description": "Neem contact op met Politie Forum Nederland",
    "url": `${BASE_URL}/contact/`,
    "mainEntity": { "@id": `${BASE_URL}/#org` },
    "isPartOf": { "@id": `${BASE_URL}/#website` }
  };
}

/**
 * ProfilePage entity
 */
function getProfilePageEntity(userId: string, userName: string) {
  return {
    "@type": "ProfilePage",
    "@id": `${BASE_URL}/leden/${userId}`,
    "name": `Profiel van ${userName}`,
    "description": `Forumprofiel en activiteit van ${userName}`,
    "url": `${BASE_URL}/leden/${userId}`,
    "mainEntity": {
      "@type": "Person",
      "@id": `${BASE_URL}/leden/${userId}#person`,
      "name": userName,
      "url": `${BASE_URL}/leden/${userId}`
    },
    "isPartOf": { "@id": `${BASE_URL}/#website` }
  };
}

// ===========================
// MAIN GENERATOR FUNCTION
// ===========================

export interface KnowledgeGraphOptions {
  articles?: Article[];
  categories?: Category[];
  faqData?: FAQItem[];
  members?: Member[];
  events?: Event[];
  comments?: Comment[];
  reviews?: Review[];
  webPageElements?: WebPageElement[];
  aggregateRating?: AggregateRating;
  videos?: VideoObject[];
  liveBlog?: LiveBlogPosting;
  qaPages?: QAPage[];
  dataCatalog?: DataCatalog;
  creativeWorkSeries?: CreativeWorkSeries[];
  socialMediaPosts?: SocialMediaPosting[];
  // Breadcrumb configuration
  breadcrumbType?: 'home' | 'category' | 'article' | 'generic';
  breadcrumbPageName?: string;
  breadcrumbCategoryName?: string;
  breadcrumbCategorySlug?: string;
  // Feature toggles
  includeHowTo?: boolean;
  includeClaimReview?: boolean;
  includeEvent?: boolean;
  includeMembership?: boolean;
  includeCrimeMap?: boolean;
  includeBreakingNews?: boolean;
  includeCommunityEvents?: boolean;
  includeDiscussionForum?: boolean;
  includeAboutPage?: boolean;
  includeContactPage?: boolean;
  includeProfilePages?: boolean;
}

/**
 * Generate complete knowledge graph
 *
 * @param options Configuration for included entities
 * @returns Complete @graph array ready for JSON-LD
 */
export function generateCompleteKnowledgeGraph(
  options: KnowledgeGraphOptions = {}
): Record<string, any> {
  const {
    articles = [],
    categories = [],
    faqData = [],
    comments = [],
    reviews = [],
    webPageElements = [],
    aggregateRating,
    videos = [],
    liveBlog,
    breadcrumbType = 'home',
    breadcrumbPageName,
    breadcrumbCategoryName,
    breadcrumbCategorySlug,
    includeHowTo = true,
    includeClaimReview = false,
    includeEvent = true,
    includeMembership = true,
    includeCrimeMap = true,
    includeBreakingNews = true,
    includeCommunityEvents = true,
  } = options;

  const graph: any[] = [
    getLogoEntity(),
    getOrganizationEntity(),
    getWebSiteEntity(),
    getForumEntity(categories),
    getEditorPersonEntity(),
    getBreadcrumbListEntity(breadcrumbType, breadcrumbPageName, breadcrumbCategoryName, breadcrumbCategorySlug),
  ];

  // Add Crime Map WebApplication
  if (includeCrimeMap) {
    graph.push(getCrimeMapEntity());
  }

  // Add membership
  if (includeMembership) {
    graph.push(getMembershipEntity());
  }

  // Add Breaking News Element
  if (includeBreakingNews) {
    graph.push(getBreakingNewsElement());
  }

  // Add Community Events Element
  if (includeCommunityEvents) {
    graph.push(getCommunityEventsElement());
  }

  // Add custom WebPageElements
  webPageElements.forEach((element) => {
    graph.push(getWebPageElementEntity(element));
  });

  // Add FAQ
  const faqEntity = getFAQPageEntity(faqData);
  if (faqEntity) {
    graph.push(faqEntity);
  }

  // Add articles as forum postings
  articles.forEach((article) => {
    graph.push(getForumPostingEntity(article));
  });

  // Add comments
  comments.forEach((comment) => {
    graph.push(getCommentEntity(comment));
  });

  // Add reviews
  reviews.forEach((review) => {
    graph.push(getReviewEntity(review));
  });

  // Add aggregate rating
  if (aggregateRating) {
    graph.push(getAggregateRatingEntity(aggregateRating));
  }

  // Add videos
  videos.forEach((video) => {
    graph.push(getVideoObjectEntity(video));
  });

  // Add live blog
  if (liveBlog) {
    graph.push(getLiveBlogPostingEntity(liveBlog));
  }

  // Add HowTo
  if (includeHowTo) {
    graph.push(getHowToEntity());
  }

  // Add Event
  if (includeEvent) {
    graph.push(getEventEntity());
  }

  // Add ClaimReview (optional, for fact-checking articles)
  if (includeClaimReview) {
    graph.push(getClaimReviewEntity());
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Generate layout-level knowledge graph (persistent entities)
 * Use this in layout.tsx for Organization, WebSite, WebPage
 */
export function generateLayoutKnowledgeGraph(): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      getLogoEntity(),
      getOrganizationEntity(),
      getWebSiteEntity(),
      getBreadcrumbListEntity('home'), // ✅ Add BreadcrumbList for homepage
      {
        "@type": ["WebPage", "CollectionPage"],
        "@id": `${BASE_URL}/#webpage`,
        "url": `${BASE_URL}/`,
        "name": "Politie Forum Nederland - Het Grootste Politie Forum",
        "description": "Politie Forum Nederland is het grootste politie forum van Nederland met dagelijks nieuws, discussies en ervaringen over de Nederlandse politie.",
        "isPartOf": { "@id": `${BASE_URL}/#website` },
        "inLanguage": "nl-NL",
        "breadcrumb": { "@id": `${BASE_URL}/#breadcrumb` },
        "primaryImageOfPage": { "@id": `${BASE_URL}/#logo` },
        "datePublished": "2025-01-01T00:00:00+01:00",
        "dateModified": new Date().toISOString(),
        "isAccessibleForFree": true,
        "hasPart": [
          { "@id": `${BASE_URL}/#faq` },
          { "@id": `${BASE_URL}/#crime-map` }
        ],
        // Note: Removed Event (not valid hasPart type) and WebPageElement refs (CSS selectors don't exist)
        // Event entity exists separately in graph for discoverability
      },
      {
        "@type": "SiteNavigationElement",
        "@id": `${BASE_URL}/#nav`,
        "name": ["Home", "Categorieën", "Nieuws", "FAQ", "Crime Map", "Over", "Contact", "Leden"],
        "url": [
          `${BASE_URL}/`,
          `${BASE_URL}/categorieen/`,
          `${BASE_URL}/nieuws/`,
          `${BASE_URL}/faq/`,
          `${BASE_URL}/crime-map-nederland/`,
          `${BASE_URL}/redactie/`,
          `${BASE_URL}/contact/`,
          `${BASE_URL}/leden/`,
        ],
      },
      getAboutPageEntity(),
      getContactPageEntity(),
    ],
  };
}

/**
 * Generate homepage-specific knowledge graph (STRUCTURAL ONLY - no content schemas)
 *
 * CRITICAL: Homepage should NOT have content schemas (Article, DiscussionForumPosting, Event, FAQ, etc.)
 * Those belong on their respective pages:
 * - NewsArticle → /nieuws/[slug]/
 * - DiscussionForumPosting → /topic/[id]/
 * - Event → /crime-map-nederland/ or specific event pages
 * - FAQPage → /faq/
 *
 * Homepage should ONLY describe the site structure, not individual content items.
 * This prevents "schema stuffing" which confuses Google and hurts SEO.
 *
 * Structural schemas allowed on homepage:
 * ✅ Organization (already in layout graph)
 * ✅ WebSite (already in layout graph)
 * ✅ BreadcrumbList (already in layout graph)
 * ✅ SiteNavigationElement (already in layout graph)
 * ✅ WebPage (already in layout graph)
 *
 * @deprecated This function should return an empty graph since layout already has all structural schemas
 */
export function generateHomepageKnowledgeGraph(
  articles: Article[] = [],
  faqData: FAQItem[] = [],
  categories: Category[] = []
): Record<string, any> {
  // Return empty graph - all structural schemas are in layout graph
  // Homepage should NOT tell Google it's 12 different things simultaneously
  return {
    "@context": "https://schema.org",
    "@graph": [],
  };
}

/**
 * Consolidate layout-level and page-level graphs into a single @graph array.
 * This is optional; current strategy keeps separation for cacheability.
 * Use when you explicitly want one JSON-LD script tag (e.g. for validator snapshots).
 */
export function consolidateKnowledgeGraphs(
  layoutGraph: Record<string, any>,
  pageGraph: Record<string, any>
): Record<string, any> {
  const layoutItems = Array.isArray(layoutGraph?.['@graph']) ? layoutGraph['@graph'] : [];
  const pageItems = Array.isArray(pageGraph?.['@graph']) ? pageGraph['@graph'] : [];

  // Avoid duplicate @id entries by using a map
  const byId = new Map<string, any>();
  const push = (item: any) => {
    if (item && typeof item === 'object') {
      const id = item['@id'];
      if (id) {
        if (!byId.has(id)) byId.set(id, item);
      } else {
        // Items without @id are always appended (e.g., ListItem wrappers)
        byId.set(`_anon_${byId.size}_${Math.random().toString(36).slice(2)}`, item);
      }
    }
  };

  layoutItems.forEach(push);
  pageItems.forEach(push);

  return {
    '@context': 'https://schema.org',
    '@graph': Array.from(byId.values())
  };
}

/**
 * Export individual entity generators for direct usage in article pages
 */
export {
    getAboutPageEntity,
    getAggregateRatingEntity,
    getBreadcrumbListEntity,
    getBreakingNewsElement,
    getCommentEntity,
    getCommunityEventEntity,
    getCommunityEventsElement,
    getContactPageEntity,
    getCreativeWorkSeriesEntity,
    getCrimeMapDataCatalogEntity,
    getCrimeMapDatasetEntity,
    getCrimeMapEntity,
    getCrimeMapWebAPIEntity,
    getDataCatalogEntity,
    getDiscussionForumEntity,
    getDiscussionListEntity,
    getLatestCommentsElement,
    getLiveBlogPostingEntity,
    getProfilePageEntity,
    getQAPageEntity,
    getReviewEntity,
    getSocialMediaPostingEntity,
    getVideoObjectEntity,
    getWebPageElementEntity
};

