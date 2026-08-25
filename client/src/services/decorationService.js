import api from './api';

export const getDecorations = (params = {}) => {
  return api.get('/decorations', { params });
};
export const getDecorationsByEvent = (eventId) => {
  return api.get('/decorations', { params: { event: eventId } });
};
export const createDecoration = (data) => api.post('/decorations', data);
export const deleteDecoration = (id) => api.delete(`/decorations/${id}`);

export default { getDecorations, getDecorationsByEvent, createDecoration, deleteDecoration };
