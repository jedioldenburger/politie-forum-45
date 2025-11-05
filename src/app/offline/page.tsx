"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-accent-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Je bent offline
        </h1>

        <p className="text-xl text-gray-300 mb-8">
          Deze pagina is niet beschikbaar zonder internetverbinding.
          Controleer je verbinding en probeer het opnieuw.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Probeer opnieuw
          </button>

          <Link
            href="/"
            className="block w-full bg-primary-700 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Terug naar homepage
          </Link>
        </div>

        <div className="mt-12 text-gray-400 text-sm">
          <p>
            Sommige pagina's zijn mogelijk beschikbaar in de cache.
            Gebruik de terug-knop om eerder bezochte pagina's te bekijken.
          </p>
        </div>
      </div>
    </div>
  );
}
