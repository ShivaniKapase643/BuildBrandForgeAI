import { Router } from 'express';
import multer from 'multer';
import { approveContent, deleteContent, exportContent, generateContent, getAnalytics, getContentById, listContent, regenerateContent, updateContent } from '../controllers/contentController.js';
import { protect } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
  },
});

const router = Router();
router.post('/generate', protect, upload.single('image'), generateContent);
router.get('/', protect, listContent);
router.get('/:id', protect, getContentById);
router.put('/:id', protect, updateContent);
router.delete('/:id', protect, deleteContent);
router.post('/:id/approve', protect, approveContent);
router.post('/:id/regenerate', protect, regenerateContent);
router.get('/:id/export', protect, exportContent);
router.get('/analytics', protect, getAnalytics);

export default router;
