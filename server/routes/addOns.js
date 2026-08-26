import express from 'express';
import { getAddOns, getAddOnCategories } from '../controllers/addOnController.js';

const router = express.Router();

router.get('/', getAddOns);
router.get('/categories', getAddOnCategories);

export default router;
