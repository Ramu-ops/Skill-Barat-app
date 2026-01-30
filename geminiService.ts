
import { GoogleGenAI, Type } from "@google/genai";
import { Gig, Skill } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getSkillMatchScores(userSkills: Skill[], gigs: Gig[]): Promise<Gig[]> {
  if (!process.env.API_KEY) return gigs.map(g => ({ ...g, matchScore: 75 }));

  const skillsList = userSkills.map(s => s.title).join(", ");
  const gigsText = gigs.map(g => `ID: ${g.id}, Title: ${g.title}, Req: ${g.requiredSkills.join(", ")}`).join("\n");

  const prompt = `
    User Skills: ${skillsList}
    Gigs: 
    ${gigsText}
    
    Assign a match score (0-100) for each gig based on how well the user's skills align with required skills.
    Return JSON format: [{ "id": "gig_id", "score": number }]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              score: { type: Type.NUMBER }
            },
            required: ["id", "score"]
          }
        }
      }
    });

    const scores = JSON.parse(response.text || "[]");
    return gigs.map(gig => {
      const match = scores.find((s: any) => s.id === gig.id);
      return { ...gig, matchScore: match ? match.score : 50 };
    });
  } catch (error) {
    console.error("AI Matching failed:", error);
    return gigs.map(g => ({ ...g, matchScore: 60 }));
  }
}

export async function translateContent(text: string, targetLanguage: string): Promise<string> {
  if (targetLanguage === 'English' || !process.env.API_KEY) return text;

  const prompt = `Translate the following text to ${targetLanguage}. Return ONLY the translated string, no extra talk: "${text}"`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text.trim();
  } catch (error) {
    return text;
  }
}
