
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessLead, Country, Industry, EmailSource } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function discoverBusinesses(country: Country, industry: Industry, city: string): Promise<BusinessLead[]> {
  const prompt = `
    Act as an automated web scraper and business directory researcher. 
    Find 5-8 REALISTIC but synthesized active businesses in ${city}, ${country} in the ${industry} sector that LACK a professional website.
    
    For each business, provide:
    1. Business Name
    2. Industry (${industry})
    3. Country (${country})
    4. City (${city})
    5. A realistic local phone number
    6. A public business email (if likely found on social media/directories) or null
    7. Email source if found (Directory, Facebook, Instagram, LinkedIn, Search)
    8. Confirmation of NO professional website
    9. Active status validation (recent reviews, opening hours)
    10. Review count and a realistic last review date within the last 12 months
    
    Calculate a lead score:
    +3 if No Website confirmed
    +2 if Active verified
    +1 if Email found
    +1 if Phone present
    +1 if >0 Reviews
  `;

  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env.local file.');
  }

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
              name: { type: Type.STRING },
              industry: { type: Type.STRING },
              country: { type: Type.STRING },
              city: { type: Type.STRING },
              phone: { type: Type.STRING },
              email: { type: Type.STRING },
              emailSource: { type: Type.STRING },
              hasWebsite: { type: Type.BOOLEAN },
              isActive: { type: Type.BOOLEAN },
              mapsUrl: { type: Type.STRING },
              directorySource: { type: Type.STRING },
              reviewCount: { type: Type.NUMBER },
              lastReviewDate: { type: Type.STRING },
              leadScore: { type: Type.NUMBER },
              notes: { type: Type.STRING }
            },
            required: ["name", "industry", "country", "city", "phone", "hasWebsite", "isActive", "leadScore"]
          }
        }
      }
    });

    const data = JSON.parse(response.text);
    return data.map((item: any) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString(),
      emailSource: item.email ? (item.emailSource || EmailSource.SEARCH) : EmailSource.NONE
    }));
  } catch (error) {
    console.error("Discovery error:", error);
    return [];
  }
}
