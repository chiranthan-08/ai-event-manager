import api from './api';

export const getAdminDashboard = () => api.get('/dashboard/admin');
export const getEmployeeDashboard = () => api.get('/dashboard/employee');
export const getClientDashboard = () => api.get('/dashboard/client');

export default { getAdminDashboard, getEmployeeDashboard, getClientDashboard };
