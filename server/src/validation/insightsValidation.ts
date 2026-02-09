import { z } from 'zod';

export const insightsQuerySchema = z.object({
  period: z
    .enum(['7d', '30d', '90d', '1y', 'all'])
    .optional()
    .default('30d'),
});

export type InsightsQueryInput = z.infer<typeof insightsQuerySchema>;
