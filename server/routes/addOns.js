import express from 'express';
import { getAddOns, getAddOnCategories, createAddOn, updateAddOn, deleteAddOn } from '../controllers/addOnController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAddOns);
router.get('/categories', getAddOnCategories);
router.post('/', protect, authorize('admin'), createAddOn);
router.put('/:id', protect, authorize('admin'), updateAddOn);
router.delete('/:id', protect, authorize('admin'), deleteAddOn);

export default router;
