import { BusinessLead, Country, Industry, EmailSource } from '../types';

/**
 * Business Directory Service
 * Integrates with various business directories based on country
 * 
 * Note: For production, some of these would require backend services
 * due to CORS restrictions. This service provides the structure and
 * can work with available APIs or be extended with backend support.
 */

interface DirectoryResult {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  source: string;
}

/**
 * Directory configurations by country
 */
const DIRECTORY_CONFIGS: Record<Country, {
  name: string;
  url: string;
  apiAvailable: boolean;
  requiresBackend: boolean;
}[]> = {
  'United Kingdom': [
    { name: 'Yell.com', url: 'https://www.yell.com', apiAvailable: false, requiresBackend: true },
    { name: 'Thomson Local', url: 'https://www.thomsonlocal.com', apiAvailable: false, requiresBackend: true },
    { name: '192.com', url: 'https://www.192.com', apiAvailable: false, requiresBackend: true },
    { name: 'FreeIndex', url: 'https://www.freeindex.co.uk', apiAvailable: false, requiresBackend: true },
  ],
  'United States': [
    { name: 'Yellow Pages', url: 'https://www.yellowpages.com', apiAvailable: false, requiresBackend: true },
    { name: 'Yelp', url: 'https://www.yelp.com', apiAvailable: true, requiresBackend: false },
    { name: 'Better Business Bureau', url: 'https://www.bbb.org', apiAvailable: false, requiresBackend: true },
    { name: 'Angi (Angie\'s List)', url: 'https://www.angi.com', apiAvailable: false, requiresBackend: true },
  ],
  'Australia': [
    { name: 'Yellow Pages AU', url: 'https://www.yellowpages.com.au', apiAvailable: false, requiresBackend: true },
    { name: 'TrueLocal', url: 'https://www.truelocal.com.au', apiAvailable: false, requiresBackend: true },
    { name: 'Hotfrog', url: 'https://www.hotfrog.com.au', apiAvailable: false, requiresBackend: true },
  ],
  'Ghana': [
    { name: 'BusinessGhana Directory', url: 'https://www.businessghana.com/site/directory', apiAvailable: false, requiresBackend: true },
    { name: 'Yellow Pages Ghana', url: 'https://www.yellowpagesghana.com', apiAvailable: false, requiresBackend: true },
    { name: 'GhanaWeb Business', url: 'https://www.ghanaweb.com', apiAvailable: false, requiresBackend: true },
    { name: 'Jumia Business', url: 'https://www.jumia.com.gh', apiAvailable: false, requiresBackend: true },
    { name: 'Tonaton', url: 'https://www.tonaton.com', apiAvailable: false, requiresBackend: true },
  ],
};

/**
 * Search Yelp API (if API key is available)
 */
async function searchYelp(
  query: string,
  location: string,
  limit: number = 10
): Promise<DirectoryResult[]> {
  const yelpApiKey = import.meta.env.VITE_YELP_API_KEY || process.env.YELP_API_KEY;

  if (!yelpApiKey) {
    return [];
  }

  try {
    // Note: Yelp API requires backend due to CORS
    // This is a placeholder structure
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${yelpApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Yelp API error: ${response.statusText}`);
    }

    const data = await response.json();

    return (data.businesses || []).map((business: any) => ({
      name: business.name,
      phone: business.phone,
      address: business.location?.address1,
      website: business.url,
      rating: business.rating,
      reviewCount: business.review_count,
      source: 'Yelp',
    }));
  } catch (error) {
    console.error('Yelp API error:', error);
    return [];
  }
}

/**
 * Search directories via backend proxy (if available)
 * This allows direct directory scraping without AI
 */
async function searchDirectoriesViaBackend(
  country: Country,
  industry: Industry,
  city: string
): Promise<DirectoryResult[]> {
  // In production (unified deployment), use relative URL
  // In development, use VITE_BACKEND_URL from .env.local
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

  try {
    const response = await fetch(`${backendUrl}/api/directories/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        country,
        industry,
        city,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.results || []).map((result: any) => ({
      name: result.name,
      phone: result.phone,
      email: result.email,
      address: result.address,
      website: result.website,
      rating: result.rating,
      reviewCount: result.reviewCount,
      source: result.source || 'Directory',
    }));
  } catch (error) {
    console.error('Backend directory search error:', error);
    return [];
  }
}

/**
 * Main function to search business directories
 */
export async function searchBusinessDirectories(
  country: Country,
  industry: Industry,
  city: string
): Promise<BusinessLead[]> {
  const results: BusinessLead[] = [];
  const directories = DIRECTORY_CONFIGS[country] || [];

  // Try Yelp API if available (US only for now)
  if (country === 'United States') {
    try {
      const yelpResults = await searchYelp(`${industry} ${city}`, city);

      for (const result of yelpResults) {
        // Only include businesses without websites
        if (!result.website) {
          const lead: BusinessLead = {
            id: Math.random().toString(36).substr(2, 9),
            name: result.name,
            industry,
            country,
            city,
            phone: result.phone || '',
            email: result.email || null,
            emailSource: result.email ? EmailSource.DIRECTORY : EmailSource.NONE,
            hasWebsite: false,
            isActive: (result.reviewCount || 0) > 0,
            mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.name + ' ' + city)}`,
            directorySource: result.source,
            reviewCount: result.reviewCount || 0,
            lastReviewDate: new Date().toISOString(),
            leadScore: calculateLeadScore(result),
            dateAdded: new Date().toISOString(),
            notes: result.address || '',
          };
          results.push(lead);
        }
      }
    } catch (error) {
      console.error('Directory search error:', error);
    }
  }

  // Try other directories via backend proxy (if available)
  // This allows real directory scraping without AI
  try {
    const backendResults = await searchDirectoriesViaBackend(country, industry, city);

    for (const result of backendResults) {
      // Only include businesses without websites
      if (!result.website) {
        const lead: BusinessLead = {
          id: Math.random().toString(36).substr(2, 9),
          name: result.name,
          industry,
          country,
          city,
          phone: result.phone || '',
          email: result.email || null,
          emailSource: result.email ? EmailSource.DIRECTORY : EmailSource.NONE,
          hasWebsite: false,
          isActive: (result.reviewCount || 0) > 0,
          mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.name + ' ' + city)}`,
          directorySource: result.source,
          reviewCount: result.reviewCount || 0,
          lastReviewDate: new Date().toISOString(),
          leadScore: calculateLeadScore(result),
          dateAdded: new Date().toISOString(),
          notes: result.address || '',
        };
        results.push(lead);
      }
    }
  } catch (error) {
    console.error('Directory search error:', error);
  }

  return results;
}

/**
 * Calculate lead score for directory result
 */
function calculateLeadScore(result: DirectoryResult): number {
  let score = 0;
  if (!result.website) score += 3; // No website = high priority
  if (result.phone) score += 1;
  if (result.email) score += 1;
  if (result.reviewCount && result.reviewCount > 0) score += 1;
  if (result.rating && result.rating >= 4) score += 1; // Good rating
  return score;
}

/**
 * Get available directories for a country
 */
export function getAvailableDirectories(country: Country): string[] {
  return DIRECTORY_CONFIGS[country]?.map(d => d.name) || [];
}

/**
 * Check if directory scraping requires backend
 */
export function requiresBackendForDirectory(country: Country): boolean {
  const directories = DIRECTORY_CONFIGS[country] || [];
  return directories.some(d => d.requiresBackend);
}

