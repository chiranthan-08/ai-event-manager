import api from './api';

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (data) => api.put('/auth/profile', data);
export const changePassword = (data) => api.put('/auth/change-password', data);
export const googleLogin = (credential) => api.post('/auth/google', { credential });

export default { login, register, getProfile, updateProfile, changePassword, googleLogin };
