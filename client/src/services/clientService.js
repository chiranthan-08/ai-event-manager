import api from './api';

export const getClients = () => api.get('/dashboard/admin');
export const getClientDetails = (id) => api.get(`/auth/profile`);

export default { getClients, getClientDetails };
