import api from './api';

export const getDecorations = (params = {}) => {
  return api.get('/decorations', { params });
};
export const getDecorationById = (id) => {
  return api.get(`/decorations/${id}`);
};
export const getDecorationsByEvent = (eventId) => {
  return api.get('/decorations', { params: { event: eventId } });
};
export const createDecoration = (data) => api.post('/decorations', data);
export const updateDecoration = (id, data) => api.put(`/decorations/${id}`, data);
export const deleteDecoration = (id) => api.delete(`/decorations/${id}`);

export default { getDecorations, getDecorationById, getDecorationsByEvent, createDecoration, updateDecoration, deleteDecoration };
