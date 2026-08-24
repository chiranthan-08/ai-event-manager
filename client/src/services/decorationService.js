import api from './api';

export const getDecorations = (category) => {
  const params = category ? { category } : {};
  return api.get('/decorations', { params });
};
export const createDecoration = (data) => api.post('/decorations', data);
export const deleteDecoration = (id) => api.delete(`/decorations/${id}`);

export default { getDecorations, createDecoration, deleteDecoration };
