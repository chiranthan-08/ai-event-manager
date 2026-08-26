import express from 'express';
import {
  getDecorations,
  getDecorationById,
  createDecoration,
  updateDecoration,
  deleteDecoration
} from '../controllers/decorationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDecorations);
router.get('/:id', getDecorationById);
router.post('/', protect, authorize(['admin', 'employee']), createDecoration);
router.put('/:id', protect, authorize(['admin', 'employee']), updateDecoration);
router.delete('/:id', protect, authorize(['admin', 'employee']), deleteDecoration);

export default router;
