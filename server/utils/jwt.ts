import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { User } from '../models/user.model';

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (user: User): string => {
  const payload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email
  };

  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRE;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, secret, {
    expiresIn
  });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.verify(token, secret) as TokenPayload;
};

export const sendTokenCookie = (res: Response, token: string): void => {
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieExpireTime = 7 * 24 * 60 * 60 * 1000;

  res.cookie('authToken', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: cookieExpireTime,
    path: '/'
  });
};

export const clearAuthCookie = (res: Response): void => {
  res.cookie('authToken', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });
};