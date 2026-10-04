import { Router } from 'express';
import { createBrand, getBrand, updateBrand } from '../controllers/brandController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getBrand);
router.post('/', protect, createBrand);
router.put('/', protect, updateBrand);

export default router;
