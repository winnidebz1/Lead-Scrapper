/**
 * Environment variable validation
 * Checks for required API keys and provides helpful error messages
 */

export interface EnvStatus {
  geminiApiKey: boolean;
  googlePlacesApiKey: boolean;
  backendUrl: boolean;
  isValid: boolean;
  warnings: string[];
}

export function validateEnvironment(): EnvStatus {
  const geminiApiKey = !!(import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY);
  const googlePlacesApiKey = !!(import.meta.env.VITE_GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY);
  const backendUrl = !!(import.meta.env.VITE_BACKEND_URL || process.env.BACKEND_URL);

  const warnings: string[] = [];

  if (!geminiApiKey) {
    warnings.push('GEMINI_API_KEY is not set. AI-powered discovery will not work.');
  }

  if (!googlePlacesApiKey) {
    warnings.push('GOOGLE_PLACES_API_KEY is not set. Real business data discovery will fall back to AI generation.');
  }

  if (!backendUrl) {
    warnings.push('BACKEND_URL is not set. Directory scraping will not work.');
  }

  return {
    geminiApiKey,
    googlePlacesApiKey,
    backendUrl,
    // Valid if we have at least backend URL OR one of the API keys
    isValid: backendUrl || geminiApiKey || googlePlacesApiKey,
    warnings,
  };
}

export function logEnvironmentStatus() {
  const status = validateEnvironment();

  if (!status.isValid) {
    console.error('❌ Environment Configuration Error:');
    console.error('At least one of the following must be configured:');
    console.error('  - BACKEND_URL (for directory scraping)');
    console.error('  - GEMINI_API_KEY (for AI discovery)');
    console.error('  - GOOGLE_PLACES_API_KEY (for Google Places discovery)');
    console.error('Please check your .env.local file.');
    return false;
  }

  if (status.warnings.length > 0) {
    console.warn('⚠️  Environment Warnings:');
    status.warnings.forEach(warning => console.warn(`  - ${warning}`));
  } else {
    console.log('✅ All environment variables are configured correctly.');
  }

  return true;
}

