import { Router } from 'express';
import authRoutes from './authRoutes.js';
import dreamRoutes from './dreamRoutes.js';
import userRoutes from './userRoutes.js';
import insightsRoutes from './insightsRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dreams', dreamRoutes);
router.use('/users', userRoutes);
router.use('/insights', insightsRoutes);

// Future routes
// router.use('/analysis', analysisRoutes);

export default router;
