import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CalendarDays, MapPin, Clock, Users, Tag, ArrowLeft, Ticket,
  Share2, Heart, ChevronLeft, ChevronRight, Star, Shield,
  CreditCard, CheckCircle, Info, Sparkles
} from 'lucide-react';
import { getEvent } from '../../services/eventService';
import { getEvents } from '../../services/eventService';
import { createRegistration } from '../../services/registrationService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

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

const categoryEmojis = {
  Wedding: '💒', Birthday: '🎂', Corporate: '💼', College: '🎓',
  Festival: '🪔', Anniversary: '💐', Party: '🎉', Other: '✨',
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addEventToCart } = useCart();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState([]);

  useEffect(() => {
    fetchEvent();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await getEvent(id);
      const ev = response.data?.event || response.data;
      setEvent(ev);

      if (ev?.category) {
        try {
          const relRes = await getEvents({ category: ev.category, limit: 4 });
          const relEvents = relRes.data?.events || relRes.data || [];
          setRelatedEvents(relEvents.filter(e => e._id !== ev._id).slice(0, 3));
        } catch {}
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTicket = async () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    try {
      setBooking(true);
      await createRegistration({ eventId: event._id, numberOfSeats: ticketQuantity });
      toast.success('Tickets booked successfully!');
      navigate('/client/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Booking failed';
      toast.error(message);
    } finally {
      setBooking(false);
    }
  };

  const handleAddToCart = () => {
    addEventToCart(event, ticketQuantity);
    toast.success(
      (t) => (
        <span>
          {event.title} added to cart!{' '}
          <button
            onClick={() => { toast.dismiss(t.id); navigate('/cart'); }}
            className="font-bold text-orange-600 underline ml-1"
          >
            View Cart
          </button>
        </span>
      ),
      { duration: 4000 }
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return <LoadingSpinner />;

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/events')} className="btn-indian text-white px-6 py-3 rounded-xl font-semibold">
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const images = event.images?.length > 0
    ? event.images
    : ['https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=1200&h=600&fit=crop'];

  const eventDate = new Date(event.date);
  const isValidDate = !isNaN(eventDate.getTime());
  const isBookable = ['upcoming', 'active'].includes(event.status);
  const seatsLeft = event.availableSeats ?? event.capacity ?? 0;
  const gradient = categoryColors[event.category] || categoryColors.Other;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
      {/* Hero Image Gallery */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-gray-900 overflow-hidden">
        <img
          src={images[currentImage]}
          alt={event.title}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2.5 rounded-xl backdrop-blur-md transition-all ${
                liked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-all"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Image navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentImage ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Category badge */}
        <div className="absolute bottom-6 left-6 z-10">
          <span className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${gradient} text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg`}>
            <span>{categoryEmojis[event.category]}</span>
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Event Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {event.title}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-indian-green" />
                      {event.venue}{event.location ? `, ${event.location}` : ''}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="capitalize">{event.status}</span>
                  </div>
                </div>
                <div className="text-right hidden md:block">
                  <div className="text-3xl font-bold text-saffron-500">{formatCurrency(event.ticketPrice)}</div>
                  <div className="text-sm text-gray-500">per ticket</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center p-3 bg-orange-50 rounded-xl">
                  <CalendarDays className="w-6 h-6 text-saffron-500 mx-auto mb-1" />
                  <div className="text-sm font-bold text-gray-900">
                    {isValidDate ? eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBA'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isValidDate ? eventDate.toLocaleDateString('en-IN', { weekday: 'short' }) : ''}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <Clock className="w-6 h-6 text-indian-green mx-auto mb-1" />
                  <div className="text-sm font-bold text-gray-900">{event.time || 'TBA'}</div>
                  <div className="text-xs text-gray-500">Start Time</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <Users className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm font-bold text-gray-900">{event.capacity?.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Capacity</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <Ticket className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                  <div className="text-sm font-bold text-gray-900">{seatsLeft.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Seats Left</div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info size={20} className="text-saffron-500" />
                About This Event
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Venue & Location */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-indian-green" />
                Venue & Location
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indian-green to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl flex-shrink-0">
                    🏛️
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{event.venue}</h3>
                    {event.location && (
                      <p className="text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin size={14} className="text-indian-green" />
                        {event.location}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-full text-gray-600 shadow-sm">
                        🅿️ Parking Available
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-full text-gray-600 shadow-sm">
                        ♿ Accessible
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-full text-gray-600 shadow-sm">
                        🌐 Wi-Fi
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-saffron-500" />
                What's Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Professional Event Coordination',
                  'Sound & Lighting Setup',
                  'Photography Coverage',
                  'Welcome Drinks & Refreshments',
                  'Decorated Entrance',
                  'Power Backup',
                  'First Aid Station',
                  'Security Personnel',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* Price Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-1">Ticket Price</p>
                  <div className="text-4xl font-bold text-saffron-500">{formatCurrency(event.ticketPrice)}</div>
                  <p className="text-xs text-gray-400 mt-1">per person · incl. all taxes</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Number of Tickets</label>
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                        className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 hover:border-saffron-300 hover:text-saffron-500 transition-all"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold w-12 text-center text-gray-900">{ticketQuantity}</span>
                      <button
                        onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                        className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 hover:border-saffron-300 hover:text-saffron-500 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{formatCurrency(event.ticketPrice)} × {ticketQuantity} ticket{ticketQuantity > 1 ? 's' : ''}</span>
                      <span className="font-medium">{formatCurrency(event.ticketPrice * ticketQuantity)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Convenience fee</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span className="text-saffron-500">{formatCurrency(event.ticketPrice * ticketQuantity)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBookTicket}
                  disabled={booking || !isBookable}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    isBookable
                      ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white hover:shadow-lg hover:shadow-saffron-500/30 active:scale-[0.98]'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Ticket size={20} />
                  {booking ? 'Booking...' : isBookable ? 'Book Now' : 'Not Available'}
                </button>

                {isBookable && (
                  <button
                    onClick={handleAddToCart}
                    className="w-full mt-3 py-3 rounded-xl font-bold text-orange-600 border-2 border-orange-200 hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                  >
                    🛒 Add to Cart
                  </button>
                )}

                {!isBookable && (
                  <p className="text-center text-sm text-gray-500 mt-3">
                    This event is currently {event.status}
                  </p>
                )}

                {/* Trust badges */}
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield size={14} className="text-green-500" />
                    Secure payment with 256-bit encryption
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CreditCard size={14} className="text-blue-500" />
                    UPI, Cards, NetBanking & Wallets accepted
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle size={14} className="text-saffron-500" />
                    Instant confirmation via Email & SMS
                  </div>
                </div>
              </div>

              {/* Assigned Employees */}
              {event.assignedEmployees?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Event Coordinators</h3>
                  <div className="space-y-3">
                    {event.assignedEmployees.map((emp) => (
                      <div key={emp._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {emp.name?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.role || emp.specialization}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="mt-12 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Similar <span className="text-saffron-500">Events</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedEvents.map((ev) => (
                <Link
                  key={ev._id}
                  to={`/events/${ev._id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={ev.images?.[0] || 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?w=600&h=400&fit=crop'}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`bg-gradient-to-r ${categoryColors[ev.category] || 'from-gray-500 to-gray-600'} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                        {ev.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-saffron-500 transition-colors line-clamp-1">{ev.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <CalendarDays size={12} />
                      {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-saffron-500 font-bold">{formatCurrency(ev.ticketPrice)}</span>
                      <span className="text-xs text-gray-400">{ev.venue}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
