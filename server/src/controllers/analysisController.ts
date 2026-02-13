import { Request, Response, NextFunction } from 'express';
import { Dream } from '../models/Dream.js';
import { analyzeDream } from '../services/aiService.js';
import { analyzeDreamByIdSchema, analyzeTextSchema } from '../validation/analysisValidation.js';
import { NotFoundError, ForbiddenError, UnauthorizedError } from '../middlewares/errorHandler.js';

export async function analyzeDreamById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) throw new UnauthorizedError('Not authenticated');

    const { id } = analyzeDreamByIdSchema.parse(req.params);
    const dream = await Dream.findById(id);
    if (!dream) throw new NotFoundError('Dream not found');
    if (dream.user.toString() !== userId) throw new ForbiddenError('You do not have permission to analyze this dream');

    const analysisResult = await analyzeDream(dream.content);

    dream.analysis = {
      mood: analysisResult.mood,
      symbols: analysisResult.symbols,
      interpretation: analysisResult.interpretation,
      detectedLanguage: analysisResult.detectedLanguage,
      analyzedAt: new Date(),
    };
    dream.mood = analysisResult.mood;
    await dream.save();

    res.status(200).json({ success: true, message: 'Dream analyzed successfully', data: { dream, analysis: analysisResult } });
  } catch (error) {
    next(error);
  }
}

export async function analyzeText(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) throw new UnauthorizedError('Not authenticated');

    const { content } = analyzeTextSchema.parse(req.body);
    const analysisResult = await analyzeDream(content);

    res.status(200).json({ success: true, message: 'Text analyzed successfully', data: { analysis: analysisResult } });
  } catch (error) {
    next(error);
  }
}

export async function reanalyzeDream(req: Request, res: Response, next: NextFunction): Promise<void> {
  return analyzeDreamById(req, res, next);
}
