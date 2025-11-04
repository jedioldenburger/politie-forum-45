// Optimized JSON-LD schemas for maximum SEO impact (2025 standards)

/**
 * Base organization & website schema - used on all pages
 * Compressed, production-ready, 100% Google Rich Results compliant
 */
export function generateBaseSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsMediaOrganization",
        "@id": "https://politie-forum.nl/#organization",
        "name": "Politie Forum Nederland",
        "alternateName": ["Politie Forum", "Het Politie Forum", "Politie Forum NL", "Politie-Forum.nl"],
        "url": "https://politie-forum.nl",
        "logo": {
          "@type": "ImageObject",
          "url": "https://politie-forum.nl/police_badge_icon_512x512.png",
          "width": 512,
          "height": 512
        },
        "sameAs": [
          "https://twitter.com/politieforum",
          "https://www.facebook.com/politieforum",
          "https://www.linkedin.com/company/politie-forum",
          "https://www.instagram.com/politieforum"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "editorial",
          "email": "info@politie-forum.nl",
          "telephone": "+31-6-48319167",
          "availableLanguage": "nl"
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Sint Olofssteeg 4",
          "postalCode": "1012AK",
          "addressLocality": "Amsterdam",
          "addressCountry": "NL"
        },
        "foundingDate": "2020-01-01",
        "memberOf": {
          "@type": "Organization",
          "@id": "https://digestpaper.com/#publisher",
          "name": "DigestPaper Publisher Network"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://politie-forum.nl/#website",
        "url": "https://politie-forum.nl",
        "name": "Politie Forum Nederland",
        "alternateName": "Het Politie Forum",
        "publisher": { "@id": "https://politie-forum.nl/#organization" },
        "inLanguage": "nl-NL",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://politie-forum.nl/zoeken?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://politie-forum.nl/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://politie-forum.nl/"
          }
        ]
      },
      {
        "@type": "ContactPage",
        "@id": "https://politie-forum.nl/contact",
        "url": "https://politie-forum.nl/contact",
        "name": "Contact",
        "isPartOf": { "@id": "https://politie-forum.nl/#website" },
        "about": { "@id": "https://politie-forum.nl/#organization" }
      },
      {
        "@type": "AboutPage",
        "@id": "https://politie-forum.nl/over",
        "url": "https://politie-forum.nl/over",
        "name": "Over Politie Forum Nederland",
        "isPartOf": { "@id": "https://politie-forum.nl/#website" },
        "about": { "@id": "https://politie-forum.nl/#organization" }
      },
      {
        "@type": "DiscussionForumPosting",
        "@id": "https://politie-forum.nl/#forum",
        "url": "https://politie-forum.nl/",
        "headline": "Politie Forum Nederland - Community Discussies",
        "description": "Het grootste Nederlandse veiligheidsforum met 10.000+ leden die dagelijks discussiëren over politie, criminaliteit en justitie.",
        "inLanguage": "nl-NL",
        "isPartOf": { "@id": "https://politie-forum.nl/#website" },
        "author": { "@id": "https://politie-forum.nl/#organization" },
        "publisher": { "@id": "https://politie-forum.nl/#organization" },
        "datePublished": "2020-01-01T00:00:00+01:00",
        "dateModified": new Date().toISOString(),
        "interactionStatistic": [
          {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/CommentAction",
            "userInteractionCount": 50000
          },
          {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/ViewAction",
            "userInteractionCount": 500000
          },
          {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/LikeAction",
            "userInteractionCount": 25000
          }
        ],
        "audience": {
          "@type": "Audience",
          "audienceType": "Politie professionals, aspiranten, studenten criminologie, journalisten en geïnteresseerde burgers",
          "geographicArea": {
            "@type": "Country",
            "name": "Nederland"
          }
        }
      }
    ]
  };
}

/**
 * Comprehensive FAQ schema with 20 Q&A pairs
 * Covers community, moderation, privacy, usage questions
 * Note: No @context here - will be added at top level by consolidation
 */
export function generateFAQSchema() {
  return {
    "@type": "FAQPage",
    "@id": "https://politie-forum.nl/#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Wat is Politie Forum?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Politie Forum is een onafhankelijk online platform waar burgers, politieprofessionals en geïnteresseerden samenkomen om te discussiëren over veiligheid, justitie en politiewerk in Nederland."
        }
      },
      {
        "@type": "Question",
        "name": "Is Politie Forum verbonden aan de Nationale Politie?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nee, Politie Forum is een onafhankelijke community en niet officieel verbonden aan de Nationale Politie of een andere overheidsinstantie."
        }
      },
      {
        "@type": "Question",
        "name": "Moet ik een account aanmaken om deel te nemen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lezen kan zonder account, maar om te reageren of nieuwe topics te plaatsen is een gratis account vereist."
        }
      },
      {
        "@type": "Question",
        "name": "Hoe wordt mijn privacy beschermd?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Politie Forum gebruikt SSL-versleuteling, bewaart minimale persoonsgegevens en voldoet aan de GDPR-richtlijnen. Gegevens worden nooit gedeeld met derden."
        }
      },
      {
        "@type": "Question",
        "name": "Wie beheert Politie Forum?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Het platform wordt beheerd door een onafhankelijke redactie en moderatorteam dat toeziet op naleving van de communityregels."
        }
      },
      {
        "@type": "Question",
        "name": "Wat zijn de gedragsregels in het forum?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Respect, betrouwbaarheid en feitelijke onderbouwing staan centraal. Beledigingen, discriminatie of verspreiding van onjuiste informatie zijn niet toegestaan."
        }
      },
      {
        "@type": "Question",
        "name": "Hoe kan ik een overtreding melden?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Gebruik de meldknop bij het bericht of neem contact op via het formulier op de contactpagina. Moderators beoordelen elke melding individueel."
        }
      },
      {
        "@type": "Question",
        "name": "Worden berichten vooraf gecontroleerd?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Berichten worden niet vooraf gemodereerd maar kunnen achteraf worden verwijderd of aangepast als ze in strijd zijn met de richtlijnen."
        }
      },
      {
        "@type": "Question",
        "name": "Kan ik mijn account verwijderen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, via de accountinstellingen kun je je profiel en alle gekoppelde gegevens permanent laten verwijderen."
        }
      },
      {
        "@type": "Question",
        "name": "Hoe blijft Politie Forum vrij van misinformatie?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "De redactie verifieert bronnen actief, verwijdert misleidende inhoud en stimuleert leden om fact-checking en bronvermelding te gebruiken."
        }
      },
      {
        "@type": "Question",
        "name": "Is deelname gratis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, deelname is volledig gratis. Er zijn geen betaalde abonnementen of verborgen kosten."
        }
      },
      {
        "@type": "Question",
        "name": "Kan ik anoniem deelnemen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Je kunt onder een gebruikersnaam deelnemen, maar IP-adressen worden geregistreerd voor veiligheidsdoeleinden en misbruikpreventie."
        }
      },
      {
        "@type": "Question",
        "name": "Hoe kan ik bijdragen aan het forum?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Door inhoud te delen, te reageren, relevante bronnen te vermelden en constructieve discussies te voeren over actuele thema's binnen veiligheid en rechtshandhaving."
        }
      },
      {
        "@type": "Question",
        "name": "Welke onderwerpen worden besproken?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Onderwerpen variëren van politie-opleiding en misdaadbestrijding tot digitale opsporing, verkeersveiligheid en maatschappelijke kwesties rond recht en orde."
        }
      },
      {
        "@type": "Question",
        "name": "Wat gebeurt er met verwijderde berichten?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Verwijderde berichten worden tijdelijk bewaard voor moderatie-evaluatie en daarna permanent verwijderd uit de database."
        }
      },
      {
        "@type": "Question",
        "name": "Kan ik contact opnemen met de redactie?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, via de contactpagina kun je rechtstreeks mailen naar info@politie-forum.nl voor redactionele of technische vragen."
        }
      },
      {
        "@type": "Question",
        "name": "Hoe vaak wordt de inhoud geüpdatet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nieuwe discussies en artikelen verschijnen dagelijks, met wekelijkse redactionele samenvattingen van de meest besproken thema's."
        }
      },
      {
        "@type": "Question",
        "name": "Worden er samenwerkingen aangegaan met media of onderzoeksinstellingen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Soms worden discussies samengevat in onderzoeksprojecten of journalistieke publicaties, altijd met toestemming van de betrokken gebruikers."
        }
      },
      {
        "@type": "Question",
        "name": "Heeft Politie Forum een mobiele app?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Momenteel niet, maar de website is volledig mobielvriendelijk en functioneert als PWA (Progressive Web App)."
        }
      },
      {
        "@type": "Question",
        "name": "Waar kan ik de communityrichtlijnen vinden?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "De volledige richtlijnen zijn te lezen op https://politie-forum.nl/gebruikersregels, inclusief informatie over moderatie, privacy en auteursrechten."
        }
      }
    ]
  };
}

/**
 * Combined HowTo + VideoObject schema
 * Shows step-by-step guide with welcome video integration
 */
export function generateHowToVideoSchema() {
  return [
      {
        "@type": "HowTo",
        "@id": "https://politie-forum.nl/#howto-bericht",
        "name": "Hoe plaats ik een bericht op Politie Forum",
        "description": "Leer stap voor stap hoe je een nieuw bericht kunt plaatsen op Politie Forum — van inloggen tot publiceren.",
        "totalTime": "PT2M",
        "supply": ["Een internetverbinding", "Een Politie Forum-account"],
        "tool": ["Computer of smartphone", "Webbrowser"],
        "step": [
          {
            "@type": "HowToStep",
            "name": "Stap 1: Log in op je account",
            "text": "Ga naar https://politie-forum.nl en klik rechtsboven op 'Inloggen'. Voer je gebruikersnaam en wachtwoord in. Heb je nog geen account, kies dan 'Registreren'.",
            "image": "https://politie-forum.nl/login.png"
          },
          {
            "@type": "HowToStep",
            "name": "Stap 2: Navigeer naar de juiste categorie",
            "text": "Klik in het hoofdmenu op 'Categorieën' en kies het onderwerp waar je over wilt praten, zoals Veiligheid, Opleiding of Politie-inzet.",
            "image": "https://politie-forum.nl/category.png"
          },
          {
            "@type": "HowToStep",
            "name": "Stap 3: Klik op 'Nieuw onderwerp'",
            "text": "Bovenaan de discussielijst vind je de knop 'Nieuw onderwerp'. Klik hier om een nieuw bericht te starten.",
            "image": "https://politie-forum.nl/new-topic.png"
          },
          {
            "@type": "HowToStep",
            "name": "Stap 4: Schrijf je bericht",
            "text": "Voer een duidelijke titel in, schrijf je bericht in het tekstveld en voeg eventueel links of afbeeldingen toe. Gebruik correcte bronvermelding waar nodig.",
            "image": "https://politie-forum.nl/write-post.png"
          },
          {
            "@type": "HowToStep",
            "name": "Stap 5: Controleer en publiceer",
            "text": "Lees je bericht nog één keer door, kies eventueel een categorie of tag, en klik dan op 'Plaatsen'. Je bericht verschijnt direct in de discussie.",
            "image": "https://politie-forum.nl/publish.png"
          }
        ],
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "EUR",
          "value": "0"
        },
        "estimatedTime": "PT2M",
        "inLanguage": "nl-NL",
        "associatedMedia": { "@id": "https://politie-forum.nl/#welkom-video" }
      },
      {
        "@type": "VideoObject",
        "@id": "https://politie-forum.nl/#welkom-video",
        "name": "Welkom op Politie Forum NL",
        "description": "Een korte introductievideo over het Politie Forum Nederland — een onafhankelijk platform voor discussie, nieuws en inzichten over veiligheid en justitie.",
        "thumbnailUrl": "https://politie-forum.nl/video-thumbnail-welkom.jpg",
        "uploadDate": "2025-11-04",
        "duration": "PT1M",
        "contentUrl": "https://politie-forum.nl/welkom_op_politie-forum-nl.mp4",
        "embedUrl": "https://politie-forum.nl/embed/welkom-op-politie-forum-nl",
        "mainEntityOfPage": "https://politie-forum.nl/",
        "isPartOf": { "@id": "https://politie-forum.nl/#howto-bericht" },
        "publisher": {
          "@type": "Organization",
          "name": "Politie Forum Nederland",
          "logo": {
            "@type": "ImageObject",
            "url": "https://politie-forum.nl/police_badge_icon_512x512.png",
            "width": 512,
            "height": 512
          }
        },
        "inLanguage": "nl-NL",
        "potentialAction": {
          "@type": "WatchAction",
          "target": ["https://politie-forum.nl/#welkom-video"]
        }
      }
    ];
}

/**
 * Homepage-specific WebPage schema
 */
export function generateHomepageWebPageSchema() {
  return {
    "@type": "WebPage",
    "@id": "https://politie-forum.nl/#webpage",
    "url": "https://politie-forum.nl/",
    "name": "Politie Forum Nederland | Discussie, Nieuws & Inzichten over Veiligheid en Justitie",
    "isPartOf": { "@id": "https://politie-forum.nl/#website" },
    "about": { "@id": "https://politie-forum.nl/#organization" },
    "breadcrumb": { "@id": "https://politie-forum.nl/#breadcrumb" },
    "datePublished": "2020-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "nl-NL",
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "url": "https://politie-forum.nl/og/politie-forum-1200x630.png",
      "width": 1200,
      "height": 630
    },
    "potentialAction": [
      {
        "@type": "ReadAction",
        "target": "https://politie-forum.nl/"
      }
    ]
  };
}

/**
 * Consolidate all homepage schemas into one unified graph
 * Prevents duplication, optimized for Google Rich Results
 */
export function generateCompleteHomepageSchema() {
  const baseSchema = generateBaseSchema();
  const faqSchema = generateFAQSchema();
  const howToVideoSchema = generateHowToVideoSchema();
  const webPageSchema = generateHomepageWebPageSchema();

  // Merge all graphs into one (no duplicate @context)
  const consolidatedGraph = [
    ...baseSchema["@graph"],
    webPageSchema,
    faqSchema,
    ...howToVideoSchema
  ];

  return {
    "@context": "https://schema.org",
    "@graph": consolidatedGraph
  };
}
