import express from 'express';
import {
  getOrganizerDashboard,
  getOrganizerEvents,
  checkAvailability,
  getAllOrganizersAvailability,
  addToWaitingList,
  getWaitingList,
  cancelEvent,
  getOrganizerBookings,
  getOrganizerClients,
  getOrganizerPayments,
  getOrganizerSettings,
  updateOrganizerSettings,
} from '../controllers/organizerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('employee'), getOrganizerDashboard);
router.get('/events', protect, authorize('employee'), getOrganizerEvents);
router.get('/availability', getAllOrganizersAvailability);
router.get('/availability/:id', checkAvailability);
router.post('/waiting-list', protect, authorize('client'), addToWaitingList);
router.get('/waiting-list', protect, authorize('employee'), getWaitingList);
router.put('/events/:id/cancel', protect, authorize('employee'), cancelEvent);
router.get('/bookings', protect, authorize('employee'), getOrganizerBookings);
router.get('/clients', protect, authorize('employee'), getOrganizerClients);
router.get('/payments', protect, authorize('employee'), getOrganizerPayments);
router.get('/settings', protect, authorize('employee'), getOrganizerSettings);
router.put('/settings', protect, authorize('employee'), updateOrganizerSettings);

export default router;
