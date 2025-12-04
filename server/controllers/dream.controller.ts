import { Request, Response } from "express";
import { dreamModel } from "../models/dream.model";

export const getAllDreams = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;

        const dreams = await dreamModel.find({ userId }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            dreams,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dreams",
        });
    }
};

export const getDreamById = async (req: Request, res: Response) => {
    try {

        const dreamId = req.params.id;

        const dream = await dreamModel.findOne({
            _id: dreamId,
            userId: req.user!._id
        })

        if (!dream) {
            return res.status(404).json({
                success: false,
                message: "Dream not found",
            });
        }

        return res.status(200).json({
            success: true,
            dream,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dream",
        })
    }
};

export const createDream = async (req: Request, res: Response) => {
    try {

        const { title, content, date, clarity, mood, tags, isFavorite } = req.body;

        if (!title || !content) {
            return res.status(400).json
                ({
                    success: false,
                    message: "Title and content are required",
                });
        }

        const dream = await dreamModel.create({
            userId: req.user!._id,
            title,
            content,
            date,
            clarity,
            mood,
            tags,
            isFavorite
        });

        return res.status(200).json({
            success: true,
            dream,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create dream",
        });
    }
};


export const updateDream = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const dreamId = req.params.id;
        const updates = req.body;

        const updatedDream = await dreamModel.findOneAndUpdate(
            { _id: dreamId, userId },
            updates,
            { new: true }
        );

        if (!updatedDream) {
            return res.status(404).json({
                success: false,
                message: "Dream not found",
            });
        }

        return res.status(200).json({
            success: true,
            dream: updatedDream,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update dream",
        });
    }
};

export const deleteDream = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const dreamId = req.params.id;

        const deleteDream = await dreamModel.findOneAndDelete({
            _id: dreamId,
            userId: userId,
        });

        if (!deleteDream) {
            return res.status(404).json({
                success: false,
                message: "Dream not found"
            });
        }

        return res.status(200).json({
            success: true,
            dream: deleteDream,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete dream",
        });
    }
};

export const toggleFavorite = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const dreamId = req.params.id;

        const dream = await dreamModel.findOne({
            _id: dreamId,
            userId: userId,
        });

        if (!dream) {
            return res.status(404).json({
                success: false,
                message: "Dream not found",
            });
        }

        dream.isFavorite = !dream.isFavorite;
        await dream.save();

        return res.status(200).json({
            success: true,
            dream,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to toggle favorite",
        });
    }
};

export const getFavorites = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;

        const favorites = await dreamModel.find({
            userId,
            isFavorite: true,
        }).sort({ date: -1 })

        
        return res.status(200).json({
            success: true,
            favorites,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch favorite",
        });
    }
};