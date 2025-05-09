import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
export const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-placeholder-key" 
});

export interface SentimentAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
}

export async function analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a sentiment analysis expert. Analyze the sentiment of the app review and provide a sentiment classification (positive, negative, or neutral), a sentiment score from 0 to 100 (where 0 is completely negative and 100 is completely positive), and a confidence score between 0 and 1. Respond with JSON in this format: { 'sentiment': string, 'score': number, 'confidence': number }",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      sentiment: result.sentiment as 'positive' | 'negative' | 'neutral',
      score: Math.max(0, Math.min(100, Math.round(result.score))),
      confidence: Math.max(0, Math.min(1, result.confidence)),
    };
  } catch (error) {
    console.error("Failed to analyze sentiment:", error);
    throw new Error("Failed to analyze sentiment: " + (error as Error).message);
  }
}
