import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { UnauthorizedError } from './errorHandler.js';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token from cookies and attaches user info to request
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    // Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    // Handle JWT-specific errors
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        next(new UnauthorizedError('Invalid token'));
        return;
      }
      if (error.name === 'TokenExpiredError') {
        next(new UnauthorizedError('Token expired'));
        return;
      }
    }
    next(error);
  }
}

/**
 * Optional authentication middleware
 * Attempts to authenticate but doesn't fail if no token present
 */
export function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const token = req.cookies?.token;

    if (token) {
      const decoded = verifyToken(token);
      req.userId = decoded.userId;
      req.userEmail = decoded.email;
    }

    next();
  } catch {
    // Silently ignore authentication errors for optional auth
    next();
  }
}
