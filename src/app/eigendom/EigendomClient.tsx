"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function EigendomClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-6">
            Eigendom & Copyright
          </h1>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Intellectueel Eigendom
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Alle content op Politie Forum Nederland, inclusief maar niet beperkt tot tekst, 
              afbeeldingen, logo's, interface-elementen en software, is eigendom van Politie Forum 
              Nederland of haar content suppliers en wordt beschermd door Nederlandse en internationale 
              auteursrechtwetten.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Gebruikersinhoud
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Door content te plaatsen op het forum, behoudt u het auteursrecht op uw bijdragen. 
              U verleent Politie Forum Nederland echter een niet-exclusieve, wereldwijde, royaltyvrije 
              licentie om uw content te gebruiken, te verspreiden en weer te geven binnen het platform.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              Wat u wel mag:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Uw eigen content beheren (bewerken, verwijderen)</li>
              <li>Content citeren met bronvermelding</li>
              <li>Screenshots delen voor educatief gebruik</li>
              <li>Links plaatsen naar forumberichten</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              Wat u niet mag:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Complete foruminhoud kopiëren zonder toestemming</li>
              <li>Content doorverkopen of commercieel gebruiken</li>
              <li>Logo's of merknaam misbruiken</li>
              <li>Geautomatiseerd scrapen zonder expliciete toestemming</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Auteursrechtschending Melden
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Als u denkt dat uw auteursrecht is geschonden op ons platform, neem dan contact op via:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-800 font-semibold">Copyright Agent</p>
              <p className="text-gray-700">
                Email: <a href="mailto:copyright@politie-forum.nl" className="text-primary-600 hover:underline">
                  copyright@politie-forum.nl
                </a>
              </p>
              <p className="text-gray-700">
                Include: Uw contactgegevens, beschrijving van het werk, locatie van de schending, 
                en een verklaring te goeder trouw.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Data Eigendom & Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Uw persoonlijke gegevens blijven uw eigendom. Wij verzamelen en gebruiken deze alleen 
              zoals beschreven in ons{" "}
              <a href="/privacy" className="text-primary-600 hover:underline">
                Privacybeleid
              </a>. 
              U heeft te allen tijde recht op inzage, correctie en verwijdering van uw gegevens.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Licentie Open Source Software
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Onderdelen van dit platform maken gebruik van open source software onder verschillende 
              licenties (MIT, Apache 2.0, GPL). Deze licenties zijn niet van toepassing op de 
              platform-inhoud zelf, alleen op de onderliggende code.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              API & Data Toegang
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Commercieel gebruik van onze API of geautomatiseerde data-extractie is alleen toegestaan 
              met schriftelijke toestemming. Voor data-partnerschappen of research-toegang, neem contact 
              op via{" "}
              <a href="mailto:partnerships@politie-forum.nl" className="text-primary-600 hover:underline">
                partnerships@politie-forum.nl
              </a>.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Wijzigingen
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wij behouden ons het recht voor deze eigendomsverklaring te wijzigen. 
              Belangrijke wijzigingen worden aangekondigd via het forum en e-mail.
            </p>

            <div className="bg-blue-50 border-l-4 border-primary-600 p-4 mt-8">
              <p className="text-sm text-gray-700">
                <strong>Laatste update:</strong> 4 november 2025
              </p>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
