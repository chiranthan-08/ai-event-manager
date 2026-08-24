import express from 'express';
import {
  createRegistration,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration
} from '../controllers/registrationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('client'), createRegistration);
router.get('/my-registrations', protect, authorize('client'), getMyRegistrations);
router.get('/event/:eventId', protect, authorize(['admin', 'employee']), getEventRegistrations);
router.post('/:id/cancel', protect, authorize('client'), cancelRegistration);

export default router;