import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import addOnService from '../../services/addOnService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const categories = ['All', 'Flowers', 'Food & Snacks', 'Decor', 'Return Gifts', 'Lighting', 'Furniture', 'Tableware', 'Props'];

const categoryIcons = {
  'Flowers': '🌸',
  'Food & Snacks': '🍽️',
  'Decor': '🎨',
  'Return Gifts': '🎁',
  'Lighting': '💡',
  'Furniture': '🪑',
  'Tableware': '🍴',
  'Props': '🎭',
};

const categoryColors = {
  'Flowers': { bg: '#fce7f3', fg: '#ec4899', gradient: 'from-pink-400 to-rose-500' },
  'Food & Snacks': { bg: '#fef3c7', fg: '#f59e0b', gradient: 'from-amber-400 to-orange-500' },
  'Decor': { bg: '#ede9fe', fg: '#8b5cf6', gradient: 'from-violet-400 to-purple-500' },
  'Return Gifts': { bg: '#dcfce7', fg: '#22c55e', gradient: 'from-green-400 to-emerald-500' },
  'Lighting': { bg: '#fef9c3', fg: '#eab308', gradient: 'from-yellow-400 to-amber-500' },
  'Furniture': { bg: '#dbeafe', fg: '#3b82f6', gradient: 'from-blue-400 to-indigo-500' },
  'Tableware': { bg: '#e0e7ff', fg: '#6366f1', gradient: 'from-indigo-400 to-blue-500' },
  'Props': { bg: '#ffe4e6', fg: '#f43f5e', gradient: 'from-rose-400 to-red-500' },
};

export default function AddOns() {
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { addItem, items } = useCart();

  useEffect(() => {
    fetchAddOns();
  }, []);

  const fetchAddOns = async () => {
    try {
      const data = await addOnService.getAddOns({ limit: 100 });
      setAddOns(data.addOns);
    } catch {
      toast.error('Failed to load add-ons');
    } finally {
      setLoading(false);
    }
  };

  const filtered = addOns.filter(a => {
    const matchCategory = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getItemQty = (id) => {
    const cartItem = items.find(i => i._id === id);
    return cartItem ? cartItem.quantity : 0;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Event Add-Ons</h1>
          <p className="text-gray-600">Customize your event with flowers, food, decor, and more</p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder="Search add-ons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              {cat !== 'All' && <span className="mr-1">{categoryIcons[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* Add-Ons Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No add-ons found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(addOn => (
              <div key={addOn._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={addOn.image}
                    alt={addOn.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const colors = categoryColors[addOn.category] || { bg: '#f3f4f6', fg: '#6b7280', gradient: 'from-gray-400 to-gray-500' };
                      const icon = categoryIcons[addOn.category] || '✨';
                      e.target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${colors.fg};stop-opacity:0.9"/><stop offset="100%" style="stop-color:${colors.fg};stop-opacity:0.6"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><text x="200" y="130" font-size="48" text-anchor="middle" fill="white">${icon}</text><text x="200" y="180" font-size="16" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="bold">${addOn.name || ''}</text><text x="200" y="210" font-size="13" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="sans-serif">${addOn.category || ''}</text></svg>`)}`;
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-orange-700">
                    {categoryIcons[addOn.category]} {addOn.category}
                  </span>
                  {!addOn.inStock && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{addOn.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{addOn.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-orange-600">₹{addOn.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 ml-1">/ {addOn.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getItemQty(addOn._id) > 0 && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                          ×{getItemQty(addOn._id)} in cart
                        </span>
                      )}
                      <button
                        onClick={() => addItem(addOn)}
                        disabled={!addOn.inStock}
                        className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
