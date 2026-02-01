import { z } from 'zod';

export const createDreamSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters')
    .trim(),
  content: z
    .string()
    .min(10, 'Dream content must be at least 10 characters')
    .max(10000, 'Dream content must be at most 10,000 characters')
    .trim(),
  date: z
    .string()
    .datetime()
    .optional()
    .default(() => new Date().toISOString()),
  tags: z
    .array(z.string().max(50))
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .default([]),
  isLucid: z
    .boolean()
    .optional()
    .default(false),
  mood: z
    .enum(['happy', 'sad', 'anxious', 'peaceful', 'confused', 'excited', 'fearful', 'neutral'])
    .optional(),
  clarity: z
    .number()
    .min(1, 'Clarity must be between 1 and 5')
    .max(5, 'Clarity must be between 1 and 5')
    .optional()
    .default(3),
});

export const updateDreamSchema = createDreamSchema.partial();

export const dreamIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid dream ID'),
});

export const dreamQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
  search: z.string().optional(),
  sortBy: z.enum(['date', 'title', 'createdAt']).optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  mood: z.enum(['happy', 'sad', 'anxious', 'peaceful', 'confused', 'excited', 'fearful', 'neutral']).optional(),
  isLucid: z.coerce.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateDreamInput = z.infer<typeof createDreamSchema>;
export type UpdateDreamInput = z.infer<typeof updateDreamSchema>;
export type DreamIdInput = z.infer<typeof dreamIdSchema>;
export type DreamQueryInput = z.infer<typeof dreamQuerySchema>;
