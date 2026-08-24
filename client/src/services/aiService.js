import api from './api';

export const getEventSuggestions = (data) => api.post('/ai/event-suggestions', data);
export const visualizeEvent = (data) => api.post('/ai/visualize-event', data);

export default { getEventSuggestions, visualizeEvent };
