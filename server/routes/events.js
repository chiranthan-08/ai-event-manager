import express from 'express';
import {
  getEvents,
  getEventStats,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/auth.js';
import { eventValidation } from '../utils/validators.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/stats', protect, authorize('admin'), getEventStats);
router.get('/:id', getEvent);
router.post('/', protect, authorize(['admin', 'employee']), eventValidation, createEvent);
router.put('/:id', protect, authorize(['admin', 'employee']), updateEvent);
router.delete('/:id', protect, authorize(['admin']), deleteEvent);

export default router;