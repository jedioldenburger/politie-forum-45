import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pers & Media",
  description: "Persinformatie, persberichten en mediacontact voor Politie Forum Nederland. Voor journalisten en media-aanvragen.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://politie-forum.nl/pers",
  },
};

export default function PersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pers & Media
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Persinformatie en mediacontact voor Politie Forum Nederland
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Over Politie Forum Nederland
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Politie Forum Nederland is het grootste Nederlandse online discussieplatform over 
              politie, veiligheid en justitie met meer dan 10.000 actieve leden. Sinds 2020 
              bieden wij een platform voor professionals, studenten en geïnteresseerden om 
              kennis te delen en te discussiëren over actuele veiligheidsonderwerpen.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">10.000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Actieve leden</div>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">50.000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Forum posts</div>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Nieuwsartikelen</div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Perscontact
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Algemene persaanvragen
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <a href="mailto:pers@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">
                    pers@politie-forum.nl
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Redactie
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <a href="mailto:redactie@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">
                    redactie@politie-forum.nl
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Hoofdredactie
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <a href="mailto:info@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">
                    info@politie-forum.nl
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Persmateriaal
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <a href="/logo.png" className="text-primary-600 dark:text-primary-400 hover:underline" download>
                  Download logo (PNG, 1024×1024)
                </a>
              </li>
              <li>
                <a href="/logo-full.png" className="text-primary-600 dark:text-primary-400 hover:underline" download>
                  Download volledig logo (PNG, 1920×1080)
                </a>
              </li>
              <li>
                <Link href="/over" className="text-primary-600 dark:text-primary-400 hover:underline">
                  Over ons pagina met volledige informatie
                </Link>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Voor journalisten
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Wij werken graag samen met journalisten en media voor interviews, 
              achtergrondgesprekken en samenwerkingsprojecten. Onze community bestaat uit:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Politieprofessionals en oud-agenten</li>
              <li>Studenten criminologie en rechten</li>
              <li>Forensische experts</li>
              <li>Veiligheidsspecialisten</li>
              <li>Juridische professionals</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Citeren & bronvermelding
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Bij het citeren van content van Politie Forum Nederland verzoeken wij u:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Bronvermelding: "Bron: Politie Forum Nederland (politie-forum.nl)"</li>
              <li>Link naar het originele artikel of discussie</li>
              <li>Respecteer de privacy van forumleden (gebruik geen echte namen zonder toestemming)</li>
            </ul>
          </section>
        </div>

        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Snelle links
          </h3>
          <div className="space-y-2">
            <Link href="/over" className="block text-primary-600 dark:text-primary-400 hover:underline">
              Over ons
            </Link>
            <Link href="/redactie" className="block text-primary-600 dark:text-primary-400 hover:underline">
              Redactie
            </Link>
            <Link href="/contact" className="block text-primary-600 dark:text-primary-400 hover:underline">
              Contact
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
