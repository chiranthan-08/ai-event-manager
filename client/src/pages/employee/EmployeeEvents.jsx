import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Eye, Calendar, Users, MapPin } from 'lucide-react';
import EventForm from '../../components/EventForm';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getEvents, createEvent, updateEvent } from '../../services/eventService';
import { getEventRegistrations } from '../../services/registrationService';
import toast from 'react-hot-toast';

export default function EmployeeEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewRegistrations, setViewRegistrations] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      setEvents(response.data.events || response.data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await createEvent(formData);
      toast.success('Event created successfully');
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateEvent(editingEvent._id, formData);
      toast.success('Event updated successfully');
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event');
    }
  };

  const handleViewRegistrations = async (event) => {
    try {
      setLoadingRegistrations(true);
      setViewRegistrations(event);
      const response = await getEventRegistrations(event._id);
      setRegistrations(response.data.registrations || response.data);
    } catch (error) {
      toast.error('Failed to load registrations');
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title?.toLowerCase().includes(search.toLowerCase()) ||
    event.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Events</h1>
          <p className="text-gray-500 mt-1">Manage your assigned events</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Create Event
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search events by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredEvents.length === 0 ? (
        <EmptyState message="No events found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${
                  event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                  event.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {event.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>{event.availableSeats}/{event.totalSeats} seats available</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setEditingEvent(event)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleViewRegistrations(event)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <Eye size={14} />
                    Registrations
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showModal || editingEvent) && (
        <Modal onClose={() => { setShowModal(false); setEditingEvent(null); }} title={editingEvent ? 'Edit Event' : 'Create Event'}>
          <EventForm
            initialData={editingEvent}
            onSubmit={editingEvent ? handleUpdate : handleCreate}
            onCancel={() => { setShowModal(false); setEditingEvent(null); }}
          />
        </Modal>
      )}

      {viewRegistrations && (
        <Modal onClose={() => { setViewRegistrations(null); setRegistrations([]); }} title={`Registrations - ${viewRegistrations.title}`}>
          <div className="p-6">
            {loadingRegistrations ? (
              <LoadingSpinner />
            ) : registrations.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No registrations yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {registrations.map((reg) => (
                  <div key={reg._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={reg.client?.image || `https://ui-avatars.com/api/?name=${reg.client?.name}&background=random`}
                      alt={reg.client?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{reg.client?.name}</p>
                      <p className="text-sm text-gray-500">{reg.client?.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      reg.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      reg.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {reg.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={() => { setViewRegistrations(null); setRegistrations([]); }} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
