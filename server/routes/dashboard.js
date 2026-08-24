import express from 'express';
import {
  getAdminDashboard,
  getEmployeeDashboard,
  getClientDashboard
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin', protect, authorize('admin'), getAdminDashboard);
router.get('/employee', protect, authorize('employee'), getEmployeeDashboard);
router.get('/client', protect, authorize('client'), getClientDashboard);

export default router;