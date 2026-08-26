import api from './api';

export const createOrder = (data) => api.post('/payments/create-order', data);
export const verifyPayment = (data) => api.post('/payments/verify', data);
export const refundPayment = (id) => api.post('/payments/refund', { paymentId: id });
export const getPaymentHistory = (params = {}) => api.get('/payments/history', { params });
export const getAllPayments = (config = {}) => api.get('/payments/all', config);

export default { createOrder, verifyPayment, refundPayment, getPaymentHistory, getAllPayments };
