import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { env } from '../config/environment.js';
import { registerUserSchema, loginUserSchema } from '../validation/authValidation.js';
import {
  UnauthorizedError,
  ConflictError,
} from '../middlewares/errorHandler.js';
import { sendWelcomeEmail } from '../services/emailService.js';

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax' as const,
  maxAge: env.cookieMaxAge,
  path: '/',
};

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body
    const validatedData = registerUserSchema.parse(req.body);

    // Check if user already exists
    const existingEmail = await User.findOne({ email: validatedData.email.toLowerCase() });
    if (existingEmail) {
      throw new ConflictError('Email is already registered');
    }

    const existingUsername = await User.findOne({ username: validatedData.username });
    if (existingUsername) {
      throw new ConflictError('Username is already taken');
    }

    // Create new user
    const user = new User({
      username: validatedData.username,
      email: validatedData.email.toLowerCase(),
      password: validatedData.password,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Set cookie
    res.cookie('token', token, cookieOptions);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.username).catch((err) => {
      console.error('Failed to send welcome email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body
    const validatedData = loginUserSchema.parse(req.body);

    // Find user by email (include password for comparison)
    const user = await User.findByEmail(validatedData.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Set cookie
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 */
export async function logoutUser(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Clear the token cookie
    res.cookie('token', '', {
      ...cookieOptions,
      maxAge: 0,
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user
 * GET /api/auth/me
 */
export async function getCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // User is attached by auth middleware
    const userId = req.userId;
    if (!userId) {
      throw new UnauthorizedError('Not authenticated');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
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
 * Refresh token
 * POST /api/auth/refresh
 */
export async function refreshToken(
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
      throw new UnauthorizedError('User not found');
    }

    // Generate new token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Set new cookie
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Token refreshed',
    });
  } catch (error) {
    next(error);
  }
}
