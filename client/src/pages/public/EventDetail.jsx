import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Clock, Users, Tag, ArrowLeft, Ticket } from 'lucide-react';
import { getEvent } from '../../services/eventService';
import { createRegistration } from '../../services/registrationService';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await getEvent(id);
      setEvent(response.data);
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
      await createRegistration({
        eventId: event._id,
        tickets: ticketQuantity,
      });
      toast.success('Tickets booked successfully!');
      fetchEvent();
    } catch (error) {
      const message = error.response?.data?.message || 'Booking failed';
      toast.error(message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <button onClick={() => navigate('/events')} className="btn-primary">
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="text-primary-600" size={20} />
                <span className="text-sm font-medium text-primary-600 uppercase">{event.category}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this event</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">{event.time || 'TBA'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Venue</p>
                    <p className="font-medium text-gray-900">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-medium text-gray-900">{event.capacity} attendees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-1">Ticket Price</p>
                <p className="text-4xl font-bold text-primary-600">
                  {formatCurrency(event.ticketPrice)}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="label">Number of Tickets</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{ticketQuantity}</span>
                    <button
                      onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(event.ticketPrice * ticketQuantity)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatCurrency(event.ticketPrice * ticketQuantity)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookTicket}
                disabled={booking || event.status !== 'confirmed'}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Ticket size={18} />
                {booking ? 'Booking...' : 'Book Now'}
              </button>

              {event.status !== 'confirmed' && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  This event is not available for booking
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
