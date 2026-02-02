import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { updateProfileSchema, changePasswordSchema } from '../validation/userValidation.js';
import {
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} from '../middlewares/errorHandler.js';

/**
 * Get user profile
 * GET /api/users/profile
 */
export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      success: true,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user profile
 * PUT /api/users/profile
 */
export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    // Validate request body
    const validatedData = updateProfileSchema.parse(req.body);

    // Check if username is being changed and if it's already taken
    if (validatedData.username) {
      const existingUser = await User.findOne({
        username: validatedData.username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw new ConflictError('Username is already taken');
      }
    }

    // Build update object
    const updateData: Record<string, unknown> = {};

    if (validatedData.username !== undefined) {
      updateData.username = validatedData.username;
    }

    if (validatedData.bio !== undefined) {
      updateData.bio = validatedData.bio;
    }

    if (validatedData.preferences) {
      // Merge with existing preferences
      const user = await User.findById(userId);
      if (user) {
        updateData.preferences = {
          ...user.preferences,
          ...validatedData.preferences,
        };
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Change password
 * PUT /api/users/password
 */
export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    // Validate request body
    const validatedData = changePasswordSchema.parse(req.body);

    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(validatedData.currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Update password (will be hashed by pre-save hook)
    user.password = validatedData.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete account
 * DELETE /api/users/account
 */
export async function deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    await User.findByIdAndDelete(userId);

    // Clear the token cookie
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
