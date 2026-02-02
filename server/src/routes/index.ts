import { Router } from 'express';
import authRoutes from './authRoutes.js';
import dreamRoutes from './dreamRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dreams', dreamRoutes);
router.use('/users', userRoutes);

// Future routes
// router.use('/analysis', analysisRoutes);
// router.use('/insights', insightsRoutes);

export default router;
