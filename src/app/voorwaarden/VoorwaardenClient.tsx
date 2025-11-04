'use client';

import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useState } from 'react';

export default function VoorwaardenClient() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header onAuthClick={() => setIsAuthModalOpen(true)} />

      <main className="flex-grow bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-6">
              Algemene Voorwaarden
            </h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
                Laatst bijgewerkt: 8 oktober 2025
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Definities</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                In deze algemene voorwaarden wordt verstaan onder:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-6">
                <li><strong>Platform:</strong> Politie Forum Nederland, bereikbaar via politie-forum.nl</li>
                <li><strong>Gebruiker:</strong> Elke persoon die het platform bezoekt of gebruikt</li>
                <li><strong>Lid:</strong> Gebruiker met een geregistreerd account</li>
                <li><strong>Content:</strong> Alle door gebruikers geplaatste berichten, reacties en media</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Toepasselijkheid</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Door gebruik te maken van het platform, accepteert u deze algemene voorwaarden.
                Wij behouden ons het recht voor om deze voorwaarden te wijzigen. Wijzigingen
                worden op deze pagina gepubliceerd.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Account aanmaken</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-6">
                <li>U moet minimaal 16 jaar oud zijn om een account aan te maken</li>
                <li>U bent verantwoordelijk voor het geheimhouden van uw wachtwoord</li>
                <li>Eén persoon mag slechts één account aanmaken</li>
                <li>Wij behouden ons het recht voor accounts te verwijderen bij misbruik</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Gedragsregels</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Het is niet toegestaan om:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-6">
                <li>Beledigende, discriminerende of haatdragende content te plaatsen</li>
                <li>Persoonlijke gegevens van anderen te delen zonder toestemming</li>
                <li>Spam, reclame of ongewenste commerciële berichten te plaatsen</li>
                <li>Zich voor te doen als een ander persoon of organisatie</li>
                <li>De wet te overtreden of aan te zetten tot illegale activiteiten</li>
                <li>Het platform of andere gebruikers te bedreigen of lastig te vallen</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectueel eigendom</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Door content te plaatsen op het platform, verleent u ons een niet-exclusieve
                licentie om deze content te gebruiken, reproduceren en distribueren binnen
                het platform. U blijft eigenaar van uw eigen content.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Aansprakelijkheid</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Wij zijn niet aansprakelijk voor schade die voortvloeit uit het gebruik
                van het platform of de door gebruikers geplaatste content. Het platform
                wordt aangeboden "as is" zonder garanties.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Moderatie</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Wij behouden ons het recht voor om content te verwijderen of bewerken die
                in strijd is met deze voorwaarden. Bij ernstige overtredingen kunnen wij
                gebruikers (tijdelijk) uitsluiten van het platform.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Account verwijderen</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                U kunt op elk moment uw account verwijderen via uw profielinstellingen.
                Na verwijdering worden uw persoonsgegevens gewist, maar kunnen uw berichten
                (geanonimiseerd) bewaard blijven voor de continuïteit van discussies.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Voor vragen over deze algemene voorwaarden kunt u contact met ons opnemen:
              </p>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">📧 Contactgegevens</p>
                <div className="mt-2 text-primary-800 dark:text-primary-200 space-y-1">
                  <p><strong>Email:</strong> <a href="mailto:info@politie-forum.nl" className="hover:underline">info@politie-forum.nl</a></p>
                  <p><strong>Telefoon:</strong> <a href="tel:+31648319167" className="hover:underline">+31 6 48319167</a></p>
                  <p><strong>Post:</strong> Politie Forum Nederland<br />Sint Olofssteeg 4<br />1012AK Amsterdam<br />Netherlands</p>
                  <p className="mt-2"><strong>Publisher:</strong> <a href="https://digestpaper.com" target="_blank" rel="noopener noreferrer" className="hover:underline">DigestPaper.com</a></p>
                  <p><strong>Redactie:</strong> <a href="https://www.linkedin.com/in/jedioldenburger/" target="_blank" rel="noopener noreferrer" className="hover:underline">P. Oldenburger</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
