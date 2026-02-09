import { Router } from 'express';
import multer from 'multer';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  uploadAvatar,
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

// Configure multer for memory storage (for Cloudinary upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed'));
    }
  },
});

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Avatar upload
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// Password route
router.put('/password', changePassword);

// Account deletion
router.delete('/account', deleteAccount);

export default router;
