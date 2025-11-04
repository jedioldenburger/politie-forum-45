'use client';

import AuthModal from "@/components/AuthModal";
import Filters from '@/components/Filters';
import Header from "@/components/Header";
import { Crime } from '@/utils/types';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Dynamic import to avoid SSR issues with Leaflet
const CrimeMap = dynamic(() => import('@/components/CrimeMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl shadow-md p-6 h-[700px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Kaart laden...</p>
      </div>
    </div>
  ),
});

export default function CrimeMapClient() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [allCrimes, setAllCrimes] = useState<Crime[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [filters, setFilters] = useState({ category: '', region: '', period: '30d' });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, any>>({});

  // Fetch metadata on mount
  useEffect(() => {
    fetch('/api/crimes/metadata')
      .then(r => r.json())
      .then(data => {
        setCategories(data.categories || []);
        setRegions(data.regions || []);
        setStats(data.stats || {});
      })
      .catch(err => {
        console.error('Failed to load metadata', err);
      });
  }, []);

  // Fetch all crimes for total count
  useEffect(() => {
    fetch('/api/crimes?period=all')
      .then(r => r.json())
      .then((data: Crime[]) => {
        setAllCrimes(data);
      })
      .catch(err => {
        console.error('Failed to load all crimes', err);
      });
  }, []);

  // Fetch filtered crimes (includes news articles synced via Python menu 17)
  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (filters.category) q.set('category', filters.category);
    if (filters.region) q.set('region', filters.region);
    if (filters.period) q.set('period', filters.period);

    fetch(`/api/crimes?${q.toString()}`)
      .then(r => r.json())
      .then((data: Crime[]) => {
        setCrimes(data);
        setLoading(false);
        console.log(`� Loaded ${data.length} items from Crime Map database`);
      })
      .catch(err => {
        console.error('Failed to load crimes', err);
        setLoading(false);
      });
  }, [filters]);

  return (
    <>
      <Header
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Page Header */}
        <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Terug naar Forum
              </Link>
              <h1 className="text-4xl font-bold mb-2">Interactieve Kaart Nederland</h1>
              <p className="text-primary-100 text-lg">Nieuws en meldingen op de kaart van Nederland</p>
            </div>
          </div>
        </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Filters
          categories={categories}
          regions={regions}
          selected={filters}
          onChange={setFilters}
          stats={{ total: allCrimes.length, filtered: crimes.length }}
        />

        {/* Map */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-6 h-[700px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Crime Map data laden...</p>
            </div>
          </div>
        ) : (
          <CrimeMap crimes={crimes} />
        )}

        {/* Statistics Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Totaal op kaart</p>
                <p className="text-2xl font-bold text-gray-900">{crimes.length.toLocaleString('nl-NL')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-accent-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Artikel locaties</p>
                <p className="text-2xl font-bold text-gray-900">{allCrimes.length.toLocaleString('nl-NL')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <span className="text-2xl">📰</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Met filters</p>
                <p className="text-2xl font-bold text-gray-900">{crimes.length.toLocaleString('nl-NL')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Lees de volledige artikelen op het forum</h3>
          <p className="text-primary-100 mb-6">
            Bekijk alle nieuwsartikelen en discussieer mee op het Politie Forum Nederland
          </p>
          <Link
            href="/forum"
            className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Naar het Forum
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
