import { z } from 'zod';

export const dreamSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content must be at most 10,000 characters'),
  date: z.string().min(1, 'Date is required'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').default([]),
  isLucid: z.boolean().default(false),
  mood: z
    .enum(['happy', 'sad', 'anxious', 'peaceful', 'confused', 'excited', 'fearful', 'neutral', ''])
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  clarity: z.number().min(1).max(5).default(3),
});

export type DreamFormData = z.infer<typeof dreamSchema>;
