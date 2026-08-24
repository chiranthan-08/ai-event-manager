import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Sparkles, Heart, Star, ChevronRight, ArrowRight, Gem, Music } from 'lucide-react';

const featuredEvents = [
  {
    id: '1',
    title: 'Royal Wedding Celebration',
    category: 'Wedding',
    date: '2026-09-15',
    time: '6:00 PM',
    venue: 'Grand Palace Banquet Hall',
    location: 'Bangalore',
    ticketPrice: 2500,
    availableSeats: 500,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Diwali Festival of Lights',
    category: 'Festival',
    date: '2026-10-20',
    time: '5:00 PM',
    venue: 'City Auditorium',
    location: 'Pune',
    ticketPrice: 500,
    availableSeats: 800,
    image: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=600&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Tech Summit 2026',
    category: 'Corporate',
    date: '2026-10-05',
    time: '9:00 AM',
    venue: 'Innovation Center',
    location: 'Hyderabad',
    ticketPrice: 5000,
    availableSeats: 1000,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'New Year Eve Party',
    category: 'Party',
    date: '2026-12-31',
    time: '9:00 PM',
    venue: 'Skyline Rooftop',
    location: 'Mumbai',
    ticketPrice: 4000,
    availableSeats: 300,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop',
  },
];

const categories = [
  { name: 'Wedding', icon: '💑', color: 'from-pink-500 to-rose-600', count: 12, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop' },
  { name: 'Birthday', icon: '🎂', color: 'from-purple-500 to-indigo-600', count: 8, image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=200&fit=crop' },
  { name: 'Corporate', icon: '💼', color: 'from-blue-500 to-cyan-600', count: 15, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop' },
  { name: 'College', icon: '🎓', color: 'from-green-500 to-emerald-600', count: 6, image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=300&h=200&fit=crop' },
  { name: 'Festival', icon: '🪔', color: 'from-saffron-500 to-amber-600', count: 10, image: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=300&h=200&fit=crop' },
  { name: 'Party', icon: '🎉', color: 'from-red-500 to-pink-600', count: 9, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=200&fit=crop' },
];

const testimonials = [
  { name: 'Ananya & Vikram', event: 'Wedding', text: 'Our wedding was absolutely magical! The decorations were beyond our dreams. Thank you for making our special day perfect!', rating: 5, avatar: '👰' },
  { name: 'Rajesh Kumar', event: 'Corporate Event', text: 'Professional service and excellent coordination. Our tech summit was a huge success with over 500 attendees.', rating: 5, avatar: '👨‍💼' },
  { name: 'Priya Patel', event: 'Birthday Party', text: 'The neon night theme was incredible! My daughter had the best birthday ever. Highly recommended!', rating: 5, avatar: '👩' },
];

const galleryImages = [
  { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop', title: 'Wedding Decor' },
  { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop', title: 'Anniversary Setup' },
  { url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop', title: 'Party Night' },
  { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop', title: 'Corporate Event' },
  { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop', title: 'Birthday Bash' },
  { url: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=400&h=300&fit=crop', title: 'Festival Celebration' },
];

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 mandala-bg opacity-50"></div>

        {/* Floating Diyas - positioned at edges away from text */}
        <div className="absolute top-32 right-8 text-4xl diya-float opacity-40">🪔</div>
        <div className="absolute bottom-32 right-16 text-3xl diya-float opacity-30" style={{ animationDelay: '1s' }}>🪔</div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              {/* Indian decorative element */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-saffron-500 text-2xl">✦</span>
                <span className="text-indian-gold text-sm font-medium tracking-widest uppercase">AI-Powered Event Management</span>
                <span className="text-saffron-500 text-2xl">✦</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
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

              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                From grand weddings to intimate celebrations, we bring your dream events to life with
                <span className="text-saffron-500 font-semibold"> AI-powered suggestions</span>,
                stunning decorations, and seamless planning.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/events"
                  className="btn-indian text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Explore Events
                </Link>
                <Link
                  to="/ai-assistant"
                  className="bg-white text-saffron-500 border-2 border-saffron-500 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 hover:bg-saffron-50 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  AI Assistant
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {[
                  { number: '500+', label: 'Events' },
                  { number: '10K+', label: 'Happy Clients' },
                  { number: '50+', label: 'Venues' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-saffron-500">{stat.number}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="relative animate-slide-up">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-2xl card-hover">
                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop" alt="Wedding" className="w-full h-48 object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl card-hover">
                    <img src="https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=400&h=200&fit=crop" alt="Festival" className="w-full h-32 object-cover" />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="rounded-2xl overflow-hidden shadow-2xl card-hover">
                    <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=200&fit=crop" alt="Party" className="w-full h-32 object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl card-hover">
                    <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop" alt="Corporate" className="w-full h-48 object-cover" />
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">AI Powered</div>
                    <div className="text-sm text-gray-500">Smart Suggestions</div>
                  </div>
                </div>
              </div>
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
                to={`/events?category=${cat.name}`}
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
            {featuredEvents.map((event, index) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
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
                    {event.availableSeats} seats available
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
            {galleryImages.map((img, index) => (
              <div key={index} className="relative rounded-2xl overflow-hidden group cursor-pointer card-hover">
                <img src={img.url} alt={img.title} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="font-bold text-lg">{img.title}</div>
                    <div className="text-sm opacity-80">View Details →</div>
                  </div>
                </div>
              </div>
            ))}
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
