import { Router } from 'express';
import authRoutes from './authRoutes.js';
import dreamRoutes from './dreamRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dreams', dreamRoutes);

// Future routes
// router.use('/users', userRoutes);
// router.use('/analysis', analysisRoutes);
// router.use('/insights', insightsRoutes);

export default router;
