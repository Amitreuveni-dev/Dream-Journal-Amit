import { z } from 'zod';

export const moodOptions = [
  'happy',
  'sad',
  'anxious',
  'peaceful',
  'confused',
  'excited',
  'fearful',
  'neutral',
] as const;

export type MoodType = typeof moodOptions[number];

export const dreamSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  content: z
    .string()
    .min(10, 'Dream content must be at least 10 characters')
    .max(10000, 'Dream content must be at most 10,000 characters'),
  date: z
    .string()
    .optional(),
  tags: z
    .array(z.string().max(50))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  isLucid: z
    .boolean()
    .optional(),
  mood: z
    .enum(moodOptions)
    .optional(),
  clarity: z
    .number()
    .min(1, 'Clarity must be between 1 and 5')
    .max(5, 'Clarity must be between 1 and 5')
    .optional(),
});

export type DreamFormData = z.infer<typeof dreamSchema>;
