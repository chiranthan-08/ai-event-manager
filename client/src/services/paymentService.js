import api from './api';

export const createOrder = (data) => api.post('/payments/create-order', data);
export const verifyPayment = (data) => api.post('/payments/verify', data);
export const refundPayment = (data) => api.post('/payments/refund', data);
export const getPaymentHistory = () => api.get('/payments/history');
export const getAllPayments = () => api.get('/payments/all');

export default { createOrder, verifyPayment, refundPayment, getPaymentHistory, getAllPayments };
