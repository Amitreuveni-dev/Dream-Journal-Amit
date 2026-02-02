import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Dream } from '../models/Dream.js';
import {
  createDreamSchema,
  updateDreamSchema,
  dreamIdSchema,
  dreamQuerySchema,
} from '../validation/dreamValidation.js';
import {
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
} from '../middlewares/errorHandler.js';

/**
 * Get all dreams for the authenticated user
 * GET /api/dreams
 */
export async function getDreams(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    // Validate and parse query parameters
    const query = dreamQuerySchema.parse(req.query);
    const { page, limit, search, sortBy, sortOrder, mood, isLucid, startDate, endDate } = query;

    // Build filter
    const filter: Record<string, unknown> = {
      user: new Types.ObjectId(userId),
      isDeleted: false,
    };

    if (mood) {
      filter.mood = mood;
    }

    if (typeof isLucid === 'boolean') {
      filter.isLucid = isLucid;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        (filter.date as Record<string, Date>).$gte = new Date(startDate);
      }
      if (endDate) {
        (filter.date as Record<string, Date>).$lte = new Date(endDate);
      }
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [dreams, total] = await Promise.all([
      Dream.find(filter).sort(sort).skip(skip).limit(limit),
      Dream.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        dreams,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single dream by ID
 * GET /api/dreams/:id
 */
export async function getDreamById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    const { id } = dreamIdSchema.parse(req.params);

    const dream = await Dream.findById(id);

    if (!dream) {
      throw new NotFoundError('Dream not found');
    }

    // Check ownership
    if (dream.user.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to view this dream');
    }

    res.status(200).json({
      success: true,
      data: { dream },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new dream
 * POST /api/dreams
 */
export async function createDream(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    const validatedData = createDreamSchema.parse(req.body);

    const dream = new Dream({
      ...validatedData,
      user: new Types.ObjectId(userId),
      date: validatedData.date ? new Date(validatedData.date) : new Date(),
    });

    await dream.save();

    res.status(201).json({
      success: true,
      message: 'Dream created successfully',
      data: { dream },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update a dream
 * PUT /api/dreams/:id
 */
export async function updateDream(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    const { id } = dreamIdSchema.parse(req.params);
    const validatedData = updateDreamSchema.parse(req.body);

    const dream = await Dream.findById(id);

    if (!dream) {
      throw new NotFoundError('Dream not found');
    }

    // Check ownership
    if (dream.user.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to update this dream');
    }

    // Update fields
    Object.assign(dream, validatedData);
    if (validatedData.date) {
      dream.date = new Date(validatedData.date);
    }

    await dream.save();

    res.status(200).json({
      success: true,
      message: 'Dream updated successfully',
      data: { dream },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Soft delete a dream (move to trash)
 * DELETE /api/dreams/:id
 */
export async function deleteDream(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    const { id } = dreamIdSchema.parse(req.params);

    const dream = await Dream.findById(id);

    if (!dream) {
      throw new NotFoundError('Dream not found');
    }

    // Check ownership
    if (dream.user.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to delete this dream');
    }

    // Soft delete
    await dream.softDelete();

    res.status(200).json({
      success: true,
      message: 'Dream moved to trash',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get trashed dreams
 * GET /api/dreams/trash
 */
export async function getTrashedDreams(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    const dreams = await Dream.findTrashed(new Types.ObjectId(userId));

    res.status(200).json({
      success: true,
      data: { dreams },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Restore a dream from trash
 * POST /api/dreams/:id/restore
 */
export async function restoreDream(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    const { id } = dreamIdSchema.parse(req.params);

    const dream = await Dream.findById(id);

    if (!dream) {
      throw new NotFoundError('Dream not found');
    }

    // Check ownership
    if (dream.user.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to restore this dream');
    }

    if (!dream.isDeleted) {
      res.status(400).json({
        success: false,
        message: 'Dream is not in trash',
      });
      return;
    }

    // Restore
    await dream.restore();

    res.status(200).json({
      success: true,
      message: 'Dream restored successfully',
      data: { dream },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Permanently delete a dream
 * DELETE /api/dreams/:id/permanent
 */
export async function permanentlyDeleteDream(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    const { id } = dreamIdSchema.parse(req.params);

    const dream = await Dream.findById(id);

    if (!dream) {
      throw new NotFoundError('Dream not found');
    }

    // Check ownership
    if (dream.user.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to delete this dream');
    }

    // Permanent delete
    await Dream.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Dream permanently deleted',
    });
  } catch (error) {
    next(error);
  }
}
