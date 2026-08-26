import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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

const categoryFallbackColors = {
  Wedding: '#ec4899', Birthday: '#8b5cf6', Corporate: '#3b82f6', College: '#22c55e',
  Festival: '#f59e0b', Anniversary: '#f43f5e', Party: '#ef4444', Other: '#6b7280',
};

const fallbackDecorations = [
  { _id: '1', title: 'Wedding Floral Arch', category: 'Wedding', image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=600&h=400&fit=crop', description: 'Beautiful floral arch decoration for wedding ceremonies' },
  { _id: '2', title: 'Birthday Balloon Setup', category: 'Birthday', image: 'https://images.pexels.com/photos/5765827/pexels-photo-5765827.jpeg?w=600&h=400&fit=crop', description: 'Colorful balloon decoration for birthday parties' },
  { _id: '3', title: 'Corporate Stage Design', category: 'Corporate', image: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=600&h=400&fit=crop', description: 'Professional stage setup for corporate events' },
  { _id: '4', title: 'Diwali Rangoli Display', category: 'Festival', image: 'https://images.pexels.com/photos/6726362/pexels-photo-6726362.jpeg?w=600&h=400&fit=crop', description: 'Traditional rangoli decoration for Diwali' },
  { _id: '5', title: 'Wedding Mandap Decor', category: 'Wedding', image: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?w=600&h=400&fit=crop', description: 'Traditional Indian wedding mandap decoration' },
  { _id: '6', title: 'DJ Night Lighting', category: 'Party', image: 'https://images.pexels.com/photos/1749057/pexels-photo-1749057.jpeg?w=600&h=400&fit=crop', description: 'Neon and laser lighting setup for DJ nights' },
];

const categories = ['All', 'Wedding', 'Birthday', 'Corporate', 'Festival', 'Anniversary', 'Party', 'College'];

export default function Decorations() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [decorations, setDecorations] = useState(fallbackDecorations);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const eventFilter = searchParams.get('event');
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    if (categoryFilter) setSelectedCategory(categoryFilter);
  }, [categoryFilter]);

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
        const filtered = categoryFilter
          ? fallbackDecorations.filter(d => d.category === categoryFilter)
          : fallbackDecorations;
        setDecorations(filtered.length > 0 ? filtered : fallbackDecorations);
      }
    } catch {
      const filtered = categoryFilter
        ? fallbackDecorations.filter(d => d.category === categoryFilter)
        : fallbackDecorations;
      setDecorations(filtered.length > 0 ? filtered : fallbackDecorations);
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
          {eventFilter ? (
            <>
              <button onClick={() => { setSearchParams({}); }} className="flex items-center gap-2 mx-auto mb-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all text-sm">
                <ArrowLeft className="w-4 h-4" /> View All Decorations
              </button>
              <span className="text-sm font-medium tracking-widest uppercase opacity-90">Event Decorations</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                All Decorations for This Event
              </h1>
              <p className="text-lg opacity-90 max-w-xl mx-auto">
                Browse all decorations associated with this event
              </p>
            </>
          ) : (
            <>
              <span className="text-sm font-medium tracking-widest uppercase opacity-90">Our Portfolio</span>
              <h1 className="text-5xl md:text-6xl font-bold mt-2 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Decoration Gallery
              </h1>
              <p className="text-lg opacity-90 max-w-xl mx-auto">
                Explore our stunning collection of event decorations from weddings to festivals
              </p>
            </>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="white"/></svg>
        </div>
      </div>

      {/* Event Info Banner */}
      {eventFilter && decorations.length > 0 && decorations[0].event && (
        <div className="container mx-auto px-4 -mt-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl flex-shrink-0">
              {categoryEmojis[decorations[0].event?.category] || '✨'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{decorations[0].event?.title || 'Event'}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                {decorations[0].event?.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(decorations[0].event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
                {decorations[0].event?.venue && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {decorations[0].event.venue}
                  </span>
                )}
              </div>
            </div>
            <Link
              to={`/events/${decorations[0].event?._id}`}
              className="bg-gradient-to-r from-saffron-500 to-amber-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
            >
              View Event →
            </Link>
          </div>
        </div>
      )}

      {/* Filters */}
      {!eventFilter && (
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
      )}

      {loading ? (
        <div className="py-20"><LoadingSpinner /></div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {decorations.map((item) => {
              const eventId = typeof item.event === 'object' ? item.event?._id : item.event;
              const eventTitle = typeof item.event === 'object' ? item.event?.title : null;
              return (
                <div
                  key={item._id}
                  className="group relative rounded-2xl overflow-hidden shadow-lg card-hover cursor-pointer"
                  onClick={() => {
                    if (eventFilter && eventId) {
                      navigate(`/events/${eventId}`);
                    } else if (eventId) {
                      navigate(`/decorations?event=${eventId}`);
                    } else {
                      navigate(`/decorations?category=${item.category}`);
                    }
                  }}
                >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const color = categoryFallbackColors[item.category] || '#6b7280';
                    const emoji = categoryEmojis[item.category] || '✨';
                    e.target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${color};stop-opacity:1"/><stop offset="100%" style="stop-color:${color};stop-opacity:0.7"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><text x="300" y="170" font-size="64" text-anchor="middle" fill="white">${emoji}</text><text x="300" y="240" font-size="20" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="bold">${item.title || ''}</text><text x="300" y="270" font-size="14" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="sans-serif">${item.category || ''}</text></svg>`)}`;
                  }}
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
            );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
