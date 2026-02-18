import { GoogleGenAI } from "@google/genai";
import { FeedEventType } from "../types";

export class RideAddaAI {
  private ai: GoogleGenAI;

  constructor() {
    // Initializing with process.env.API_KEY as a direct named parameter per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateFeedMessage(type: FeedEventType, context: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a short, exciting one-line notification (Indian English slang like 'Ride on!', 'Bawal scene!', 'Chalo chalo!') for a rider community feed. 
        Event Type: ${type}
        Context: ${context}
        Keep it under 10 words.`,
      });
      // Accessing text property directly (not as a method)
      return response.text || "New activity in RideAdda!";
    } catch (err) {
      return "Something big just happened nearby!";
    }
  }

  async analyzeStats(distance: number, avgSpeed: number): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Comment on these ride stats for a biker: ${distance}km at ${avgSpeed}km/h. 
        Give a cool, encouraging one-liner in Indian context.`,
      });
      // Accessing text property directly (not as a method)
      return response.text || "Solid ride, brother!";
    } catch (err) {
      return "Legendary effort today!";
    }
  }
}

export const aiService = new RideAddaAI();