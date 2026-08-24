import express from 'express';
import {
  getDecorations,
  createDecoration,
  deleteDecoration
} from '../controllers/decorationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDecorations);
router.post('/', protect, authorize(['admin', 'employee']), createDecoration);
router.delete('/:id', protect, authorize('admin'), deleteDecoration);

export default router;