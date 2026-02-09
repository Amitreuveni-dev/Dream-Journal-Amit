import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Dream } from '../models/Dream.js';
import { insightsQuerySchema } from '../validation/insightsValidation.js';
import { UnauthorizedError } from '../middlewares/errorHandler.js';

/**
 * Helper to calculate date range based on period
 */
function getDateRange(period: string): { start: Date | null; end: Date } {
  const end = new Date();
  let start: Date | null = null;

  switch (period) {
    case '7d':
      start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      start = new Date(end.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
    default:
      start = null;
      break;
  }

  return { start, end };
}

/**
 * Get general dream statistics
 * GET /api/insights/stats
 */
export async function getStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    const { period } = insightsQuerySchema.parse(req.query);
    const { start, end } = getDateRange(period);

    const matchStage: Record<string, unknown> = {
      user: new Types.ObjectId(userId),
      isDeleted: false,
    };

    if (start) {
      matchStage.date = { $gte: start, $lte: end };
    }

    const [stats] = await Dream.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalDreams: { $sum: 1 },
          avgClarity: { $avg: '$clarity' },
          lucidCount: {
            $sum: { $cond: ['$isLucid', 1, 0] },
          },
          totalTags: { $sum: { $size: { $ifNull: ['$tags', []] } } },
        },
      },
      {
        $project: {
          _id: 0,
          totalDreams: 1,
          avgClarity: { $round: [{ $ifNull: ['$avgClarity', 0] }, 1] },
          lucidCount: 1,
          lucidPercentage: {
            $cond: [
              { $eq: ['$totalDreams', 0] },
              0,
              {
                $round: [
                  { $multiply: [{ $divide: ['$lucidCount', '$totalDreams'] }, 100] },
                  1,
                ],
              },
            ],
          },
          avgTagsPerDream: {
            $cond: [
              { $eq: ['$totalDreams', 0] },
              0,
              { $round: [{ $divide: ['$totalTags', '$totalDreams'] }, 1] },
            ],
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats || {
        totalDreams: 0,
        avgClarity: 0,
        lucidCount: 0,
        lucidPercentage: 0,
        avgTagsPerDream: 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get mood distribution and dreams over time
 * GET /api/insights/moods
 */
export async function getMoodDistribution(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    const { period } = insightsQuerySchema.parse(req.query);
    const { start, end } = getDateRange(period);

    const matchStage: Record<string, unknown> = {
      user: new Types.ObjectId(userId),
      isDeleted: false,
    };

    if (start) {
      matchStage.date = { $gte: start, $lte: end };
    }

    // Get mood distribution
    const moodDistribution = await Dream.aggregate([
      {
        $match: {
          ...matchStage,
          mood: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          mood: '$_id',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get dreams over time
    const dreamsOverTime = await Dream.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' },
          },
          count: { $sum: 1 },
          date: { $first: '$date' },
        },
      },
      { $sort: { date: 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        moodDistribution,
        dreamsOverTime,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get symbol and tag frequency
 * GET /api/insights/symbols
 */
export async function getSymbolFrequency(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    const { period } = insightsQuerySchema.parse(req.query);
    const { start, end } = getDateRange(period);

    const matchStage: Record<string, unknown> = {
      user: new Types.ObjectId(userId),
      isDeleted: false,
    };

    if (start) {
      matchStage.date = { $gte: start, $lte: end };
    }

    // Get top tags
    const topTags = await Dream.aggregate([
      { $match: matchStage },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          tag: '$_id',
          count: 1,
        },
      },
    ]);

    // Get top AI-detected symbols
    const topSymbols = await Dream.aggregate([
      {
        $match: {
          ...matchStage,
          'analysis.symbols': { $exists: true, $ne: [] },
        },
      },
      { $unwind: '$analysis.symbols' },
      {
        $group: {
          _id: '$analysis.symbols',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          symbol: '$_id',
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        topTags,
        topSymbols,
      },
    });
  } catch (error) {
    next(error);
  }
}
