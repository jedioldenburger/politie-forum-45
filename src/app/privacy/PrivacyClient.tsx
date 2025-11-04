'use client';

import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useState } from 'react';

export default function PrivacyClient() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header onAuthClick={() => setIsAuthModalOpen(true)} />

      <main className="flex-grow bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-6">
              Privacy Verklaring
            </h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
                Laatst bijgewerkt: 8 oktober 2025
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Algemeen</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Politie Forum Nederland ("wij", "ons" of "onze") hecht grote waarde aan de
                bescherming van uw persoonsgegevens. In deze privacyverklaring leggen wij uit
                welke gegevens wij verzamelen en hoe wij deze gebruiken.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Welke gegevens verzamelen wij?</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Wij verzamelen de volgende soorten gegevens:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-6">
                <li><strong>Accountgegevens:</strong> E-mailadres, gebruikersnaam, wachtwoord (versleuteld)</li>
                <li><strong>Profielgegevens:</strong> Avatar, biografie, locatie (optioneel)</li>
                <li><strong>Gebruiksgegevens:</strong> Berichten, reacties, likes</li>
                <li><strong>Technische gegevens:</strong> IP-adres, browsertype, apparaatinformatie</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Waarvoor gebruiken wij uw gegevens?</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-6">
                <li>Het beheren van uw account</li>
                <li>Het mogelijk maken van forumfunctionaliteit</li>
                <li>Het verbeteren van onze diensten</li>
                <li>Het voorkomen van misbruik</li>
                <li>Het naleven van wettelijke verplichtingen</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Beveiliging</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Wij nemen passende technische en organisatorische maatregelen om uw
                persoonsgegevens te beschermen tegen verlies of onrechtmatige verwerking.
                Alle wachtwoorden worden versleuteld opgeslagen en communicatie verloopt
                via een beveiligde HTTPS-verbinding.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookies</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Wij gebruiken cookies voor authenticatie en om uw voorkeuren te onthouden.
                Door onze website te gebruiken, gaat u akkoord met ons gebruik van cookies.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Uw rechten</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                U heeft de volgende rechten met betrekking tot uw persoonsgegevens:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-6">
                <li>Recht op inzage</li>
                <li>Recht op correctie</li>
                <li>Recht op verwijdering</li>
                <li>Recht op beperking van verwerking</li>
                <li>Recht op dataportabiliteit</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Voor vragen over deze privacyverklaring of het uitoefenen van uw rechten,
                kunt u contact met ons opnemen:
              </p>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">📧 Contactgegevens</p>
                <div className="mt-2 text-primary-800 dark:text-primary-200 space-y-1">
                  <p><strong>Email:</strong> <a href="mailto:info@politie-forum.nl" className="hover:underline">info@politie-forum.nl</a></p>
                  <p><strong>Privacy:</strong> <a href="mailto:privacy@politie-forum.nl" className="hover:underline">privacy@politie-forum.nl</a></p>
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
