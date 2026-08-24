import express from 'express';
import {
  getEventSuggestions,
  visualizeEvent
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/event-suggestions', protect, getEventSuggestions);
router.post('/visualize-event', protect, visualizeEvent);

export default router;