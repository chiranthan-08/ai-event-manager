import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Eye, Calendar, MapPin, ArrowLeft, Filter } from 'lucide-react';
import { getDecorations } from '../../services/decorationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const categoryEmojis = {
  Wedding: '💒', Birthday: '🎂', Corporate: '💼', College: '🎓',
  Festival: '🪔', Anniversary: '💐', Party: '🎉', Other: '✨',
};

const categoryColors = {
  Wedding: 'from-pink-500 to-rose-600',
  Birthday: 'from-purple-500 to-indigo-600',
  Corporate: 'from-blue-500 to-cyan-600',
  College: 'from-green-500 to-emerald-600',
  Festival: 'from-saffron-500 to-amber-600',
  Anniversary: 'from-rose-500 to-pink-600',
  Party: 'from-red-500 to-orange-600',
  Other: 'from-gray-500 to-gray-600',
};

const fallbackDecorations = [
  { _id: '1', title: 'Wedding Floral Arch', category: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop', description: 'Beautiful floral arch decoration for wedding ceremonies' },
  { _id: '2', title: 'Birthday Balloon Setup', category: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop', description: 'Colorful balloon decoration for birthday parties' },
  { _id: '3', title: 'Corporate Stage Design', category: 'Corporate', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop', description: 'Professional stage setup for corporate events' },
  { _id: '4', title: 'Diwali Rangoli Display', category: 'Festival', image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop', description: 'Traditional rangoli decoration for Diwali' },
  { _id: '5', title: 'Wedding Mandap Decor', category: 'Wedding', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop', description: 'Traditional Indian wedding mandap decoration' },
  { _id: '6', title: 'DJ Night Lighting', category: 'Party', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop', description: 'Neon and laser lighting setup for DJ nights' },
];

const categories = ['All', 'Wedding', 'Birthday', 'Corporate', 'Festival', 'Anniversary', 'Party', 'College'];

export default function Decorations() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [decorations, setDecorations] = useState(fallbackDecorations);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const eventFilter = searchParams.get('event');

  useEffect(() => {
    fetchDecorations();
  }, [selectedCategory, eventFilter]);

  const fetchDecorations = async () => {
    try {
      setLoading(true);
      const params = { limit: 20 };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (eventFilter) params.event = eventFilter;

      const res = await getDecorations(params);
      const decs = res.data?.decorations || res.data;
      if (Array.isArray(decs) && decs.length > 0) {
        setDecorations(decs);
      } else {
        setDecorations(fallbackDecorations);
      }
    } catch {
      setDecorations(fallbackDecorations);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-indian-gold via-amber-500 to-saffron-500 py-20 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <span className="text-sm font-medium tracking-widest uppercase opacity-90">Our Portfolio</span>
          <h1 className="text-5xl md:text-6xl font-bold mt-2 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Decoration Gallery
          </h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            Explore our stunning collection of event decorations from weddings to festivals
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="white"/></svg>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indian-gold to-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-indian-gold'
              }`}
            >
              {cat !== 'All' && <span className="mr-1">{categoryEmojis[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20"><LoadingSpinner /></div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {decorations.map((item) => (
              <div
                key={item._id}
                className="group relative rounded-2xl overflow-hidden shadow-lg card-hover cursor-pointer"
                onClick={() => navigate(`/decorations/${item._id}`)}
              >
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop'}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-3 left-3">
                    <span className={`bg-gradient-to-r ${categoryColors[item.category] || 'from-gray-500 to-gray-600'} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {categoryEmojis[item.category] || '✨'} {item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold">{item.title}</h3>
                    {item.event && (
                      <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
                        <Calendar className="w-3 h-3" />
                        {item.event.title || 'View event'}
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
                      <Eye className="w-3 h-3" /> View Details
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
