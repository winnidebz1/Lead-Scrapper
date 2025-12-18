/**
 * Cohere Service
 * Uses Cohere API for business discovery
 */

import { BusinessLead, Country, Industry, EmailSource } from '../types';

const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY || process.env.COHERE_API_KEY;
const COHERE_MODEL = import.meta.env.VITE_COHERE_MODEL || process.env.COHERE_MODEL || 'command';

export async function discoverBusinesses(
  country: Country,
  industry: Industry,
  city: string
): Promise<BusinessLead[]> {
  if (!COHERE_API_KEY) {
    throw new Error('COHERE_API_KEY is not configured. Please set it in your .env.local file.');
  }

  const prompt = `Act as an automated web scraper and business directory researcher. 
Find 5-8 REALISTIC but synthesized active businesses in ${city}, ${country} in the ${industry} sector that LACK a professional website.

For each business, provide a JSON object with:
- name: Business Name
- industry: "${industry}"
- country: "${country}"
- city: "${city}"
- phone: A realistic local phone number
- email: A public business email (if likely found on social media/directories) or null
- emailSource: Email source if found (Directory, Facebook, Instagram, LinkedIn, Search) or "None"
- hasWebsite: false (must be false - we only want businesses without websites)
- isActive: true (if business is likely active)
- mapsUrl: A Google Maps URL for the business
- directorySource: "AI Discovery (Cohere)"
- reviewCount: Number of reviews (0-50)
- lastReviewDate: A date within the last 12 months (ISO format)
- leadScore: Calculate score: +3 if no website, +2 if active, +1 if email found, +1 if phone present, +1 if reviews > 0
- notes: Brief description or address

Return ONLY a valid JSON array of business objects. No markdown, no code blocks, just pure JSON.`;

  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COHERE_API_KEY}`,
      },
      body: JSON.stringify({
        model: COHERE_MODEL,
        prompt: prompt,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Cohere API error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.generations?.[0]?.text;

    if (!content) {
      throw new Error('No response from Cohere API');
    }

    // Parse JSON response
    let businesses: any[];
    try {
      const parsed = JSON.parse(content);
      businesses = Array.isArray(parsed) ? parsed : parsed.businesses || parsed.results || [];
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\[[\s\S]*\])/);
      if (jsonMatch) {
        businesses = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse Cohere response as JSON');
      }
    }

    return businesses.map((item: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: item.name || 'Unknown Business',
      industry: item.industry || industry,
      country: item.country || country,
      city: item.city || city,
      phone: item.phone || '',
      email: item.email || null,
      emailSource: item.email
        ? (item.emailSource === 'None' ? EmailSource.NONE : (item.emailSource as EmailSource) || EmailSource.SEARCH)
        : EmailSource.NONE,
      hasWebsite: false,
      isActive: item.isActive !== false,
      mapsUrl: item.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.name || '') + ' ' + city)}`,
      directorySource: item.directorySource || 'AI Discovery (Cohere)',
      reviewCount: item.reviewCount || 0,
      lastReviewDate: item.lastReviewDate || new Date().toISOString(),
      leadScore: item.leadScore || calculateLeadScore(item),
      dateAdded: new Date().toISOString(),
      notes: item.notes || '',
    }));
  } catch (error) {
    console.error('Cohere discovery error:', error);
    throw error;
  }
}

function calculateLeadScore(item: any): number {
  let score = 0;
  if (!item.hasWebsite) score += 3;
  if (item.isActive) score += 2;
  if (item.email) score += 1;
  if (item.phone) score += 1;
  if (item.reviewCount > 0) score += 1;
  return score;
}

