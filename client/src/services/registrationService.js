import api from './api';

export const createRegistration = (data) => api.post('/registrations', data);
export const getMyRegistrations = () => api.get('/registrations/my-registrations');
export const cancelRegistration = (id) => api.post(`/registrations/${id}/cancel`);
export const getEventRegistrations = (eventId) => api.get(`/registrations/event/${eventId}`);

export default { createRegistration, getMyRegistrations, cancelRegistration, getEventRegistrations };
