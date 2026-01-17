
import { GoogleGenAI } from "@google/genai";
import { Post, Category } from "../types";

// The API Key is handled securely via process.env.API_KEY
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
        Tone: Street-smart, helpful, neighborly, and calm.

        Activity:
        ${postSummary}
      `,
    });
    return response.text?.trim() || "The market is finding its rhythm.";
  } catch (error) {
    console.error("Gemini Intel Error:", error);
    return "Intelligence is currently offline. Trust your neighbors!";
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

/**
 * Generates an image representing the post content to help the community visualize it.
 * Uses gemini-2.5-flash-image as per guidelines.
 */
export const generatePostImage = async (title: string, description: string): Promise<string | null> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A clear, high-quality photograph of ${title}. ${description}. 
            Style: Clean product photography on a neutral community-app background. 
            No text in the image. High visibility.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
