import { z } from 'zod';

/**
 * ============================================================
 * ANALYSIS VALIDATION - Zod Schemas
 * ============================================================
 *
 * WHAT IS ZOD?
 * - A TypeScript-first validation library
 * - Validates data at runtime (when the app runs)
 * - Gives you TypeScript types automatically
 *
 * WHY VALIDATE?
 * - Prevent bad data from reaching your database
 * - Give clear error messages to API users
 * - Security: reject malicious input
 */

// ============================================================
// Schema for analyzing a dream by its ID
// ============================================================

/**
 * Use this when: POST /api/analysis/dream/:id
 * The user wants to analyze an existing dream
 */
export const analyzeDreamByIdSchema = z.object({
  id: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid dream ID format'), // MongoDB ObjectId format
});

// ============================================================
// Schema for analyzing raw text (without saving)
// ============================================================

/**
 * Use this when: POST /api/analysis/analyze
 * The user wants to analyze text without a saved dream
 */
export const analyzeTextSchema = z.object({
  content: z
    .string()
    .min(10, 'Dream content must be at least 10 characters')
    .max(10000, 'Dream content must be at most 10,000 characters'),
});

// ============================================================
// TypeScript types (auto-generated from schemas)
// ============================================================

/**
 * z.infer extracts the TypeScript type from a Zod schema.
 * This keeps your types in sync with validation rules!
 */
export type AnalyzeDreamByIdInput = z.infer<typeof analyzeDreamByIdSchema>;
export type AnalyzeTextInput = z.infer<typeof analyzeTextSchema>;
