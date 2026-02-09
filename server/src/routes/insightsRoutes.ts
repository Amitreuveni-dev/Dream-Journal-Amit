import { Router } from 'express';
import {
  getStats,
  getMoodDistribution,
  getSymbolFrequency,
} from '../controllers/insightsController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

// All insights routes require authentication
router.use(authenticate);

router.get('/stats', getStats);
router.get('/moods', getMoodDistribution);
router.get('/symbols', getSymbolFrequency);

export default router;
