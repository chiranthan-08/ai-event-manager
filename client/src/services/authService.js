import api from './api';

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/profile');

export default { login, register, getProfile };
