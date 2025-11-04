"use client";

import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";

export default function OverClient() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Header onAuthClick={() => setIsAuthModalOpen(true)} />

      <main className="flex-grow bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-6">
              Over DigestPaper - AI-Gedreven Nieuws Automatisering
            </h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 rounded-lg p-6 mb-8 border-l-4 border-primary-600">
                <h2 className="text-2xl font-semibold mb-4 text-primary-900 dark:text-white">🚀 Innovatieve AI Startup</h2>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>DigestPaper.com</strong> is een cutting-edge AI startup gevestigd in Amsterdam die de toekomst
                  van journalistiek vormgeeft door middel van <strong>geautomatiseerde nieuwsgeneratie</strong>.
                  Wij ontwikkelen en exploiteren geavanceerde <strong>MCP (Model Context Protocol) servers</strong> -
                  de nieuwe standaard voor AI-infrastructuur die Large Language Models verbindt met real-time databronnen.
                </p>
              </div>

              <h2 className="text-3xl font-bold mt-12 mb-6 text-primary-900 dark:text-white">🤖 Wat is een MCP Server?</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Het <strong>Model Context Protocol (MCP)</strong> is een revolutionaire open standaard ontwikkeld door Anthropic
                die AI-systemen (zoals Claude, GPT-4, Gemini) in staat stelt om veilig en efficiënt te communiceren met externe
                data sources, tools en API's. DigestPaper exploiteert een netwerk van gespecialiseerde MCP servers die:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-slate-300 ml-4">
                <li><strong>Real-time nieuwsbronnen monitoren</strong> - RSS feeds, API's, officiële persdiensten (Politie.nl, OM.nl, etc.)</li>
                <li><strong>Content automatisch verwerken</strong> - Extractie, normalisatie, fact-checking, sentiment analyse</li>
                <li><strong>AI-gegenereerde artikelen produceren</strong> - Via Groq, OpenAI, Anthropic Claude met journalistieke kwaliteitscontrole</li>
                <li><strong>Multi-platform distributie</strong> - Simultaan publiceren naar 8+ websites in ons content-netwerk</li>
                <li><strong>SEO & schema optimalisatie</strong> - Automatische JSON-LD, metadata, geo-tagging, categorisatie</li>
                <li><strong>Community integratie</strong> - Discussie-threads, comment moderatie, user engagement</li>
              </ul>

              <h2 className="text-3xl font-bold mt-12 mb-6 text-primary-900 dark:text-white">🛡️ Cybersecurity & Veiligheidsjournalistiek</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                DigestPaper specialiseert zich in <strong>cybersecurity intelligence</strong> en <strong>veiligheidsjournalistiek</strong>.
                Onze AI-systemen analyseren dagelijks duizenden bronnen om actueel, betrouwbaar en diepgaand nieuws te leveren over:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">🔐 Cybersecurity</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Datalekken, ransomware, zero-day exploits, APT-groepen, security advisories, CVE-tracking
                  </p>
                </div>
                <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-accent-900 dark:text-accent-100 mb-2">🚔 Politie & Justitie</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Misdaadtrends, politieoperaties, rechtbankzaken, wet- en regelgeving, veiligheidsbeleid
                  </p>
                </div>
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">🌍 Crime Intelligence</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Georganiseerde misdaad, fraude, witwassen, internationale samenwerking, Europol/Interpol
                  </p>
                </div>
                <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-accent-900 dark:text-accent-100 mb-2">📊 Data & Analyse</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Crime statistics, trend analysis, predictive policing, geo-mapping, threat assessment
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold mt-12 mb-6 text-primary-900 dark:text-white">🌐 Ons Content Netwerk</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                DigestPaper exploiteert een ecosysteem van <strong>8 gespecialiseerde nieuwsplatforms</strong>,
                elk gericht op specifieke doelgroepen en thema's. Alle platforms worden aangestuurd door onze centrale
                MCP server-infrastructuur:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 mb-6">
                <ol className="space-y-3 text-slate-700 dark:text-slate-300">
                  <li><strong>1. Politie-Forum.nl</strong> - Community & discussieplatform voor politieprofessionals en geïnteresseerden (10.000+ leden sinds 2020)</li>
                  <li><strong>2. CyberSecurityAD.com</strong> - Enterprise cybersecurity nieuws, threat intelligence, security advisories</li>
                  <li><strong>3. Politie-NL.nl</strong> - Actueel politienieuws, operaties, persberichten van Nederlandse politie</li>
                  <li><strong>4. OnderzoekPortaal.nl</strong> - Onderzoeksjournalistiek, long-reads, diepgaande analyses</li>
                  <li><strong>5. OnderzoekPlatform.nl</strong> - Juridisch nieuws, rechtbankverslaggeving, wetgeving</li>
                  <li><strong>6. HeadlinesMagazine.com</strong> - International breaking news, geopolitiek, security</li>
                  <li><strong>7. HetNieuws.app</strong> - Mobiele news aggregator, push notifications, personalisatie</li>
                  <li><strong>8. Cybersecurity-AI.eu</strong> - Europees cybersecurity platform, AI governance, tech policy</li>
                </ol>
              </div>

              <h2 className="text-3xl font-bold mt-12 mb-6 text-primary-900 dark:text-white">⚡ Technologie Stack</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Onze AI-gedreven infrastructuur combineert cutting-edge technologieën voor maximale performance en betrouwbaarheid:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
                  <h3 className="font-bold text-primary-900 dark:text-primary-100 mb-3">🧠 AI Models</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Groq Llama 3.3 70B (ultra-fast)</li>
                    <li>• OpenAI GPT-4o (reasoning)</li>
                    <li>• Anthropic Claude 3.5 (analysis)</li>
                    <li>• Google Gemini Pro (multilingual)</li>
                  </ul>
                </div>
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
                  <h3 className="font-bold text-primary-900 dark:text-primary-100 mb-3">🔧 Infrastructure</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Next.js 15 + React 19</li>
                    <li>• Firebase (Firestore + Realtime DB)</li>
                    <li>• Vercel Edge deployment</li>
                    <li>• TypeScript + Python pipelines</li>
                  </ul>
                </div>
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
                  <h3 className="font-bold text-primary-900 dark:text-primary-100 mb-3">📡 MCP Protocols</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• RSS feed processors</li>
                    <li>• API integrators (REST/GraphQL)</li>
                    <li>• Database connectors</li>
                    <li>• Custom tool servers</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-3xl font-bold mt-12 mb-6 text-primary-900 dark:text-white">🎯 Onze Missie</h2>
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg p-8 mb-8">
                <p className="text-xl leading-relaxed mb-4">
                  <strong>DigestPaper democratiseert toegang tot hoogwaardige journalistiek</strong> door AI-automatisering
                  in te zetten waar het het meest effectief is: <em>data-verzameling, fact-checking en content-distributie</em>.
                </p>
                <p className="text-lg leading-relaxed opacity-90">
                  We geloven dat AI-journalistiek niet draait om het vervangen van mensen, maar om het <strong>augmenteren
                  van menselijke expertise</strong>. Onze systemen verwerken duizenden bronnen per dag, maar elke publicatie
                  doorloopt redactionele kwaliteitscontroles, fact-checking procedures en ethische guidelines.
                </p>
              </div>

              <h2 className="text-3xl font-bold mt-12 mb-6 text-primary-900 dark:text-white">📈 Impact & Statistieken (2020-2025)</h2>
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 text-center border-t-4 border-primary-600">
                  <div className="text-3xl font-bold text-primary-900 dark:text-primary-100">500K+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Artikelen gepubliceerd (2020-2025)</div>
                </div>
                <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-4 text-center border-t-4 border-accent-600">
                  <div className="text-3xl font-bold text-accent-900 dark:text-accent-100">2.5M+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Maandelijkse pageviews (Q4 2024)</div>
                </div>
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 text-center border-t-4 border-primary-600">
                  <div className="text-3xl font-bold text-primary-900 dark:text-primary-100">15K+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Actieve community-leden (gecombineerd)</div>
                </div>
                <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-4 text-center border-t-4 border-accent-600">
                  <div className="text-3xl font-bold text-accent-900 dark:text-accent-100">8</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Specialistische platforms</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 italic mb-8">
                * Statistieken gemeten via Google Analytics en Firebase Analytics over gehele netwerk.
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-6 text-primary-900 dark:text-white">👥 Team & Leiderschap</h2>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    PO
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-1">
                      P. Oldenburger
                      <a href="https://www.linkedin.com/in/jedioldenburger/" target="_blank" rel="noopener noreferrer" className="ml-2 text-primary-600 dark:text-primary-400 hover:underline text-base font-normal">
                        LinkedIn →
                      </a>
                    </h3>
                    <p className="text-sm text-accent-600 dark:text-accent-400 font-semibold mb-2">Founder & Chief Technology Officer</p>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      Technisch architect achter DigestPaper's MCP server-infrastructuur. Gespecialiseerd in AI/ML engineering,
                      distributed systems en automated journalism. Voorheen actief in cybersecurity research en defensie-gerelateerde
                      AI-projecten. Visie: "Democratiseren van hoogwaardige journalistiek via open-source AI-infrastructuur."
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold mt-12 mb-6 text-primary-900 dark:text-white">🔮 Toekomstvisie</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                DigestPaper werkt aan de volgende generatie AI-journalistieke tools:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-8 text-slate-700 dark:text-slate-300 ml-4">
                <li><strong>Open-source MCP servers</strong> - Gratis MCP servers voor journalisten, researchers en developers</li>
                <li><strong>Real-time fact-checking API</strong> - Geautomatiseerde verificatie van claims tegen 1000+ databronnen</li>
                <li><strong>Multi-language expansion</strong> - Uitbreiding naar Engels, Duits, Frans (EU-brede coverage)</li>
                <li><strong>AI-powered investigative tools</strong> - Document analysis, relationship mapping, leak verification</li>
                <li><strong>Blockchain-verified sources</strong> - Cryptografische verificatie van artikelbronnen en timestamps</li>
                <li><strong>Community-driven moderation</strong> - Distributed fact-checking via blockchain consensus</li>
              </ul>

              <div className="bg-gradient-to-r from-accent-50 to-primary-50 dark:from-accent-900/30 dark:to-primary-900/30 rounded-lg p-8 mb-8 border border-accent-200 dark:border-accent-800">
                <h3 className="text-2xl font-bold text-primary-900 dark:text-white mb-4" id="bronnen">📡 Officiële Bronnen & Netwerk</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Wij monitoren nieuwsbronnen van officiële instanties en maken deel uit van het DigestPaper-netwerk:
                </p>
                <div className="grid md:grid-cols-2 gap-3 text-sm mb-6">
                  <div>
                    <p className="font-semibold text-primary-900 dark:text-primary-100 mb-1">🏛️ Bronkanalen (RSS/API's):</p>
                    <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                      <li>• Politie Nederland (RSS feeds)</li>
                      <li>• Openbaar Ministerie (persberichten)</li>
                      <li>• Rijksoverheid (officiële publicaties)</li>
                      <li>• NU.nl, NOS, andere nieuwsmedia</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-primary-900 dark:text-primary-100 mb-1">🤝 Tech-infrastructuur:</p>
                    <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                      <li>• Anthropic (MCP protocol)</li>
                      <li>• Groq (AI inference)</li>
                      <li>• Vercel (hosting)</li>
                      <li>• Firebase (database)</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-accent-200 dark:border-accent-700 pt-6">
                  <h4 className="font-bold text-primary-900 dark:text-primary-100 mb-4">🌐 DigestPaper Netwerk (9 platforms)</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded p-3">
                      <p className="font-bold text-primary-900 dark:text-white">Politie-Forum.nl</p>
                      <p className="text-slate-600 dark:text-slate-400 italic">Forum & Nieuws over Politie en Veiligheid</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Interactief forum voor politie-nieuws, misdaad en veiligheid. Lees analyses en discussieer mee.</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded p-3">
                      <p className="font-bold text-primary-900 dark:text-white">Politie-NL.nl</p>
                      <p className="text-slate-600 dark:text-slate-400 italic">Onafhankelijk Nieuws over Politie & Justitie</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Onafhankelijke nieuwssite met focus op politie, justitie en opsporing. Dagelijks updates en analyses.</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded p-3">
                      <p className="font-bold text-primary-900 dark:text-white">OnderzoekPortaal.nl</p>
                      <p className="text-slate-600 dark:text-slate-400 italic">Investigative Journalism & Data Analysis</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Platform voor diepgaande onderzoeksjournalistiek en data-analyse. Transparante dossiers en feitenonderzoek.</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded p-3">
                      <p className="font-bold text-primary-900 dark:text-white">OnderzoekPlatform.nl</p>
                      <p className="text-slate-600 dark:text-slate-400 italic">Data Dossiers & Methodologies</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Uitgebreid platform met onderzoeksmethoden, datadossiers en achtergrondartikelen voor professionals.</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded p-3">
                      <p className="font-bold text-primary-900 dark:text-white">Cybersecurity-AI.eu</p>
                      <p className="text-slate-600 dark:text-slate-400 italic">Europees Platform voor Cybersecurity & AI</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Nieuws en analyses over cybersecurity, AI en digitale veiligheid. Europees platform met focus op onderzoek.</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded p-3">
                      <p className="font-bold text-primary-900 dark:text-white">DigestPaper.com</p>
                      <p className="text-slate-600 dark:text-slate-400 italic">Internationaal Journalistiek Platform</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Global news and analysis. Independent journalism with focus on transparency and international reporting.</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded p-3">
                      <p className="font-bold text-primary-900 dark:text-white">HeadlinesMagazine.com</p>
                      <p className="text-slate-600 dark:text-slate-400 italic">Digitale Long-Reads & Achtergronden</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Online magazine met diepgaande long-reads, verhalen en achtergrondartikelen over maatschappelijke thema's.</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded p-3">
                      <p className="font-bold text-primary-900 dark:text-white">HetNieuws.app</p>
                      <p className="text-slate-600 dark:text-slate-400 italic">Mobiele Nieuwsapp met Real-Time Alerts</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Nieuwsapp met push-notificaties, snelle updates en real-time alerts. Altijd actueel nieuws op je telefoon.</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded p-3">
                      <p className="font-bold text-primary-900 dark:text-white">CyberSecurityAD.com</p>
                      <p className="text-slate-600 dark:text-slate-400 italic">Cybersecurity Nieuws & Analyse</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Platform voor cybersecurity, digitale veiligheid en AI. Actuele analyses over cyberdreigingen en technologie.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 mb-8 border-l-4 border-primary-600" id="ai-policy">
                <h3 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">🤖 AI-Transparantie & -Beleid</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  DigestPaper gebruikt AI-technologie voor contentgeneratie en -verwerking. Onze AI-policy:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-4">
                  <li><strong>AI-inzet:</strong> Artikelen worden gegenereerd door Groq Llama 3.3 70B, OpenAI GPT-4o, of Anthropic Claude 3.5</li>
                  <li><strong>Menselijke eindredactie:</strong> Alle artikelen doorlopen fact-checking en kwaliteitscontrole</li>
                  <li><strong>AI-labeling:</strong> AI-gegenereerde content wordt gelabeld met badge "AI-ondersteund" waar van toepassing</li>
                  <li id="correcties"><strong>Correctieproces:</strong> Fouten worden binnen 24 uur gecorrigeerd met zichtbare correctie-notitie aan begin van artikel</li>
                  <li id="factcheck"><strong>Fact-checking:</strong> Alle claims worden geverifieerd tegen officiële bronnen (Politie.nl, OM.nl, overheidsdata)</li>
                  <li id="bronbeleid"><strong>Bronvermelding:</strong> Alle artikelen vermelden oorspronkelijke bron met hyperlink. Anonieme bronnen alleen na verificatie door eindredactie</li>
                  <li id="ethiek"><strong>Ethiek:</strong> Geen misleidende headlines, geen clickbait, geen sensationalisering van slachtoffers, respect voor privacy</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Voor vragen over AI-gebruik of om een correctie door te geven: <a href="mailto:info@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">info@politie-forum.nl</a>
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 mb-8" id="eigendom">
                <h3 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">🏢 Eigendom & Financiering</h3>
                <div className="space-y-3 text-slate-700 dark:text-slate-300">
                  <p><strong>Uitgever:</strong> DigestPaper B.V.</p>
                  <p><strong>KvK-nummer:</strong> [Wordt toegevoegd]</p>
                  <p><strong>BTW-nummer:</strong> [Wordt toegevoegd]</p>
                  <p><strong>Vestigingsadres:</strong> Sint Olofssteeg 4, 1012AK Amsterdam</p>
                  <p><strong>Financiering:</strong> Onafhankelijk gefinancierd startup, geen externe investeerders. Inkomsten via advertenties en premium subscriptions.</p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Heb je vragen, suggesties of opmerkingen? Neem gerust contact met ons op:
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 mb-6">
                <li><strong>Email:</strong> <a href="mailto:info@politie-forum.nl" className="text-primary-600 hover:text-primary-700">info@politie-forum.nl</a></li>
                <li><strong>Telefoon:</strong> <a href="tel:+31648319167" className="text-primary-600 hover:text-primary-700">+31648319167</a></li>
                <li><strong>Adres:</strong> Sint Olofssteeg 4, 1012AK Amsterdam</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
