import { useState, useEffect } from 'react';
import { Calendar, Clock, XCircle, Eye, Ticket } from 'lucide-react';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getMyRegistrations, cancelRegistration } from '../../services/registrationService';
import toast from 'react-hot-toast';

export default function ClientBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [viewTicket, setViewTicket] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getMyRegistrations();
      setBookings(response.data.registrations || response.data.bookings || []);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelRegistration(cancelConfirm._id);
      toast.success('Booking cancelled successfully');
      setCancelConfirm(null);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const canCancel = (booking) => {
    const eventDate = new Date(booking.event?.date);
    const now = new Date();
    const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);
    return hoursUntilEvent > 24 && booking.status !== 'cancelled';
  };

  const filterBookings = (tab) => {
    const now = new Date();
    return bookings.filter((booking) => {
      const eventDate = new Date(booking.event?.date);
      if (tab === 'upcoming') return eventDate > now && booking.status !== 'cancelled';
      if (tab === 'past') return eventDate <= now && booking.status !== 'cancelled';
      if (tab === 'cancelled') return booking.status === 'cancelled';
      return true;
    });
  };

  const filteredBookings = filterBookings(activeTab);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 mt-1">View and manage your event bookings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredBookings.length === 0 ? (
        <EmptyState message={`No ${activeTab} bookings found`} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-40">
                <img
                  src={booking.event?.images?.[0] || booking.event?.image}
                  alt={booking.event?.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="160"><rect width="400" height="160" fill="#f97316"/><text x="200" y="90" font-size="40" text-anchor="middle" fill="white">🎉</text></svg>`)}`; }}
                />
                <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${
                  booking.status === 'active' ? 'bg-green-100 text-green-700' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {booking.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{booking.event?.title}</h3>
                <div className="space-y-1.5 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{new Date(booking.event?.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{booking.event?.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket size={14} />
                    <span className="font-mono text-xs">{booking.ticketId}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3 pb-3 border-t border-gray-100 pt-3">
                  <span className="text-sm text-gray-500">{booking.numberOfTickets} ticket{booking.numberOfTickets > 1 ? 's' : ''}</span>
                  <span className="text-sm font-bold text-gray-900">₹{booking.totalAmount?.toLocaleString()}</span>
                </div>
                {booking.addOns?.length > 0 && (
                  <div className="mb-3 pb-3 border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-400 mb-1">Add-ons:</p>
                    <div className="flex flex-wrap gap-1">
                      {booking.addOns.map((a, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          {a.name} × {a.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewTicket(booking)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Eye size={14} />
                    View Ticket
                  </button>
                  {canCancel(booking) && (
                    <button
                      onClick={() => setCancelConfirm(booking)}
                      className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <XCircle size={14} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cancelConfirm && (
        <Modal onClose={() => setCancelConfirm(null)} title="Cancel Booking">
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Event:</span>
                <span className="font-medium text-gray-900">{cancelConfirm.event?.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium text-gray-900">{new Date(cancelConfirm.event?.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ticket ID:</span>
                <span className="font-medium text-gray-900 font-mono">{cancelConfirm.ticketId}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCancelConfirm(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Keep Booking</button>
              <button onClick={handleCancel} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Cancel Booking</button>
            </div>
          </div>
        </Modal>
      )}

      {viewTicket && (
        <Modal onClose={() => setViewTicket(null)} title="Ticket Details">
          <div className="p-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm opacity-80">EVENT TICKET</span>
                <span className="text-sm font-mono">{viewTicket.ticketId}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{viewTicket.event?.title}</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs opacity-70">Date</p>
                  <p className="font-medium">{new Date(viewTicket.event?.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Time</p>
                  <p className="font-medium">{viewTicket.event?.time}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Location</p>
                  <p className="font-medium">{viewTicket.event?.location || viewTicket.event?.venue}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Tickets</p>
                  <p className="font-medium">{viewTicket.numberOfTickets}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs opacity-70 mb-1">Attendee</p>
                <p className="font-medium">{viewTicket.client?.name || 'You'}</p>
              </div>
              {viewTicket.addOns?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-xs opacity-70 mb-2">Add-ons:</p>
                  <div className="space-y-1">
                    {viewTicket.addOns.map((a, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="opacity-90">{a.name} × {a.quantity}</span>
                        <span className="font-medium">₹{(a.price * a.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  {viewTicket.addOnsTotal > 0 && (
                    <div className="flex justify-between text-sm mt-2 pt-2 border-t border-white/20">
                      <span className="opacity-70">Add-ons Total</span>
                      <span className="font-medium">₹{viewTicket.addOnsTotal.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="flex justify-between">
                  <span className="text-sm opacity-70">Total Paid</span>
                  <span className="text-lg font-bold">₹{viewTicket.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setViewTicket(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
