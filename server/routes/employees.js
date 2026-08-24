import express from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignEvent
} from '../controllers/employeeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', protect, authorize('admin'), createEmployee);
router.put('/:id', protect, authorize('admin'), updateEmployee);
router.delete('/:id', protect, authorize('admin'), deleteEmployee);
router.post('/:id/assign-event', protect, authorize('admin'), assignEvent);

export default router;