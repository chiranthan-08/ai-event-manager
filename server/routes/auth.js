import express from 'express';
import {
  register,
  login,
  getProfile,
  getAllUsers,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import { registerValidation, loginValidation } from '../utils/validators.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/users', protect, authorize('admin'), getAllUsers);

export default router;