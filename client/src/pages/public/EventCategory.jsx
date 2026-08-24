import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, MapPin, Calendar, Clock, Eye, ExternalLink, Wifi, Users, Star } from 'lucide-react';

const categoryData = {
  Wedding: {
    icon: '💑',
    tagline: 'Where Dreams Become Reality',
    description: 'Explore real wedding events happening across India. Watch live streams and past recordings to inspire your dream wedding.',
    gradient: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-50 via-white to-rose-50',
    events: [
      { id: 'w1', title: 'Priya & Rahul Royal Wedding', venue: 'Taj Palace, Jaipur', date: '2026-08-25', time: '6:00 PM', status: 'live', viewers: 1240, rating: 4.9, youtubeUrl: 'https://www.youtube.com/embed/mf2mU4A5kfw', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop', description: 'A grand Rajasthani wedding with 800+ guests, traditional rituals, and royal decor.' },
      { id: 'w2', title: 'Anita & Meera Garden Wedding', venue: 'Leela Palace, Bangalore', date: '2026-08-28', time: '5:30 PM', status: 'upcoming', viewers: 0, rating: 4.8, youtubeUrl: 'https://www.youtube.com/embed/hrS0ZjZnizQ', thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop', description: 'Intimate garden wedding with floral mandap and candlelit reception.' },
      { id: 'w3', title: 'Kavya & Arjun Beach Wedding', venue: 'Grand Hyatt, Goa', date: '2026-09-02', time: '4:00 PM', status: 'live', viewers: 890, rating: 4.7, youtubeUrl: 'https://www.youtube.com/embed/Po1j5v7qUGo', thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop', description: 'Sunset beach wedding with white mandap and seashell decorations.' },
      { id: 'w4', title: 'Neha & Vikram Heritage Wedding', venue: 'Umaid Bhawan, Jodhpur', date: '2026-09-05', time: '7:00 PM', status: 'upcoming', viewers: 0, rating: 5.0, youtubeUrl: 'https://www.youtube.com/embed/NnXBQnpwMJA', thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop', description: 'Palace wedding with horse carriage entry and fireworks display.' },
    ],
  },
  Birthday: {
    icon: '🎂',
    tagline: 'Making Every Year Special',
    description: 'Watch live birthday celebrations and party setups to plan your perfect birthday event.',
    gradient: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 via-white to-indigo-50',
    events: [
      { id: 'b1', title: 'Arjun 5th Birthday Bash', venue: 'Fun World, Mumbai', date: '2026-08-26', time: '11:00 AM', status: 'live', viewers: 320, rating: 4.6, youtubeUrl: 'https://www.youtube.com/embed/ND5lvB6LMPg', thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop', description: 'Superhero themed party with character appearances, games, and magic show.' },
      { id: 'b2', title: 'Meera Sweet 16 Celebration', venue: 'Grand Ballroom, Delhi', date: '2026-08-30', time: '7:00 PM', status: 'live', viewers: 560, rating: 4.8, youtubeUrl: 'https://www.youtube.com/embed/iJWz2t575M8', thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop', description: 'Neon glow themed sweet sixteen with DJ, photo booth, and LED dance floor.' },
      { id: 'b3', title: 'Twins 3rd Birthday Carnival', venue: 'Park Hyatt, Chennai', date: '2026-09-01', time: '10:00 AM', status: 'upcoming', viewers: 0, rating: 4.5, youtubeUrl: 'https://www.youtube.com/embed/o7siHcUudno', thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop', description: 'Carnival themed party with rides, cotton candy station, and balloon artists.' },
      { id: 'b4', title: 'Grandpa 75th Birthday', venue: 'Heritage Resort, Coorg', date: '2026-09-03', time: '6:00 PM', status: 'upcoming', viewers: 0, rating: 4.9, youtubeUrl: 'https://www.youtube.com/embed/rzc8hA1qfy4', thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop', description: 'Elegant milestone celebration with family tribute video and live classical music.' },
    ],
  },
  Corporate: {
    icon: '💼',
    tagline: 'Elevate Your Business Events',
    description: 'See how top companies host their corporate events, product launches, and annual celebrations.',
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 via-white to-cyan-50',
    events: [
      { id: 'c1', title: 'TechSummit 2026 Annual Conference', venue: 'Jio Convention Centre, Mumbai', date: '2026-08-30', time: '9:00 AM', status: 'live', viewers: 5200, rating: 4.8, youtubeUrl: 'https://www.youtube.com/embed/eOE9x8Obq68', thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop', description: 'India\'s largest tech conference with 50+ speakers and 10,000 attendees.' },
      { id: 'c2', title: 'StartupIndia Annual Gala', venue: 'Vigyan Bhavan, New Delhi', date: '2026-09-01', time: '6:00 PM', status: 'upcoming', viewers: 0, rating: 4.6, youtubeUrl: 'https://www.youtube.com/embed/3aMYYTghDD0', thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop', description: 'Annual startup awards night celebrating India\'s top 100 innovators.' },
      { id: 'c3', title: 'IIFA Awards Night 2026', venue: 'DY Patil Stadium, Mumbai', date: '2026-09-03', time: '7:30 PM', status: 'live', viewers: 15800, rating: 4.9, youtubeUrl: 'https://www.youtube.com/embed/QYcKvK4-6ZM', thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop', description: 'Bollywood\'s biggest night with A-list celebrities and live performances.' },
      { id: 'c4', title: 'FinTech Innovators Summit', venue: 'IIIT Hyderabad', date: '2026-09-06', time: '10:00 AM', status: 'upcoming', viewers: 0, rating: 4.7, youtubeUrl: 'https://www.youtube.com/embed/kfXjtD3JhHM', thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop', description: 'Banking leaders discuss future of UPI, crypto regulation, and digital lending.' },
    ],
  },
  College: {
    icon: '🎓',
    tagline: 'Campus Celebrations',
    description: 'Watch college fests, cultural nights, and graduation ceremonies for inspiration.',
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 via-white to-emerald-50',
    events: [
      { id: 'co1', title: 'IIT Bombay Mood Indigo', venue: 'IIT Bombay Campus', date: '2026-08-25', time: '5:00 PM', status: 'live', viewers: 5600, rating: 4.8, youtubeUrl: 'https://www.youtube.com/embed/Wds9iKicx0Y', thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop', description: 'India\'s largest cultural festival with 200+ events and celebrity performances.' },
      { id: 'co2', title: 'Christ University Fest', venue: 'Christ University, Bangalore', date: '2026-09-01', time: '6:00 PM', status: 'upcoming', viewers: 0, rating: 4.6, youtubeUrl: 'https://www.youtube.com/embed/ENnUjj74GAM', thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop', description: 'Annual college fest with fashion show, band night, and cultural performances.' },
      { id: 'co3', title: 'SRM University Farewell', venue: 'SRM Campus, Chennai', date: '2026-08-31', time: '7:00 PM', status: 'live', viewers: 2100, rating: 4.7, youtubeUrl: 'https://www.youtube.com/embed/7VKGoPK6iiQ', thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop', description: 'Grand farewell celebration with awards, performances, and memory lane.' },
      { id: 'co4', title: 'Manipal Tech Fest', venue: 'MIT Campus, Manipal', date: '2026-09-05', time: '9:00 AM', status: 'upcoming', viewers: 0, rating: 4.5, youtubeUrl: 'https://www.youtube.com/embed/d-hfpzdFLOc', thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop', description: 'Technology festival with hackathons, robotics, and AI workshops.' },
    ],
  },
  Festival: {
    icon: '🪔',
    tagline: 'Celebrate Traditions',
    description: 'Experience live festival celebrations from across India. See how we decorate and organize festival events.',
    gradient: 'from-saffron-500 to-amber-600',
    bgGradient: 'from-saffron-50 via-white to-amber-50',
    events: [
      { id: 'f1', title: 'Diwali Mahaotsav 2026', venue: 'Lotus Temple, Delhi', date: '2026-08-26', time: '6:30 PM', status: 'live', viewers: 8900, rating: 4.9, youtubeUrl: 'https://www.youtube.com/embed/t8GLgWL6Cp0', thumbnail: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop', description: 'Grand Diwali celebration with 10,000 diyas, rangoli competition, and cultural performances.' },
      { id: 'f2', title: 'Holi Rang Mahotsav', venue: 'Mathura, UP', date: '2026-09-02', time: '10:00 AM', status: 'upcoming', viewers: 0, rating: 4.8, youtubeUrl: 'https://www.youtube.com/embed/BkiEN7UJszk', thumbnail: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop', description: 'Traditional Holi celebration with organic colors, music, and food stalls.' },
      { id: 'f3', title: 'Ganesh Chaturthi', venue: 'Lalbaugcha Raja, Mumbai', date: '2026-08-28', time: '8:00 AM', status: 'live', viewers: 12000, rating: 5.0, youtubeUrl: 'https://www.youtube.com/embed/LzcRyxn2OqA', thumbnail: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop', description: 'Grand Ganesh immersion procession with 500+ idols and cultural troupes.' },
      { id: 'f4', title: 'Onam Sadya Celebration', venue: 'Kovalam Beach, Kerala', date: '2026-09-04', time: '12:00 PM', status: 'upcoming', viewers: 0, rating: 4.7, youtubeUrl: 'https://www.youtube.com/embed/e3Dxs7asVqo', thumbnail: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop', description: 'Traditional Onam celebration with Pookalam, snake boat race, and Onam Sadya.' },
    ],
  },
  Party: {
    icon: '🎉',
    tagline: 'Unleash the Fun',
    description: 'Watch live DJ nights, pool parties, and themed events to plan your next celebration.',
    gradient: 'from-red-500 to-pink-600',
    bgGradient: 'from-red-50 via-white to-pink-50',
    events: [
      { id: 'p1', title: 'Neon Night Club Party', venue: 'XTreme Sports Bar, Bangalore', date: '2026-08-25', time: '9:00 PM', status: 'live', viewers: 2100, rating: 4.7, youtubeUrl: 'https://www.youtube.com/embed/7l7sW2zxAM4', thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop', description: 'Neon glow party with DJ, laser show, and UV body paint.' },
      { id: 'p2', title: 'Rooftop Sunset Soirée', venue: 'Asilo, Mumbai', date: '2026-08-29', time: '5:00 PM', status: 'live', viewers: 1400, rating: 4.8, youtubeUrl: 'https://www.youtube.com/embed/e2KIIL0iVMk', thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop', description: 'Elegant rooftop party with cocktails, live saxophone, and sunset views.' },
      { id: 'p3', title: 'Pool Party Bash', venue: 'Radisson, Goa', date: '2026-09-01', time: '12:00 PM', status: 'upcoming', viewers: 0, rating: 4.6, youtubeUrl: 'https://www.youtube.com/embed/cTY5tbt0Exg', thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop', description: 'Poolside party with DJ, water games, BBQ, and tropical cocktails.' },
      { id: 'p4', title: 'Masquerade Ball', venue: 'The Oberoi, Delhi', date: '2026-09-06', time: '8:00 PM', status: 'upcoming', viewers: 0, rating: 4.9, youtubeUrl: 'https://www.youtube.com/embed/wQHE97b9OkA', thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop', description: 'Elegant masquerade theme with live band, dance floor, and grand prizes.' },
    ],
  },
  Anniversary: {
    icon: '💍',
    tagline: 'Celebrating Love',
    description: 'Watch anniversary celebrations and romantic setups to plan your special milestone.',
    gradient: 'from-rose-500 to-red-600',
    bgGradient: 'from-rose-50 via-white to-red-50',
    events: [
      { id: 'a1', title: 'Silver Jubilee Celebration', venue: 'Leela Palace, Udaipur', date: '2026-08-27', time: '7:00 PM', status: 'live', viewers: 680, rating: 4.9, youtubeUrl: 'https://www.youtube.com/embed/L7AuboM47hY', thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop', description: '25th anniversary with rose petal decor, candlelight dinner, and live violin.' },
      { id: 'a2', title: 'Gold Anniversary Gala', venue: 'Taj Coromandel, Chennai', date: '2026-09-03', time: '6:30 PM', status: 'upcoming', viewers: 0, rating: 4.8, youtubeUrl: 'https://www.youtube.com/embed/5ZlYYMT5D3A', thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop', description: '50th anniversary celebration with family tribute and grand reception.' },
      { id: 'a3', title: 'First Anniversary Surprise', venue: 'Backwater Resort, Kerala', date: '2026-08-30', time: '5:00 PM', status: 'live', viewers: 420, rating: 4.7, youtubeUrl: 'https://www.youtube.com/embed/db-UwvVU1to', thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop', description: 'Houseboat surprise with rose petals, private dinner, and fireworks.' },
      { id: 'a4', title: 'Grandparents Day Special', venue: 'Hyatt Regency, Pune', date: '2026-09-05', time: '11:00 AM', status: 'upcoming', viewers: 0, rating: 4.6, youtubeUrl: 'https://www.youtube.com/embed/oTBILDCD1g0', thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop', description: 'Multi-generational family celebration with tribute video and live music.' },
    ],
  },
};

const statusColors = { live: 'bg-red-500', upcoming: 'bg-gray-400' };
const statusLabels = { live: 'LIVE NOW', upcoming: 'COMING SOON' };

export default function EventCategory() {
  const { name } = useParams();
  const category = categoryData[name];

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
        <div className="flex flex-col items-center justify-center py-32">
          <span className="text-6xl mb-4">🪔</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Category Not Found</h2>
          <p className="text-gray-500 mb-6">This event category doesn't exist.</p>
          <Link to="/" className="bg-gradient-to-r from-saffron-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const liveEvents = category.events.filter(e => e.status === 'live');
  const upcomingEvents = category.events.filter(e => e.status === 'upcoming');

  return (
    <div className={`min-h-screen bg-gradient-to-b ${category.bgGradient}`}>

      {/* Hero */}
      <div className={`relative bg-gradient-to-r ${category.gradient} py-20 overflow-hidden`}>
        <div className="absolute inset-0 mandala-bg opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{name} Events</h1>
              <p className="text-lg opacity-90 mt-1">{category.tagline}</p>
            </div>
          </div>
          <p className="text-base opacity-80 max-w-2xl mt-4">{category.description}</p>
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-red-300" />
              <span className="font-bold text-lg">{liveEvents.length} Live Now</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-white/70" />
              <span>{upcomingEvents.length} Upcoming</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="white"/></svg>
        </div>
      </div>

      {/* Live Events */}
      {liveEvents.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            Live Now ({liveEvents.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {liveEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
                {/* Video Embed */}
                <div className="relative">
                  <iframe
                    src={event.youtubeUrl}
                    title={event.title}
                    className="w-full h-64"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`${statusColors[event.status]} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}>
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      {statusLabels[event.status]}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {event.viewers.toLocaleString()} watching
                  </div>
                </div>
                {/* Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-600">{event.rating}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{event.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-saffron-500" /> {event.venue}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-saffron-500" /> {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-saffron-500" /> {event.time}</span>
                  </div>
                  <a href={event.youtubeUrl.replace('/embed/', '/watch?v=')} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm">
                    <Play className="w-4 h-4" /> Watch on YouTube <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            <Calendar className="w-6 h-6 text-saffron-500" />
            Upcoming Events ({upcomingEvents.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
                <div className="relative">
                  <img src={event.thumbnail} alt={event.title} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                      <Play className="w-8 h-8 text-saffron-500" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`${statusColors[event.status]} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {statusLabels[event.status]}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-600">{event.rating}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{event.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-saffron-500" /> {event.venue}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-saffron-500" /> {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-saffron-500" /> {event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="container mx-auto px-4 py-12">
        <div className={`bg-gradient-to-r ${category.gradient} rounded-3xl p-10 text-center text-white`}>
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Want to Book a {name} Event?</h3>
          <p className="opacity-90 mb-6 max-w-lg mx-auto">Let us help you create unforgettable memories. Get in touch with our event planning team today.</p>
          <Link to="/register" className="bg-white text-gray-800 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all inline-block">
            Get Started
          </Link>
        </div>
      </div>

    </div>
  );
}
