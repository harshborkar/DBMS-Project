import { GoogleGenAI, Type } from "@google/genai";
import { PlantCareSuggestion } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be simulated.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getPlantCareAdvice = async (species: string): Promise<PlantCareSuggestion | null> => {
  const ai = getAiClient();
  if (!ai) {
    // Fallback simulation if no API key
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          wateringFrequencyDays: 7,
          lightNeeds: "Bright indirect light",
          careTip: "This is a simulated tip because the API key is missing. Ensure soil is dry between waterings.",
          scientificName: "Simulatis Plantus"
        });
      }, 1000);
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide care instructions for a houseplant named "${species}". Return a JSON object with recommended watering frequency in days (number), light needs (short string), a short care tip (string), and scientific name if known.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wateringFrequencyDays: { type: Type.NUMBER, description: "Days between watering" },
            lightNeeds: { type: Type.STRING, description: "Light requirements e.g., 'Low light', 'Direct sun'" },
            careTip: { type: Type.STRING, description: "A helpful one-sentence tip" },
            scientificName: { type: Type.STRING, description: "Scientific Latin name" }
          },
          required: ["wateringFrequencyDays", "lightNeeds", "careTip"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as PlantCareSuggestion;
    }
    return null;
  } catch (error) {
    console.error("Error fetching plant advice:", error);
    return null;
  }
};
