import express from 'express';
import {
  getEventSuggestions,
  visualizeEvent
} from '../controllers/aiController.js';

const router = express.Router();

router.post('/event-suggestions', getEventSuggestions);
router.post('/visualize-event', visualizeEvent);

export default router;