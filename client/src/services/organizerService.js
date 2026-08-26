import api from './api';

export const getOrganizerDashboard = () => api.get('/organizer/dashboard');
export const getOrganizerEvents = (params = {}) => api.get('/organizer/events', { params });
export const getOrganizerBookings = (params = {}) => api.get('/organizer/bookings', { params });
export const getOrganizerClients = (params = {}) => api.get('/organizer/clients', { params });
export const getOrganizerPayments = (params = {}) => api.get('/organizer/payments', { params });
export const checkAvailability = (organizerId, date) =>
  api.get(`/organizer/availability/${organizerId}`, { params: { date } });
export const getAllOrganizersAvailability = (date) =>
  api.get('/organizer/availability', { params: { date } });
export const addToWaitingList = (data) => api.post('/organizer/waiting-list', data);
export const getWaitingList = (params = {}) => api.get('/organizer/waiting-list', { params });
export const cancelOrganizerEvent = (eventId) =>
  api.put(`/organizer/events/${eventId}/cancel`);
export const getOrganizerSettings = () => api.get('/organizer/settings');
export const updateOrganizerSettings = (data) => api.put('/organizer/settings', data);

export default {
  getOrganizerDashboard,
  getOrganizerEvents,
  getOrganizerBookings,
  getOrganizerClients,
  getOrganizerPayments,
  checkAvailability,
  getAllOrganizersAvailability,
  addToWaitingList,
  getWaitingList,
  cancelOrganizerEvent,
  getOrganizerSettings,
  updateOrganizerSettings,
};
