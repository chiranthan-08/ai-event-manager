import api from './api';

export const getClients = (params = {}) => api.get('/auth/users', { params: { ...params, role: 'client' } });
export const getClientDetails = (id) => api.get(`/auth/profile`);
export const getAllUsers = (params = {}) => api.get('/auth/users', { params });

export default { getClients, getClientDetails, getAllUsers };
