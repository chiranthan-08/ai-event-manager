import { useState, useEffect } from 'react';
import { Palette, Search } from 'lucide-react';
import { getDecorations } from '../../services/decorationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';

const Decorations = () => {
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const categories = ['Lighting', 'Floral', 'Stage', 'Backdrop', 'Table', 'Other'];

  useEffect(() => {
    fetchDecorations();
  }, [selectedCategory]);

  const fetchDecorations = async () => {
    try {
      setLoading(true);
      const response = await getDecorations(selectedCategory);
      setDecorations(response.data.decorations || response.data);
    } catch (error) {
      console.error('Failed to fetch decorations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Event Decorations</h1>
          <p className="text-white/80 text-lg">
            Browse our collection of stunning decorations for your events
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : decorations.length === 0 ? (
          <div className="text-center py-12">
            <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No decorations found</h3>
            <p className="text-gray-600">Check back later for new decorations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decorations.map((decoration) => (
              <div
                key={decoration._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-secondary-400 to-primary-400 flex items-center justify-center">
                  <Palette className="w-16 h-16 text-white/50" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-secondary-600 uppercase">
                      {decoration.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{decoration.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{decoration.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      {formatCurrency(decoration.price)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {decoration.stock > 0 ? `${decoration.stock} available` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Decorations;
