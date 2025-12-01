import { Request, Response } from "express";
import { userModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken, sendTokenCookie, clearAuthCookie } from "../utils/jwt";
import { clear } from "console";


export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existing = await userModel.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = generateToken(user);
        sendTokenCookie(res, token);

        return res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Register error: ${error.message}`
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = generateToken(user);
        sendTokenCookie(res, token);

        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Login error: ${error.message}`
        });
    }
};

export const logOut = async (req: Request, res: Response) => {
    try {
        clearAuthCookie(res);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Logout failed: ${error.message}`
        });
    }
}

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
            }
        });

    } catch (error: any) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user information'
        });
    }
};
