import { useState, useEffect, useMemo } from 'react';
import { Search, Eye, Calendar, Users, MapPin, Clock, X, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getOrganizerEvents, checkAvailability, cancelOrganizerEvent } from '../../services/organizerService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function EmployeeEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearch, setLocalSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrganizerEvents();
      setEvents(response.data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    if (!user?.id) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await checkAvailability(user.id, today);
      setAvailability(response.data);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [user?.id]);

  const handleCancelEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to cancel this event?')) return;
    try {
      setCancellingId(eventId);
      await cancelOrganizerEvent(eventId);
      toast.success('Event cancelled successfully');
      fetchEvents();
      fetchAvailability();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel event');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const q = localSearch.toLowerCase();
      const matchesSearch =
        !localSearch ||
        event.title?.toLowerCase().includes(q) ||
        event.venue?.toLowerCase().includes(q) ||
        event.location?.toLowerCase().includes(q) ||
        event.category?.toLowerCase().includes(q);
      const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [events, localSearch, filterStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Events</h1>
        <p className="text-gray-500 mt-1">Events assigned to you</p>
      </div>

      {availability && (
        <div className={`rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
          availability.isFullyBooked
            ? 'bg-red-50 border border-red-200'
            : 'bg-emerald-50 border border-emerald-200'
        }`}>
          <div className="flex-1">
            <p className={`font-semibold ${availability.isFullyBooked ? 'text-red-800' : 'text-emerald-800'}`}>
              Today's Availability: {availability.slotsUsed}/{availability.maxSlots} slots used
            </p>
            <p className={`text-sm mt-1 ${availability.isFullyBooked ? 'text-red-600' : 'text-emerald-600'}`}>
              {availability.isFullyBooked
                ? 'Fully booked for today. Waiting list is active.'
                : `${availability.slotsAvailable} slot${availability.slotsAvailable !== 1 ? 's' : ''} available`}
            </p>
          </div>
          <div className={`text-2xl font-bold ${availability.isFullyBooked ? 'text-red-600' : 'text-emerald-600'}`}>
            {availability.slotsUsed}/{availability.maxSlots}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search events by title, venue, or location..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 mb-3">{error}</p>
          <button onClick={fetchEvents} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState message="No events found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <img
                  src={event.images?.[0] || 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=600&h=400&fit=crop'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
                <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full bg-white/90 text-gray-700">
                  {event.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-500" />
                    <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-emerald-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-emerald-500" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-emerald-500" />
                    <span>{event.registeredAttendees || 0}/{event.capacity} seats ({event.occupancyRate || 0}%)</span>
                  </div>
                </div>
                {event.client && (
                  <div className="mt-2 text-xs text-gray-500">
                    Client: {event.client.name || event.createdBy?.name}
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <Eye size={14} />
                    Details
                  </button>
                  {event.status === 'upcoming' && (
                    <button
                      onClick={() => handleCancelEvent(event._id)}
                      disabled={cancellingId === event._id}
                      className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <AlertTriangle size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-48">
              <img
                src={selectedEvent.images?.[0] || 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=600&h=400&fit=crop'}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-4 left-4 text-white">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedEvent.status)}`}>
                  {selectedEvent.status}
                </span>
                <h2 className="text-xl font-bold mt-2">{selectedEvent.title}</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600">{selectedEvent.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium">{selectedEvent.category}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{new Date(selectedEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium">{selectedEvent.time}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Venue</p>
                  <p className="font-medium">{selectedEvent.venue}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium">{selectedEvent.location}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Capacity</p>
                  <p className="font-medium">{selectedEvent.registeredAttendees || 0}/{selectedEvent.capacity} ({selectedEvent.occupancyRate || 0}%)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Ticket Price</p>
                  <p className="font-medium">{'\u20B9'}{selectedEvent.ticketPrice?.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Created By</p>
                  <p className="font-medium">{selectedEvent.createdBy?.name || 'Admin'}</p>
                </div>
              </div>

              {selectedEvent.registrations?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Registrations ({selectedEvent.registrations.length})</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedEvent.registrations.map((reg) => (
                      <div key={reg._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-sm">
                        <img
                          src={`https://ui-avatars.com/api/?name=${reg.client?.name}&background=random`}
                          alt={reg.client?.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{reg.client?.name}</p>
                          <p className="text-xs text-gray-500">{reg.client?.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{reg.numberOfTickets} ticket{reg.numberOfTickets !== 1 ? 's' : ''}</p>
                          <span className={`text-xs font-medium ${reg.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {reg.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedEvent.status === 'upcoming' && (
                  <button
                    onClick={() => { handleCancelEvent(selectedEvent._id); setSelectedEvent(null); }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Event
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
