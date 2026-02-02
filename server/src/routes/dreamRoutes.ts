import { Router } from 'express';
import {
  getDreams,
  getDreamById,
  createDream,
  updateDream,
  deleteDream,
  getTrashedDreams,
  restoreDream,
  permanentlyDeleteDream,
} from '../controllers/dreamController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

// All dream routes require authentication
router.use(authenticate);

// Trash routes (must be before /:id routes)
router.get('/trash', getTrashedDreams);
router.post('/:id/restore', restoreDream);
router.delete('/:id/permanent', permanentlyDeleteDream);

// CRUD routes
router.get('/', getDreams);
router.get('/:id', getDreamById);
router.post('/', createDream);
router.put('/:id', updateDream);
router.delete('/:id', deleteDream);

export default router;
