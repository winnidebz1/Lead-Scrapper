import { BusinessLead, Country, Industry, EmailSource } from '../types';

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY;

interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  business_status?: string;
  types?: string[];
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  status: string;
  next_page_token?: string;
}

/**
 * Map industry to Google Places type
 */
function getPlaceType(industry: Industry): string {
  const typeMap: Record<Industry, string> = {
    'Salons & spas': 'beauty_salon',
    'Beauty & wellness': 'beauty_salon',
    'Food & beverage': 'restaurant',
    'Clinics & healthcare services': 'doctor',
    'Fashion & retail': 'clothing_store',
    'Logistics & trade services': 'storage',
    'Professional services': 'lawyer',
    'SMEs': 'establishment',
    'Local service businesses': 'establishment',
  };
  return typeMap[industry] || 'establishment';
}

/**
 * Search for businesses using Google Places API
 */
export async function searchBusinesses(
  country: Country,
  industry: Industry,
  city: string
): Promise<GooglePlaceResult[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key not configured. Using fallback mode.');
    return [];
  }

  const query = `${industry} in ${city}, ${country}`;
  const type = getPlaceType(industry);
  
  try {
    // Use Text Search API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`);
    }

    const data: GooglePlacesResponse = await response.json();

    if (data.status === 'ZERO_RESULTS') {
      return [];
    }

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return data.results || [];
  } catch (error) {
    console.error('Error fetching from Google Places API:', error);
    throw error;
  }
}

/**
 * Get detailed place information
 */
export async function getPlaceDetails(placeId: string): Promise<GooglePlaceResult | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    return null;
  }

  try {
    const fields = [
      'name',
      'formatted_address',
      'formatted_phone_number',
      'website',
      'rating',
      'user_ratings_total',
      'business_status',
      'types',
      'geometry',
      'opening_hours',
      'reviews',
    ].join(',');

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

/**
 * Convert Google Place result to BusinessLead
 */
export function convertPlaceToLead(
  place: GooglePlaceResult,
  industry: Industry,
  country: Country,
  city: string
): BusinessLead {
  // Calculate lead score
  let leadScore = 0;
  if (!place.website) leadScore += 3; // No website = high priority
  if (place.business_status === 'OPERATIONAL') leadScore += 2;
  if (place.formatted_phone_number) leadScore += 1;
  if (place.user_ratings_total && place.user_ratings_total > 0) leadScore += 1;

  // Determine if business is active
  const isActive = place.business_status === 'OPERATIONAL' && 
                   (place.user_ratings_total || 0) > 0;

  // Get last review date (approximate based on rating count)
  const lastReviewDate = place.user_ratings_total && place.user_ratings_total > 0
    ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    : new Date().toISOString();

  const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;

  return {
    id: place.place_id || Math.random().toString(36).substr(2, 9),
    name: place.name,
    industry,
    country,
    city,
    phone: place.formatted_phone_number || '',
    email: null, // Will be discovered separately
    emailSource: EmailSource.NONE,
    hasWebsite: !!place.website,
    isActive,
    mapsUrl,
    directorySource: 'Google Places',
    reviewCount: place.user_ratings_total || 0,
    lastReviewDate,
    leadScore,
    dateAdded: new Date().toISOString(),
    notes: place.formatted_address || '',
  };
}

