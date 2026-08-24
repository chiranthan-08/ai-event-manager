import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Search, Filter, ChevronDown, Sparkles } from 'lucide-react';

const sampleEvents = [
  { id: '1', title: 'Royal Wedding Celebration', category: 'Wedding', date: '2026-09-15', time: '6:00 PM', venue: 'Grand Palace Banquet Hall', location: 'Bangalore', ticketPrice: 2500, availableSeats: 500, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop' },
  { id: '2', title: 'Birthday Bash - Neon Night', category: 'Birthday', date: '2026-09-20', time: '8:00 PM', venue: 'Neon Lounge Club', location: 'Mumbai', ticketPrice: 800, availableSeats: 200, image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop' },
  { id: '3', title: 'Tech Summit 2026', category: 'Corporate', date: '2026-10-05', time: '9:00 AM', venue: 'Innovation Convention Center', location: 'Hyderabad', ticketPrice: 5000, availableSeats: 1000, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop' },
  { id: '4', title: 'College Fest - Euphoria', category: 'College', date: '2026-10-12', time: '10:00 AM', venue: 'University Ground', location: 'Delhi', ticketPrice: 300, availableSeats: 5000, image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop' },
  { id: '5', title: 'Diwali Festival of Lights', category: 'Festival', date: '2026-10-20', time: '5:00 PM', venue: 'City Auditorium', location: 'Pune', ticketPrice: 500, availableSeats: 800, image: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=600&h=400&fit=crop' },
  { id: '6', title: 'Golden Anniversary Gala', category: 'Anniversary', date: '2026-11-01', time: '7:00 PM', venue: 'Heritage Resort', location: 'Goa', ticketPrice: 3500, availableSeats: 150, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop' },
  { id: '7', title: 'New Year Eve Party 2027', category: 'Party', date: '2026-12-31', time: '9:00 PM', venue: 'Skyline Rooftop', location: 'Bangalore', ticketPrice: 4000, availableSeats: 300, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop' },
  { id: '8', title: 'Starry Night Reception', category: 'Wedding', date: '2026-11-10', time: '7:00 PM', venue: 'Lakeside Resort', location: 'Udaipur', ticketPrice: 3000, availableSeats: 400, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop' },
  { id: '9', title: 'Kids Birthday Carnival', category: 'Birthday', date: '2026-09-28', time: '11:00 AM', venue: 'Fun World Park', location: 'Chennai', ticketPrice: 400, availableSeats: 300, image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop' },
  { id: '10', title: 'Startup Meetup & Networking', category: 'Corporate', date: '2026-10-25', time: '2:00 PM', venue: 'CoWork Space Hub', location: 'Bangalore', ticketPrice: 1500, availableSeats: 250, image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=600&h=400&fit=crop' },
  { id: '11', title: 'Holi Color Festival', category: 'Festival', date: '2027-03-10', time: '10:00 AM', venue: 'Open Ground Arena', location: 'Mathura', ticketPrice: 250, availableSeats: 2000, image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop' },
  { id: '12', title: 'Retro 90s Night Party', category: 'Party', date: '2026-11-20', time: '8:00 PM', venue: 'Vinyl Bar & Lounge', location: 'Mumbai', ticketPrice: 1200, availableSeats: 180, image: 'https://images.unsplash.com/photo-1504509546545-e009b53fba3e?w=600&h=400&fit=crop' },
];

const categories = ['All', 'Wedding', 'Birthday', 'Corporate', 'College', 'Festival', 'Anniversary', 'Party'];

export default function Events() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState(sampleEvents);

  useEffect(() => {
    let filtered = sampleEvents;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }
    if (search) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase())
      );
    }
    setEvents(filtered);
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
      {/* Hero Header */}
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

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="bg-white rounded-2xl shadow-xl p-2 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events, venues, locations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full py-3 text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <button className="btn-indian text-white px-8 py-3 rounded-xl font-semibold">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Filters */}
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

      {/* Events Grid */}
      <div className="container mx-auto px-4 py-12">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🪔</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.image}
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
                      ₹{event.ticketPrice.toLocaleString()}
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
                      {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} • {event.time}
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
