import { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../utils/jwt";
import { User, userModel } from '../models/user.model';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.authToken;

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }

        const decoded = verifyToken(token);

        const user = await userModel.findById(decoded.userId).select('-password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        req.user = user;
        next();

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: 'Token expired'
            });
            return;
        }

        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};