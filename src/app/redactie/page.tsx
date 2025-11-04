import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redactie",
  description: "Over de redactie van Politie Forum Nederland - ervaren journalisten en experts op het gebied van politie, veiligheid en criminaliteit.",
  alternates: {
    canonical: "https://politie-forum.nl/redactie",
  },
  openGraph: {
    title: "Redactie | Politie Forum Nederland",
    description: "Ervaren redactieteam gespecialiseerd in politie, veiligheid en justitiezaken",
    url: "https://politie-forum.nl/redactie",
    type: "profile",
  },
};

export default function RedactiePage() {
  const profileSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ProfilePage", "WebPage"],
        "@id": "https://politie-forum.nl/redactie/#page",
        "url": "https://politie-forum.nl/redactie/",
        "name": "Politie Forum Redactie",
        "inLanguage": "nl-NL",
        "isPartOf": { "@id": "https://politie-forum.nl/#website" },
        "about": { "@id": "https://politie-forum.nl/#editor" },
        "mainEntity": { "@id": "https://politie-forum.nl/#editor" }
      },
      {
        "@type": "Person",
        "@id": "https://politie-forum.nl/#editor",
        "name": "P. Oldenburger",
        "jobTitle": "Hoofdredacteur",
        "worksFor": { "@id": "https://politie-forum.nl/#publisher" },
        "url": "https://politie-forum.nl/redactie/",
        "sameAs": [
          "https://www.linkedin.com/in/jedioldenburger/"
        ],
        "knowsAbout": [
          "Nederlandse Politie",
          "Criminaliteitsanalyse",
          "Veiligheidszaken",
          "Justitie & Rechtspraak"
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema, null, 0) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          {/* Author Profile Header */}
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Politie Forum Redactie
              </h1>
              <p className="text-lg text-primary-600 dark:text-primary-400 font-semibold mb-3">
                Hoofdredacteur
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Ervaren redactieteam gespecialiseerd in politie, veiligheid en justitiezaken
                met jarenlange expertise in Nederlandse criminaliteitsanalyse.
              </p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white">
              Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
                  🚓 Nederlandse Politie
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Uitgebreide kennis van de politieorganisatie, procedures en wetgeving
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
                  📊 Criminaliteitsanalyse
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Data-gedreven inzichten in criminaliteitstrends en -patronen
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
                  🛡️ Veiligheidszaken
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Specialisatie in openbare orde, veiligheidsbeleid en risicomanagement
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
                  ⚖️ Justitie & Rechtspraak
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Kennis van het Nederlandse rechtssysteem en strafrechtketen
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white">
              Redactionele Standaard
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Onze redactie hanteert strikte journalistieke principes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-6">
              <li><strong>Nauwkeurigheid:</strong> Feiten worden geverifieerd via meerdere bronnen</li>
              <li><strong>Objectiviteit:</strong> Nieuws wordt onpartijdig en zonder bias gepresenteerd</li>
              <li><strong>Transparantie:</strong> Bronnen worden waar mogelijk vermeld</li>
              <li><strong>Actualiteit:</strong> 24/7 monitoring van politienieuws en ontwikkelingen</li>
              <li><strong>Expertise:</strong> Jarenlange ervaring in politie- en veiligheidsjournalistiek</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white">
              Publicaties
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              De redactie publiceert dagelijks artikelen over:
            </p>
            <div className="grid grid-cols-1 gap-3 mb-8">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <span className="text-2xl">📰</span>
                <span className="text-slate-700 dark:text-slate-300">Actueel politienieuws uit heel Nederland</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <span className="text-2xl">🔍</span>
                <span className="text-slate-700 dark:text-slate-300">Diepte-analyses van grote onderzoeken</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <span className="text-2xl">📈</span>
                <span className="text-slate-700 dark:text-slate-300">Criminaliteitsstatistieken en trends</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <span className="text-2xl">⚡</span>
                <span className="text-slate-700 dark:text-slate-300">Breaking news en live updates</span>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white">
              Contact
            </h2>
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Voor persberichten, tips of vragen kunt u contact opnemen met de redactie:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href="mailto:info@politie-forum.nl"
                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    info@politie-forum.nl
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a
                    href="tel:+31648319167"
                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    +31 6 48319167
                  </a>
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm mt-4">
                  <p className="font-semibold mb-2">Postadres:</p>
                  <p>
                    Politie Forum Nederland<br />
                    Sint Olofssteeg 4<br />
                    1012AK Amsterdam<br />
                    Netherlands
                  </p>
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm mt-3">
                  <p>
                    <strong>Publisher:</strong>{" "}
                    <a href="https://digestpaper.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                      DigestPaper.com
                    </a>
                  </p>
                  <p className="mt-1">
                    <strong>Hoofdredacteur:</strong>{" "}
                    <a href="https://www.linkedin.com/in/jedioldenburger/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                      P. Oldenburger
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <a
                href="https://x.com/politieforum"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter/X
              </a>
              <a
                href="https://linkedin.com/company/politie-forum"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
