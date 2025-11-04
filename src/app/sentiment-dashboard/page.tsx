import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SentimentDashboard from '@/components/SentimentDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sentiment Dashboard - Emotionele Kaart van Nederland',
  description: 'Interactieve visualisatie van AI-gedetecteerde sentimenten in nieuwsartikelen, geaggregeerd per locatie. Ontdek de emotionele toon van Nederland.',
  keywords: ['sentiment analyse', 'AI', 'Nederland', 'nieuws', 'emoties', 'data visualisatie', 'politie'],
  openGraph: {
    title: 'Sentiment Dashboard - Politie Forum Nederland',
    description: 'Interactieve kaart met AI-sentiment analyse van nieuwsartikelen',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sentiment Dashboard - Emotionele Kaart van Nederland',
    description: 'AI-gedreven sentiment analyse van nieuwsartikelen',
  },
};

/**
 * 🗺️ SENTIMENT DASHBOARD PAGE
 *
 * Semantic layer visualization showing:
 * - Geographic sentiment distribution across Netherlands
 * - Emotional tone analysis by location
 * - Interactive D3.js visualization
 * - AI-detected sentiment aggregation
 *
 * Data source: ai_news Firestore collection (Menu 26 in news-rip.py)
 */
export default function SentimentDashboardPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-12">
          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🗺️ Sentiment Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              Visualisatie van AI-gedetecteerde sentimenten in nieuwsartikelen,
              geaggregeerd per locatie. Ontdek hoe verschillende regio's in Nederland
              emotioneel reageren op het nieuws.
            </p>
          </header>

          {/* Info Box */}
          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
              📊 Over deze Dashboard
            </h2>
            <ul className="space-y-2 text-blue-800 dark:text-blue-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>
                  <strong>AI-gedreven analyse:</strong> Elke artikel wordt automatisch geanalyseerd
                  op sentiment (positief/negatief/neutraal), emotionele toon en gedetecteerde emoties
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>
                  <strong>Locatie-gebaseerd:</strong> Sentimenten worden gekoppeld aan Nederlandse
                  steden en landmarks via AI-entity extractie
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>
                  <strong>Real-time updates:</strong> Dashboard wordt automatisch bijgewerkt wanneer
                  nieuwe artikelen worden verwerkt via de MCP pipeline (Menu 26)
                </span>
              </li>
            </ul>
          </div>

          {/* Dashboard Component */}
          <SentimentDashboard />

          {/* Technical Info */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🔧 Technische Details
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-700 dark:text-gray-300">Data Bron:</dt>
                <dd className="text-gray-600 dark:text-gray-400 mt-1">
                  Firestore <code className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">ai_news</code> collectie
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700 dark:text-gray-300">AI Model:</dt>
                <dd className="text-gray-600 dark:text-gray-400 mt-1">
                  Groq Llama 3.3 70B Versatile
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700 dark:text-gray-300">Visualisatie:</dt>
                <dd className="text-gray-600 dark:text-gray-400 mt-1">
                  D3.js v7 met SVG rendering
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700 dark:text-gray-300">Update Frequentie:</dt>
                <dd className="text-gray-600 dark:text-gray-400 mt-1">
                  Real-time via Firebase listeners
                </dd>
              </div>
            </dl>
          </div>

          {/* How to Use */}
          <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-3">
              💡 Hoe te gebruiken
            </h3>
            <ol className="space-y-2 text-green-800 dark:text-green-300 list-decimal list-inside">
              <li>Hover over een cirkel om details te zien (locatie, sentiment score, dominante toon)</li>
              <li>Cirkelgrootte geeft het aantal artikelen weer per locatie</li>
              <li>Kleur toont gemiddelde sentiment: rood = negatief, geel = neutraal, groen = positief</li>
              <li>Bekijk de tabel onderaan voor gedetailleerde statistieken per locatie</li>
              <li>Filter op emoties en datum range (coming soon)</li>
            </ol>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
