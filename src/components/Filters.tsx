'use client';


interface FiltersProps {
  categories: string[];
  regions: string[];
  selected: { category: string; region: string; period: string };
  onChange: (sel: { category: string; region: string; period: string }) => void;
  stats?: {
    total: number;
    filtered: number;
  };
}

export default function Filters({ categories, regions, selected, onChange, stats }: FiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        {stats && (
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-primary-600">{stats.filtered.toLocaleString('nl-NL')}</span>
            {' van '}
            <span className="font-semibold">{stats.total.toLocaleString('nl-NL')}</span>
            {' meldingen'}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Misdaadtype
          </label>
          <select
            id="category-filter"
            value={selected.category}
            onChange={e => onChange({ ...selected, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="">Alle types</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label htmlFor="region-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Provincie
          </label>
          <select
            id="region-filter"
            value={selected.region}
            onChange={e => onChange({ ...selected, region: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="">Alle provincies</option>
            {regions.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Period Filter */}
        <div>
          <label htmlFor="period-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Periode
          </label>
          <select
            id="period-filter"
            value={selected.period}
            onChange={e => onChange({ ...selected, period: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="7d">Laatste 7 dagen</option>
            <option value="30d">Laatste 30 dagen</option>
            <option value="90d">Laatste 90 dagen</option>
            <option value="all">Alle tijd</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      {(selected.category || selected.region || selected.period !== '30d') && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onChange({ category: '', region: '', period: '30d' })}
            className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium hover:bg-primary-50 rounded-lg transition-colors"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
