
import { GoogleGenAI } from "@google/genai";
import { Post, Category } from "../types";

// The API Key is handled securely via process.env.API_KEY
// No manual configuration is needed in the code.
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMarketInsights = async (posts: Post[]) => {
  if (posts.length === 0) return "The neighborhood is quiet. Be the first to plug something!";

  const postSummary = posts.map(p => 
    `Type: ${p.type}, Category: ${p.category}, Item: ${p.title}, Location: ${p.location}`
  ).join('\n');

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze this community marketplace activity. 
        Provide a 2-sentence summary of the "Demand Intelligence". 
        Identify what's trending and what's missing. 
        Tone: Street-smart, helpful, neighborly.

        Activity:
        ${postSummary}
      `,
    });
    return response.text?.trim() || "The market is finding its rhythm.";
  } catch (error) {
    console.error("Gemini Intel Error:", error);
    return "Intelligence is currently offline. Trust your gut!";
  }
};

export const suggestCategory = async (title: string, description: string): Promise<Category> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize this for a local neighborhood app: "${title} - ${description}". 
      Options: ${Object.values(Category).join(', ')}. 
      Return ONLY the category name.`,
    });
    const result = response.text?.trim() as Category;
    return Object.values(Category).includes(result) ? result : Category.OTHER;
  } catch (error) {
    return Category.OTHER;
  }
};

export const refinePostDescription = async (draft: string): Promise<string> => {
  if (!draft || draft.length < 5) return draft;
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Rewrite this community request to be clearer and more likely to get a helpful response. 
      Keep it short, friendly, and informal. Do not add fake information.
      
      Draft: "${draft}"
      
      Return ONLY the improved description.`,
    });
    return response.text?.trim() || draft;
  } catch (error) {
    return draft;
  }
};
