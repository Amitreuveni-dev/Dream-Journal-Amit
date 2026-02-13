import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import {
  analyzeDreamById,
  analyzeText,
  reanalyzeDream,
} from '../controllers/analysisController.js';

/**
 * ============================================================
 * ANALYSIS ROUTES
 * ============================================================
 *
 * WHAT ARE ROUTES?
 * - Define URL patterns (endpoints) for your API
 * - Connect URLs to controller functions
 * - Apply middleware (like authentication)
 *
 * URL STRUCTURE:
 * All routes here are prefixed with /api/analysis
 * (configured in routes/index.ts)
 *
 * ENDPOINTS:
 * POST /api/analysis/dream/:id    - Analyze existing dream (saves result)
 * POST /api/analysis/analyze      - Analyze text (doesn't save)
 * POST /api/analysis/dream/:id/reanalyze - Re-run analysis
 */

const router = Router();

// ============================================================
// Apply authentication middleware to ALL routes
// ============================================================

/**
 * router.use(authenticate) means:
 * - Every route below requires a valid JWT token
 * - If not authenticated, returns 401 Unauthorized
 * - The user's ID is attached to req.userId
 */
router.use(authenticate);

// ============================================================
// Route definitions
// ============================================================

/**
 * POST /api/analysis/dream/:id
 * Analyze an existing dream and save the analysis
 *
 * Request: { params: { id: "dream_id" } }
 * Response: { success: true, data: { dream, analysis } }
 */
router.post('/dream/:id', analyzeDreamById);

/**
 * POST /api/analysis/analyze
 * Analyze raw text without saving
 *
 * Request: { body: { content: "dream text..." } }
 * Response: { success: true, data: { analysis } }
 */
router.post('/analyze', analyzeText);

/**
 * POST /api/analysis/dream/:id/reanalyze
 * Re-run analysis on a dream (overwrites previous)
 *
 * Request: { params: { id: "dream_id" } }
 * Response: { success: true, data: { dream, analysis } }
 */
router.post('/dream/:id/reanalyze', reanalyzeDream);

export default router;
