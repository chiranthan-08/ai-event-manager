import express from 'express';
import {
  getEventSuggestions,
  visualizeEvent,
  chatWithAI
} from '../controllers/aiController.js';

const router = express.Router();

router.post('/event-suggestions', getEventSuggestions);
router.post('/visualize-event', visualizeEvent);
router.post('/chat', chatWithAI);

export default router;