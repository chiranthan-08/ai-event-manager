import api from './api';

export const getEvents = (params = {}) => api.get('/events', { params });
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const getEventStats = () => api.get('/events/stats');

export default { getEvents, getEvent, createEvent, updateEvent, deleteEvent, getEventStats };
