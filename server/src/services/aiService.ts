import { env, isDevelopment } from '../config/environment.js';
import { MoodType } from '../models/Dream.js';

export interface DreamAnalysisResult {
  mood: MoodType;
  symbols: string[];
  interpretation: string;
  detectedLanguage: string;
}

const ANALYSIS_PROMPT = `You are an expert dream analyst and psychologist. Analyze the given dream and provide insights.

You MUST respond with valid JSON in this exact format (no markdown, no code blocks, just pure JSON):
{
  "mood": "one of: happy, sad, anxious, peaceful, confused, excited, fearful, neutral",
  "symbols": ["array", "of", "symbolic", "elements"],
  "interpretation": "A thoughtful 2-3 sentence interpretation",
  "detectedLanguage": "the language of the dream text"
}

Guidelines:
- mood: The overall emotional tone (pick the strongest emotion)
- symbols: Key symbolic elements (water, flying, animals, people, places, objects)
- interpretation: Meaningful psychological insight, be specific to THIS dream
- detectedLanguage: The language it was written in

Respond ONLY with the JSON object.`;

const VALID_MOODS: MoodType[] = ['happy', 'sad', 'anxious', 'peaceful', 'confused', 'excited', 'fearful', 'neutral'];

export async function analyzeDream(dreamContent: string): Promise<DreamAnalysisResult> {
  if (!env.aiApiKey) {
    if (isDevelopment) {
      console.log('🤖 AI Service (dev mode): No API key, using mock analysis');
      return getMockAnalysis(dreamContent);
    }
    throw new Error('AI API key is not configured');
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.aiApiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${ANALYSIS_PROMPT}\n\nDream to analyze:\n${dreamContent}` }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
      }),
    });

    if (!response.ok) {
      const errorBody: any = await response.json();
      console.error('Gemini API error:', errorBody);
      throw new Error(errorBody.error?.message || 'Gemini API request failed');
    }

    const data: any = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) throw new Error('No response from Gemini');

    const cleanedContent = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const analysis = JSON.parse(cleanedContent) as DreamAnalysisResult;

    if (!VALID_MOODS.includes(analysis.mood)) analysis.mood = 'neutral';
    if (!Array.isArray(analysis.symbols)) analysis.symbols = [];
    if (!analysis.interpretation) analysis.interpretation = 'Unable to generate interpretation.';
    if (!analysis.detectedLanguage) analysis.detectedLanguage = 'Unknown';

    return analysis;
  } catch (error) {
    console.error('AI analysis failed:', error);
    if (isDevelopment) {
      console.log('🤖 Falling back to mock analysis');
      return getMockAnalysis(dreamContent);
    }
    throw error;
  }
}

function getMockAnalysis(dreamContent: string): DreamAnalysisResult {
  const content = dreamContent.toLowerCase();
  let mood: MoodType = 'neutral';

  if (content.includes('happy') || content.includes('joy') || content.includes('laugh')) mood = 'happy';
  else if (content.includes('scared') || content.includes('fear') || content.includes('monster')) mood = 'fearful';
  else if (content.includes('sad') || content.includes('cry') || content.includes('lost')) mood = 'sad';
  else if (content.includes('anxious') || content.includes('stress') || content.includes('chase')) mood = 'anxious';
  else if (content.includes('peace') || content.includes('calm') || content.includes('serene')) mood = 'peaceful';
  else if (content.includes('fly') || content.includes('adventure') || content.includes('excit')) mood = 'excited';

  const symbolKeywords = ['water', 'fire', 'flying', 'falling', 'running', 'house', 'door', 'car', 'animal', 'dog', 'cat', 'bird', 'snake', 'ocean', 'mountain', 'forest', 'school', 'work', 'family', 'friend', 'stranger', 'baby'];
  const symbols = symbolKeywords.filter(s => content.includes(s));
  if (symbols.length === 0) symbols.push('journey', 'self-discovery');

  return {
    mood,
    symbols: symbols.slice(0, 5),
    interpretation: `[MOCK] This dream contains themes of ${symbols[0]} and reflects a ${mood} emotional state. Your subconscious may be processing recent experiences related to these symbols.`,
    detectedLanguage: 'English',
  };
}
