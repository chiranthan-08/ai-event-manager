import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Search, Sparkles } from 'lucide-react';
import { getEvents } from '../../services/eventService';

const categories = ['All', 'Wedding', 'Birthday', 'Corporate', 'College', 'Festival', 'Anniversary', 'Party'];

export default function Events() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  useEffect(() => {
    if (search.trim().length > 0) {
      const matched = categories.filter(c => c.toLowerCase().includes(search.toLowerCase()) && c !== 'All');
      const matchedEvents = events.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 3);
      const combined = [
        ...matched.map(c => ({ type: 'category', label: c })),
        ...matchedEvents.map(e => ({ type: 'event', label: e.title, id: e._id || e.id })),
      ];
      setSuggestions(combined);
      setShowSuggestions(combined.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [search, events]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = { limit: 50 };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      const response = await getEvents(params);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(e => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(s) ||
      e.venue?.toLowerCase().includes(s) ||
      e.location?.toLowerCase().includes(s) ||
      e.category?.toLowerCase().includes(s)
    );
  });

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'category') {
      setSelectedCategory(suggestion.label);
      setSearch('');
    } else {
      setSearch(suggestion.label);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
      <div className="relative bg-gradient-to-r from-saffron-500 via-amber-500 to-indian-green py-20 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🪔</span>
              <span className="text-sm font-medium tracking-widest uppercase opacity-90">Discover & Book</span>
              <span className="text-2xl">🪔</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Discover Events
            </h1>
            <p className="text-lg opacity-90 max-w-xl mx-auto">
              Find and book amazing events near you - from grand weddings to exciting festivals
            </p>

            <div className="max-w-2xl mx-auto mt-8" ref={searchRef}>
              <div className="bg-white rounded-2xl shadow-xl p-2 flex items-center gap-2 relative">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder='Try "wedding", "birthday", "Diwali"...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    className="w-full py-3 text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <button className="btn-indian text-white px-8 py-3 rounded-xl font-semibold">
                  Search
                </button>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        className="w-full px-4 py-3 text-left hover:bg-saffron-50 flex items-center gap-3 transition-colors"
                      >
                        {s.type === 'category' ? (
                          <>
                            <span className="w-8 h-8 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-lg flex items-center justify-center text-white text-sm">
                              <Sparkles className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="font-medium text-gray-800">{s.label}</span>
                              <span className="text-sm text-gray-400 ml-2">Category</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="w-8 h-8 bg-gradient-to-br from-indian-green to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm">
                              <Calendar className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="font-medium text-gray-800">{s.label}</span>
                              <span className="text-sm text-gray-400 ml-2">Event</span>
                            </div>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-saffron-50 hover:text-saffron-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🪔</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Link
                key={event._id || event.id}
                to={`/events/${event._id || event.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.images?.[0] || event.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-saffron-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-white text-gray-800 text-lg font-bold px-4 py-1 rounded-full shadow-lg">
                      ₹{event.ticketPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 text-xl mb-3 group-hover:text-saffron-500 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {event.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-saffron-500" />
                      {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-indian-green" />
                      {event.venue}, {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4 text-indian-gold" />
                      {event.availableSeats} seats available
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Book Now</span>
                    <span className="text-saffron-500 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
