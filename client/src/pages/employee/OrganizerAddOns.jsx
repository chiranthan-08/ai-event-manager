import { useState, useEffect, useMemo } from 'react';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import addOnService from '../../services/addOnService';
import toast from 'react-hot-toast';

const categoryIcons = {
  'Flowers': '\uD83C\uDF38', 'Food & Snacks': '\uD83C\uDF7D\uFE0F', 'Decor': '\uD83C\uDFA8', 'Return Gifts': '\uD83C\uDF81',
  'Lighting': '\uD83D\uDCA1', 'Furniture': '\uD83E\uDE91', 'Tableware': '\uD83C\uDF74', 'Props': '\uD83C\uDFAD',
};

const categories = ['All', 'Flowers', 'Food & Snacks', 'Decor', 'Return Gifts', 'Lighting', 'Furniture', 'Tableware', 'Props'];

export default function OrganizerAddOns() {
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchAddOns();
  }, []);

  const fetchAddOns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await addOnService.getAddOns({ limit: 100 });
      setAddOns(data.addOns || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load add-ons');
    } finally {
      setLoading(false);
    }
  };

  const filteredAddOns = useMemo(() => {
    return addOns.filter((a) => {
      const q = localSearch.toLowerCase();
      const matchCat = categoryFilter === 'All' || a.category === categoryFilter;
      const matchSearch =
        !localSearch ||
        a.name.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [addOns, localSearch, categoryFilter]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add-Ons</h1>
        <p className="text-gray-500 mt-1">Browse available add-on products and services for events</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`p-3 rounded-xl border-2 text-center transition-all ${
              categoryFilter === cat
                ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                : 'border-gray-200 hover:border-emerald-300'
            }`}
          >
            <span className="text-2xl">{cat === 'All' ? '\uD83D\uDCE6' : (categoryIcons[cat] || '\uD83D\uDCE6')}</span>
            <p className="text-xs font-semibold text-gray-700 mt-1">{cat}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search add-ons..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 mb-3">{error}</p>
          <button onClick={fetchAddOns} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : filteredAddOns.length === 0 ? (
        <EmptyState message="No add-ons found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAddOns.map((addOn) => (
            <div key={addOn._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <img
                  src={addOn.image}
                  alt={addOn.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const colors = { 'Flowers': '#ec4899', 'Food & Snacks': '#f59e0b', 'Decor': '#8b5cf6', 'Return Gifts': '#22c55e', 'Lighting': '#eab308', 'Furniture': '#3b82f6', 'Tableware': '#6366f1', 'Props': '#f43f5e' };
                    const icons = { 'Flowers': '🌸', 'Food & Snacks': '🍽️', 'Decor': '🎨', 'Return Gifts': '🎁', 'Lighting': '💡', 'Furniture': '🪑', 'Tableware': '🍴', 'Props': '🎭' };
                    const c = colors[addOn.category] || '#6b7280';
                    const i = icons[addOn.category] || '📦';
                    e.target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="${c}"/><text x="200" y="130" font-size="48" text-anchor="middle" fill="white">${i}</text><text x="200" y="180" font-size="14" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="bold">${addOn.name}</text><text x="200" y="205" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="sans-serif">${addOn.category}</text></svg>`)}`;
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{addOn.name}</h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${addOn.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {addOn.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full capitalize mb-2">
                  {categoryIcons[addOn.category]} {addOn.category}
                </span>
                {addOn.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{addOn.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-emerald-600">{'\u20B9'}{(addOn.price || 0).toLocaleString()}</span>
                  <span className="text-xs text-gray-400">{addOn.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
