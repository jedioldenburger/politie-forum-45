'use client';

import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from "next/link";
import { useState } from 'react';

export default function LedenClient() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header onAuthClick={() => setIsAuthModalOpen(true)} />

      <main className="flex-grow bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section - Politie Forum Registreren */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Word Lid van het Grootste Nederlands Politie Forum
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Registreer gratis en sluit je aan bij 10.000+ politieprofessionals, criminologie studenten, 
              aspirant agenten en geïnteresseerden. Dagelijks politie nieuws, sollicitatie tips en expert discussies.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Politie Community Netwerk</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Politie discussie met professionals, oud-agenten en experts uit alle regio's van Nederland. 
                Deel politie ervaringen en leer van collega's.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Politie Nieuws & Updates</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Dagelijks actueel politienieuws, breaking news over criminaliteit, rechtspraak en veiligheid. 
                24/7 politie updates en analyses.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Privacy & Veiligheid</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Jouw gegevens zijn veilig bij ons. Volledig AVG-compliant platform
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-xl p-12 text-center text-white mb-12">
            <h2 className="text-3xl font-bold mb-4">Gratis Registreren</h2>
            <p className="text-xl text-primary-100 mb-8">
              Registratie duurt slechts 2 minuten en is volledig gratis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-lg"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Registreer Nu
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-400 transition-colors text-lg border-2 border-white"
              >
                Al lid? Inloggen
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">10.000+</div>
              <div className="text-slate-600 dark:text-slate-400">Actieve Leden</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">50.000+</div>
              <div className="text-slate-600 dark:text-slate-400">Forum Posts</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">500+</div>
              <div className="text-slate-600 dark:text-slate-400">Artikelen</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">24/7</div>
              <div className="text-slate-600 dark:text-slate-400">Nieuws Updates</div>
            </div>
          </div>

          {/* Who Can Join - Politie Forum Aanmelden */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              Wie Kunnen Lid Worden van Politie Forum Nederland?
            </h2>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
              Politie forum registreren is gratis voor politieagenten, aspirant agenten, criminologie studenten, 
              journalisten en iedereen geïnteresseerd in politie, veiligheid en justitie.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Politiemedewerkers</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Actieve en gepensioneerde politieambtenaren uit alle regio's</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Studenten</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Criminologie, rechten, en politieacademie studenten</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Aspiranten</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sollicitanten voor politieopleidingen en stages</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Geïnteresseerden</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Iedereen met interesse in politie, veiligheid en justitie</p>
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
