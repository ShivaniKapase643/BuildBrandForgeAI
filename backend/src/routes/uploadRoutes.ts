import { Router } from 'express';
import multer from 'multer';
import { saveOriginalImage } from '../services/imageService.js';
import { protect } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (_req, file, cb) => {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) return cb(null, true);
  cb(new Error('Unsupported file type'));
}});

router.post('/image', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }
    const url = await saveOriginalImage(req.file);
    return res.status(200).json({ url });
  } catch (error) {
    return next(error);
  }
});

export default router;
