import { Router } from 'express';
import authRoutes from './authRoutes.js';

const router = Router();

router.use('/auth', authRoutes);

// Future routes
// router.use('/dreams', dreamRoutes);
// router.use('/users', userRoutes);
// router.use('/analysis', analysisRoutes);
// router.use('/insights', insightsRoutes);

export default router;
