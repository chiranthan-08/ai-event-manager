import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Sparkles, Heart, Star, ChevronRight, ArrowRight, Gem, Music, Search } from 'lucide-react';
import { getEvents } from '../../services/eventService';
import { getDecorations } from '../../services/decorationService';

const fallbackEvents = [
  {
    _id: '1',
    title: 'Royal Wedding Celebration',
    category: 'Wedding',
    date: '2026-09-15',
    time: '6:00 PM',
    venue: 'Grand Palace Banquet Hall',
    location: 'Bangalore',
    ticketPrice: 2500,
    capacity: 500,
    images: ['https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=600&h=400&fit=crop'],
  },
  {
    _id: '2',
    title: 'Diwali Festival of Lights',
    category: 'Festival',
    date: '2026-10-20',
    time: '5:00 PM',
    venue: 'City Auditorium',
    location: 'Pune',
    ticketPrice: 500,
    capacity: 800,
    images: ['https://images.pexels.com/photos/30274906/pexels-photo-30274906.jpeg?w=600&h=400&fit=crop'],
  },
  {
    _id: '3',
    title: 'Tech Summit 2026',
    category: 'Corporate',
    date: '2026-10-05',
    time: '9:00 AM',
    venue: 'Innovation Center',
    location: 'Hyderabad',
    ticketPrice: 5000,
    capacity: 1000,
    images: ['https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=600&h=400&fit=crop'],
  },
  {
    _id: '4',
    title: 'New Year Eve Party',
    category: 'Party',
    date: '2026-12-31',
    time: '9:00 PM',
    venue: 'Skyline Rooftop',
    location: 'Mumbai',
    ticketPrice: 4000,
    capacity: 300,
    images: ['https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?w=600&h=400&fit=crop'],
  },
];

const categories = [
  { name: 'Wedding', icon: '💑', color: 'from-pink-500 to-rose-600', count: 12, image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=300&h=200&fit=crop' },
  { name: 'Birthday', icon: '🎂', color: 'from-purple-500 to-indigo-600', count: 8, image: 'https://images.pexels.com/photos/30870953/pexels-photo-30870953.jpeg?w=300&h=200&fit=crop' },
  { name: 'Corporate', icon: '💼', color: 'from-blue-500 to-cyan-600', count: 15, image: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=300&h=200&fit=crop' },
  { name: 'College', icon: '🎓', color: 'from-green-500 to-emerald-600', count: 6, image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=300&h=200&fit=crop' },
  { name: 'Festival', icon: '🪔', color: 'from-saffron-500 to-amber-600', count: 10, image: 'https://images.pexels.com/photos/30274906/pexels-photo-30274906.jpeg?w=300&h=200&fit=crop' },
  { name: 'Party', icon: '🎉', color: 'from-red-500 to-pink-600', count: 9, image: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?w=300&h=200&fit=crop' },
];

const testimonials = [
  { name: 'Ananya & Vikram', event: 'Wedding', text: 'Our wedding was absolutely magical! The decorations were beyond our dreams. Thank you for making our special day perfect!', rating: 5, avatar: '👰' },
  { name: 'Rajesh Kumar', event: 'Corporate Event', text: 'Professional service and excellent coordination. Our tech summit was a huge success with over 500 attendees.', rating: 5, avatar: '👨‍💼' },
  { name: 'Priya Patel', event: 'Birthday Party', text: 'The neon night theme was incredible! My daughter had the best birthday ever. Highly recommended!', rating: 5, avatar: '👩' },
];

const galleryImages = [
  { _id: '1', url: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=400&h=300&fit=crop', title: 'Royal Wedding Mandap', category: 'Wedding' },
  { _id: '2', url: 'https://images.pexels.com/photos/30870953/pexels-photo-30870953.jpeg?w=400&h=300&fit=crop', title: 'Birthday Balloon Setup', category: 'Birthday' },
  { _id: '6', url: 'https://images.pexels.com/photos/1749057/pexels-photo-1749057.jpeg?w=400&h=300&fit=crop', title: 'DJ Night Lighting', category: 'Party' },
  { _id: '3', url: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=400&h=300&fit=crop', title: 'Corporate Gala Night', category: 'Corporate' },
  { _id: '4', url: 'https://images.pexels.com/photos/30274906/pexels-photo-30274906.jpeg?w=400&h=300&fit=crop', title: 'Diwali Festival Decor', category: 'Festival' },
  { _id: '7', url: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?w=400&h=300&fit=crop', title: 'Anniversary Celebration', category: 'Anniversary' },
];

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

// Category-specific cover images for Featured Events section only
const categoryFeaturedImages = {
  Wedding: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=600&h=400&fit=crop',
  Birthday: 'https://images.pexels.com/photos/17931469/pexels-photo-17931469.jpeg?w=600&h=400&fit=crop',
  Corporate: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=600&h=400&fit=crop',
  College: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=600&h=400&fit=crop',
  Festival: 'https://images.pexels.com/photos/30274906/pexels-photo-30274906.jpeg?w=600&h=400&fit=crop',
  Party: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?w=600&h=400&fit=crop',
  Anniversary: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?w=600&h=400&fit=crop',
  Other: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=600&h=400&fit=crop',
};

export default function Home() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [featuredEvents, setFeaturedEvents] = useState(fallbackEvents);
  const [galleryDecorations, setGalleryDecorations] = useState(galleryImages);
  const [homeSearch, setHomeSearch] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getEvents({ limit: 4, status: 'upcoming' });
        const events = res.data?.events || res.data;
        if (Array.isArray(events) && events.length > 0) {
          // Remove duplicates by event ID
          const uniqueEvents = [...new Set(events.map(e => e._id))].map(id => events.find(e => e._id === id));
          setFeaturedEvents(uniqueEvents.slice(0, 4));
        }
      } catch {
        // use fallback events
      }
    };

    const fetchAllEvents = async () => {
      try {
        const res = await getEvents({ limit: 50 });
        const events = res.data?.events || res.data;
        if (Array.isArray(events) && events.length > 0) {
          setAllEvents(events);
        }
      } catch {
        // use empty
      }
    };

    const fetchGallery = async () => {
      try {
        const res = await getDecorations({ limit: 50 });
        const decs = res.data?.decorations || res.data;
        if (Array.isArray(decs) && decs.length > 0) {
          const seen = new Set();
          const diverse = [];
          for (const d of decs) {
            if (!seen.has(d.category) && diverse.length < 6) {
              seen.add(d.category);
              diverse.push({
                _id: d._id,
                url: d.image || 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=400&h=300&fit=crop',
                title: d.title,
                category: d.category,
              });
            }
          }
          if (diverse.length >= 3) {
            setGalleryDecorations(diverse);
          }
        }
      } catch {
        // use fallback gallery
      }
    };

    fetchFeatured();
    fetchGallery();
    fetchAllEvents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (homeSearch.trim().length > 0) {
      const s = homeSearch.toLowerCase();
      const matched = allEvents.filter(e =>
        e.title?.toLowerCase().includes(s) ||
        e.category?.toLowerCase().includes(s) ||
        e.venue?.toLowerCase().includes(s) ||
        e.location?.toLowerCase().includes(s) ||
        e.description?.toLowerCase().includes(s)
      ).slice(0, 5);
      const categoryMatches = ['Wedding', 'Birthday', 'Corporate', 'Party', 'Festival', 'Anniversary', 'College']
        .filter(c => c.toLowerCase().includes(s))
        .map(c => ({ type: 'category', label: c }));
      setSearchResults([...categoryMatches, ...matched.map(e => ({ type: 'event', event: e }))]);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [homeSearch, allEvents]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 mandala-bg opacity-50"></div>

        {/* Floating Diyas - positioned at edges away from text */}
        <div className="absolute top-32 right-8 text-4xl diya-float opacity-40">🪔</div>
        <div className="absolute bottom-32 right-16 text-3xl diya-float opacity-30" style={{ animationDelay: '1s' }}>🪔</div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              {/* Indian decorative element */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-saffron-500 text-xl">✦</span>
                <span className="text-indian-gold text-xs font-medium tracking-widest uppercase">AI-Powered Event Management</span>
                <span className="text-saffron-500 text-xl">✦</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-saffron-500 via-indian-red to-saffron-600 bg-clip-text text-transparent">
                  Celebrate
                </span>
                <br />
                <span className="text-gray-800">Every Moment</span>
                <br />
                <span className="bg-gradient-to-r from-indian-green to-emerald-600 bg-clip-text text-transparent">
                  With Joy
                </span>
              </h1>

              <p className="text-base text-gray-600 mb-6 leading-relaxed max-w-lg">
                From grand weddings to intimate celebrations, we bring your dream events to life with
                <span className="text-saffron-500 font-semibold"> AI-powered suggestions</span>,
                stunning decorations, and seamless planning.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/events"
                  className="btn-indian text-white px-6 py-3 rounded-xl font-semibold text-base flex items-center gap-2 shadow-lg"
                >
                  <Calendar className="w-4 h-4" />
                  Explore Events
                </Link>
                <Link
                  to="/ai-assistant"
                  className="bg-white text-saffron-500 border-2 border-saffron-500 px-6 py-3 rounded-xl font-semibold text-base flex items-center gap-2 hover:bg-saffron-50 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Assistant
                </Link>
                <div className="flex items-center gap-2 bg-white rounded-full px-8 py-3 text-sm font-medium">
                  <marquee behavior="scroll" direction="left" scrollamount="5">
                    100% Refund for Valid Reasons with Proof
                  </marquee>
                </div>
              </div>

              {/* Home Search Bar */}
              <div className="mt-6 max-w-lg relative" ref={searchRef}>
                <div className="flex items-center gap-2 bg-white rounded-xl shadow-lg p-2">
                  <Search className="w-5 h-5 text-gray-400 ml-2" />
                  <input
                    type="text"
                    placeholder='Search events, categories, add-ons...'
                    value={homeSearch}
                    onChange={(e) => setHomeSearch(e.target.value)}
                    onFocus={() => homeSearch.trim() && searchResults.length > 0 && setShowSearchResults(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && homeSearch.trim()) {
                        setShowSearchResults(false);
                        navigate(`/events?search=${encodeURIComponent(homeSearch.trim())}`);
                      }
                    }}
                    className="flex-1 py-2 px-2 text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      setShowSearchResults(false);
                      if (homeSearch.trim()) {
                        navigate(`/events?search=${encodeURIComponent(homeSearch.trim())}`);
                      }
                    }}
                    className="bg-gradient-to-r from-saffron-500 to-amber-500 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
                  >
                    Search
                  </button>
                </div>

                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 max-h-80 overflow-y-auto">
                    {searchResults.map((item, i) => (
                      item.type === 'category' ? (
                        <button
                          key={`cat-${i}`}
                          onClick={() => {
                            setShowSearchResults(false);
                            navigate(`/events?search=${item.label}`);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-saffron-50 flex items-center gap-3 transition-colors"
                        >
                          <span className="w-8 h-8 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-lg flex items-center justify-center text-white text-sm">
                            <Sparkles className="w-4 h-4" />
                          </span>
                          <div>
                            <span className="font-medium text-gray-800">{item.label}</span>
                            <span className="text-sm text-gray-400 ml-2">Category</span>
                          </div>
                        </button>
                      ) : (
                        <button
                          key={item.event._id}
                          onClick={() => {
                            setShowSearchResults(false);
                            navigate(`/events/${item.event._id}`);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-saffron-50 flex items-center gap-3 transition-colors"
                        >
                          <img
                            src={item.event.images?.[0] || item.event.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate">{item.event.title}</div>
                            <div className="text-sm text-gray-400 flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-saffron-100 text-saffron-600 rounded text-xs">{item.event.category}</span>
                              {item.event.venue && <span className="truncate">{item.event.venue}</span>}
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-saffron-500">₹{item.event.ticketPrice?.toLocaleString()}</span>
                        </button>
                      )
                    ))}
                    <button
                      onClick={() => {
                        setShowSearchResults(false);
                        navigate(`/events?search=${encodeURIComponent(homeSearch.trim())}`);
                      }}
                      className="w-full px-4 py-3 text-center text-saffron-500 font-medium hover:bg-saffron-50 border-t border-gray-100 mt-1"
                    >
                      View all results for "{homeSearch}" →
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-8">
                {[
                  { number: '500+', label: 'Events' },
                  { number: '10K+', label: 'Happy Clients' },
                  { number: '50+', label: 'Venues' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-saffron-500">{stat.number}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="relative animate-slide-up">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="rounded-2xl overflow-hidden shadow-2xl card-hover">
                    <img src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=400&h=280&fit=crop" alt="Wedding" className="w-full h-40 object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl card-hover">
                    <img src="https://images.pexels.com/photos/30274906/pexels-photo-30274906.jpeg?w=400&h=280&fit=crop" alt="Festival" className="w-full h-40 object-cover" />
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="rounded-2xl overflow-hidden shadow-2xl card-hover">
                    <img src="https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?w=400&h=280&fit=crop" alt="Party" className="w-full h-40 object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl card-hover">
                    <img src="https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=400&h=280&fit=crop" alt="Corporate" className="w-full h-40 object-cover" />
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <Link to="/ai-assistant" className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-3 animate-float hover:shadow-2xl transition-shadow cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">AI Powered</div>
                    <div className="text-xs text-gray-500">Smart Suggestions</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-saffron-500 font-medium tracking-widest uppercase text-sm">Browse By</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
              Event <span className="text-saffron-500">Categories</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              From traditional Indian weddings to modern corporate events, find the perfect celebration for every occasion
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, index) => (
              <Link
                key={cat.name}
                to={`/category/${cat.name}`}
                className="group relative rounded-2xl overflow-hidden shadow-lg card-hover"
              >
                <img src={cat.image} alt={cat.name} className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="font-bold">{cat.name}</div>
                  <div className="text-xs opacity-80">{cat.count} events</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white relative rangoli-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-indian-green font-medium tracking-widest uppercase text-sm">Don't Miss Out</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
              Featured <span className="text-indian-red">Events</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredEvents.map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.images?.[0] || categoryFeaturedImages[event.category] || 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=600&h=400&fit=crop'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-saffron-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                      ₹{event.ticketPrice}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-saffron-500 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Calendar className="w-4 h-4 text-saffron-500" />
                    {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <MapPin className="w-4 h-4 text-indian-green" />
                    {event.venue}, {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4 text-indian-gold" />
                    {event.capacity} seats available
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-white text-saffron-500 border-2 border-saffron-500 px-8 py-3 rounded-xl font-semibold hover:bg-saffron-500 hover:text-white transition-all"
            >
              View All Events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-20 bg-gradient-to-r from-saffron-500 via-amber-500 to-saffron-600 relative overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <span className="font-medium tracking-widest uppercase text-sm">Powered by AI</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Your Personal<br />Event Planning Assistant
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-lg">
                Let our AI help you plan the perfect event. Get personalized suggestions for themes,
                decorations, venues, and budget allocation - all tailored to your vision.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: '🎨', text: 'Theme Ideas' },
                  { icon: '🏛️', text: 'Venue Suggestions' },
                  { icon: '💰', text: 'Budget Planning' },
                  { icon: '✨', text: 'Decor Concepts' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/20 rounded-xl p-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/ai-assistant"
                className="inline-flex items-center gap-2 bg-white text-saffron-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Try AI Assistant
              </Link>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">AI Event Planner</div>
                    <div className="text-sm text-green-500">● Online</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                    <p className="text-sm text-gray-700">I'd like to plan a traditional Indian wedding for 500 guests in Bangalore. Budget is around ₹20 lakhs.</p>
                  </div>
                  <div className="bg-gradient-to-r from-saffron-500 to-amber-500 rounded-2xl rounded-tr-none p-4 max-w-[80%] ml-auto text-white">
                    <p className="text-sm">Great choice! For a traditional wedding, I suggest:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>🏛️ Venue: Palace Banquet Hall</li>
                      <li>🎨 Theme: Royal Rajasthani</li>
                      <li>💰 Budget split: Decor 30%, Food 40%, Music 15%</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg animate-float">
                <span className="text-2xl">🪔</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                <span className="text-2xl">💐</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-indian-gold font-medium tracking-widest uppercase text-sm">Our Work</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
              Previous <span className="text-indian-gold">Decorations</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryDecorations.map((img, index) => {
              const linkTo = img._id
                ? `/decorations/${img._id}`
                : img.category
                  ? `/decorations?category=${img.category}`
                  : '/decorations';
              return (
                <Link
                  key={img._id || index}
                  to={linkTo}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer card-hover"
                >
                  <img src={img.url} alt={img.title} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-3 left-3">
                      <span className={`bg-gradient-to-r ${categoryColors[img.category] || 'from-gray-500 to-gray-600'} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                        {img.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="font-bold text-lg">{img.title}</div>
                      <div className="text-sm opacity-80">View all event decorations →</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/decorations"
              className="inline-flex items-center gap-2 text-saffron-500 font-semibold hover:text-saffron-600"
            >
              View Full Gallery
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-indian-green font-medium tracking-widest uppercase text-sm">Why Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
              Why Choose <span className="text-indian-green">Us</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Sparkles className="w-8 h-8" />, title: 'AI-Powered', desc: 'Smart suggestions for themes, venues, and budget planning using advanced AI', color: 'from-saffron-500 to-amber-500' },
              { icon: <Heart className="w-8 h-8" />, title: 'Trusted by Thousands', desc: 'Over 10,000 happy clients have celebrated their special moments with us', color: 'from-red-500 to-pink-500' },
              { icon: <Gem className="w-8 h-8" />, title: 'Premium Quality', desc: 'Only the best venues, decorators, and vendors in our curated network', color: 'from-indian-gold to-amber-600' },
              { icon: <Music className="w-8 h-8" />, title: 'Full Service', desc: 'From planning to execution, we handle every detail of your event', color: 'from-indian-green to-emerald-600' },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg card-hover text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-saffron-500 font-medium tracking-widest uppercase text-sm">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
              How It <span className="text-saffron-500">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-1 bg-gradient-to-r from-saffron-500 via-indian-gold to-indian-green"></div>

            {[
              { step: '01', icon: '🔍', title: 'Browse Events', desc: 'Explore hundreds of events across categories or let our AI suggest the perfect one for you' },
              { step: '02', icon: '🎫', title: 'Book & Pay', desc: 'Select your event, choose seats, and complete secure online payment with instant confirmation' },
              { step: '03', icon: '🎉', title: 'Enjoy!', desc: 'Get your digital ticket, arrive at the venue, and create memories that last a lifetime' },
            ].map((item, index) => (
              <div key={index} className="relative bg-white rounded-2xl p-8 text-center z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  {item.step}
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-indian-maroon via-indian-red to-saffron-500 relative overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-indian-gold font-medium tracking-widest uppercase text-sm">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
              What Our Clients Say
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
              <div className="text-5xl mb-4">{testimonials[currentTestimonial].avatar}</div>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-indian-gold text-indian-gold" />
                ))}
              </div>
              <p className="text-gray-600 text-lg mb-6 italic">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="font-bold text-gray-800">{testimonials[currentTestimonial].name}</div>
              <div className="text-sm text-saffron-500">{testimonials[currentTestimonial].event}</div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentTestimonial ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-saffron-500 via-amber-500 to-indian-green rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 mandala-bg opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Create Unforgettable Moments?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of happy clients who have celebrated their special occasions with us.
                Let AI help you plan the perfect event!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/register"
                  className="bg-white text-saffron-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/events"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
