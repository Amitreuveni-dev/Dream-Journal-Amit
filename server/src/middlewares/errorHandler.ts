import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class ApiError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  stack?: string;
}

export function errorHandler(
  err: AppError | ZodError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const response: ErrorResponse = {
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    };

    res.status(400).json(response);
    return;
  }

  // Handle known operational errors
  if ('isOperational' in err && err.isOperational) {
    const response: ErrorResponse = {
      success: false,
      message: err.message,
    };

    if (isDevelopment) {
      response.stack = err.stack;
    }

    res.status(err.statusCode || 500).json(response);
    return;
  }

  // Log unexpected errors
  console.error('Unexpected Error:', err);

  // Handle unknown errors
  const response: ErrorResponse = {
    success: false,
    message: isDevelopment ? err.message : 'An unexpected error occurred',
  };

  if (isDevelopment) {
    response.stack = err.stack;
  }

  res.status(500).json(response);
}

export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
}
