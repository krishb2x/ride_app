import { GoogleGenAI } from "@google/genai";
import { FeedEventType } from "../types";

export class MotoOrbitAI {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateFeedMessage(type: FeedEventType, context: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a short, exciting one-line notification for a high-tech rider community feed called MotoOrbit. 
        Event Type: ${type}
        Context: ${context}
        Keywords: Connectivity, Orbit, Precision.
        Keep it under 10 words.`,
      });
      return response.text || "New activity in MotoOrbit!";
    } catch (err) {
      return "Something big just happened in your Orbit!";
    }
  }

  async analyzeStats(distance: number, avgSpeed: number): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Comment on these MotoOrbit ride stats: ${distance}km at ${avgSpeed}km/h. 
        Give a cool, precise, and tech-focused one-liner.`,
      });
      return response.text || "Orbit established. Solid data!";
    } catch (err) {
      return "Mission successful. Velocity archived!";
    }
  }
}

export const aiService = new MotoOrbitAI();