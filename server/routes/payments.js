import express from 'express';
import {
  createOrder,
  verifyPayment,
  refundPayment,
  getPaymentHistory,
  getAllPayments
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', protect, authorize('client'), createOrder);
router.post('/verify', protect, authorize('client'), verifyPayment);
router.post('/refund', protect, authorize('admin'), refundPayment);
router.get('/history', protect, getPaymentHistory);
router.get('/all', protect, authorize('admin'), getAllPayments);

export default router;