import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zoeken | Politie Forum Nederland',
  description: 'Zoekresultaten op Politie Forum Nederland',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Zoekresultaten</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        Deze pagina is uitgesloten van indexering om interne zoekresultaten niet in Google te tonen.
      </p>
      <form action="/zoeken" method="get" role="search" aria-label="Zoek in het forum" className="mb-8">
        <label htmlFor="search-q" className="block text-sm font-medium mb-1">Zoekterm</label>
        <input id="search-q" name="q" type="search" className="w-full border rounded px-3 py-2 mb-3 dark:bg-slate-800" placeholder="Zoek term..." />
        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded">Zoeken</button>
      </form>
      <div className="text-sm text-slate-500 dark:text-slate-400">Voer een zoekopdracht in om resultaten te zien.</div>
    </div>
  );
}
