import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nieuwstips & Meldingen",
  description: "Anonieme nieuwstips, meldingen en informatie doorgeven aan de redactie van Politie Forum Nederland. Veilig en vertrouwelijk.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://politie-forum.nl/tips",
  },
};

export default function TipsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nieuwstips & Meldingen
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Deel anoniem informatie met de redactie
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Heb je een nieuwstip?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Bij Politie Forum Nederland nemen we tips en meldingen serieus. 
              Of het nu gaat om interessante ontwikkelingen in de veiligheidssector, 
              misstanden of nieuwswaardige gebeurtenissen — jouw input wordt vertrouwelijk behandeld.
            </p>
            <div className="bg-accent-50 dark:bg-accent-900/20 border-l-4 border-accent-500 p-4 mb-4">
              <p className="text-accent-900 dark:text-accent-300 font-semibold">
                ⚠️ Voor acute noodsituaties: bel 112
              </p>
              <p className="text-accent-800 dark:text-accent-400 text-sm mt-1">
                Voor misdrijven: bel 0900-8844 (politie) of gebruik M (Meld Misdaad Anoniem): 0800-7000
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Contact opties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg">
                <div className="text-3xl mb-3">📧</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  E-mail (vertrouwelijk)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                  Stuur ons een e-mail met je tip of melding
                </p>
                <a 
                  href="mailto:tips@politie-forum.nl" 
                  className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                >
                  tips@politie-forum.nl
                </a>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  WhatsApp Tip Lijn
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                  Anonieme tips via WhatsApp
                </p>
                <a 
                  href="https://wa.me/31648319167" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                >
                  +31 6 48319167
                </a>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg">
                <div className="text-3xl mb-3">🔐</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  PGP Versleuteld
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                  Voor extra veilige communicatie
                </p>
                <a 
                  href="/pgp-public-key.asc" 
                  className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                  download
                >
                  Download PGP-sleutel
                </a>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg">
                <div className="text-3xl mb-3">📝</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Direct Contact
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                  Voor spoedeisende tips
                </p>
                <a 
                  href="mailto:redactie@politie-forum.nl" 
                  className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                >
                  redactie@politie-forum.nl
                </a>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Wat kun je melden?
            </h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">✓</span>
                <span>Interessante ontwikkelingen in de veiligheidssector</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">✓</span>
                <span>Misstanden bij politie, justitie of handhaving</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">✓</span>
                <span>Nieuwswaardige criminaliteitsontwikkelingen</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">✓</span>
                <span>Relevante documenten of bronnenmateriaal</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">✓</span>
                <span>Ervaringen met politie, rechtspraak of veiligheid</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3">✓</span>
                <span>Suggesties voor onderzoeksjournalistiek</span>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Jouw privacy & veiligheid
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-start">
                <div className="text-2xl mr-3">🔒</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Volledige anonimiteit
                  </h3>
                  <p className="text-sm">
                    Je hoeft geen persoonlijke gegevens te delen. Alle tips kunnen anoniem worden ingediend.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-2xl mr-3">🛡️</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Vertrouwelijkheid gegarandeerd
                  </h3>
                  <p className="text-sm">
                    Alle meldingen worden vertrouwelijk behandeld. We delen geen brongegevens zonder toestemming.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-2xl mr-3">🔐</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Veilige communicatie
                  </h3>
                  <p className="text-sm">
                    Voor gevoelige informatie adviseren we PGP-versleuteling of onze beveiligde WhatsApp-lijn.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Wat gebeurt er met je tip?
            </h2>
            <ol className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm font-bold">1</span>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Ontvangst & beoordeling:</span>
                  {" "}Onze redactie bekijkt elke tip binnen 24 uur
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm font-bold">2</span>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Verificatie:</span>
                  {" "}We controleren de informatie via meerdere bronnen
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm font-bold">3</span>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Publicatie:</span>
                  {" "}Bij nieuwswaarde publiceren we een artikel (altijd zonder bronvermelding)
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm font-bold">4</span>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Follow-up:</span>
                  {" "}We kunnen contact opnemen voor aanvullende vragen (alleen als je dat wilt)
                </div>
              </li>
            </ol>
          </section>
        </div>

        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Meer informatie
          </h3>
          <div className="space-y-2">
            <Link href="/redactionele-principes" className="block text-primary-600 dark:text-primary-400 hover:underline">
              Redactionele principes
            </Link>
            <Link href="/privacy" className="block text-primary-600 dark:text-primary-400 hover:underline">
              Privacy & gegevensbescherming
            </Link>
            <Link href="/contact" className="block text-primary-600 dark:text-primary-400 hover:underline">
              Algemeen contact
            </Link>
            <Link href="/" className="block text-primary-600 dark:text-primary-400 hover:underline">
              Terug naar homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
