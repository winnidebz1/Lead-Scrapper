/**
 * Website Validation Service
 * Validates if a business has a professional website
 */

interface ValidationResult {
  hasWebsite: boolean;
  websiteUrl: string | null;
  isProfessional: boolean;
  notes: string;
}

/**
 * Validate if a business has a website by checking Google Places data
 * In a production environment, this would also:
 * - Search Google for business name + location
 * - Check business directories
 * - Verify domain exists and is professional (not just social media)
 */
export async function validateWebsite(
  businessName: string,
  city: string,
  country: string,
  googlePlacesWebsite?: string
): Promise<ValidationResult> {
  // If Google Places already has a website, use it
  if (googlePlacesWebsite) {
    return {
      hasWebsite: true,
      websiteUrl: googlePlacesWebsite,
      isProfessional: isProfessionalWebsite(googlePlacesWebsite),
      notes: 'Found via Google Places',
    };
  }

  // In production, you would:
  // 1. Search Google for "{businessName} {city} {country} website"
  // 2. Parse results and check for actual business websites
  // 3. Filter out social media profiles (Facebook, Instagram, etc.)
  // 4. Verify domain exists and is accessible

  // For now, return no website (which is what we want - businesses without websites)
  return {
    hasWebsite: false,
    websiteUrl: null,
    isProfessional: false,
    notes: 'No website found in Google Places',
  };
}

/**
 * Check if a URL is a professional website (not social media)
 */
function isProfessionalWebsite(url: string): boolean {
  if (!url) return false;

  const socialMediaDomains = [
    'facebook.com',
    'instagram.com',
    'linkedin.com',
    'twitter.com',
    'x.com',
    'youtube.com',
    'tiktok.com',
    'pinterest.com',
  ];

  const lowerUrl = url.toLowerCase();
  return !socialMediaDomains.some(domain => lowerUrl.includes(domain));
}

/**
 * Search for business website using web search
 * Note: This requires a backend service to avoid CORS issues
 */
export async function searchBusinessWebsite(
  businessName: string,
  city: string,
  country: string
): Promise<string | null> {
  // This would typically be done on a backend to avoid CORS
  // For now, return null - indicating no website found
  // In production, implement:
  // 1. Google Custom Search API
  // 2. Or backend scraping service
  // 3. Or use a service like SerpAPI
  
  return null;
}

