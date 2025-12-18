/**
 * Environment variable validation
 * Checks for required API keys and provides helpful error messages
 */

export interface EnvStatus {
  geminiApiKey: boolean;
  googlePlacesApiKey: boolean;
  isValid: boolean;
  warnings: string[];
}

export function validateEnvironment(): EnvStatus {
  const geminiApiKey = !!(import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY);
  const googlePlacesApiKey = !!(import.meta.env.VITE_GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY);

  const warnings: string[] = [];

  if (!geminiApiKey) {
    warnings.push('GEMINI_API_KEY is not set. AI-powered discovery will not work.');
  }

  if (!googlePlacesApiKey) {
    warnings.push('GOOGLE_PLACES_API_KEY is not set. Real business data discovery will fall back to AI generation.');
  }

  return {
    geminiApiKey,
    googlePlacesApiKey,
    isValid: geminiApiKey || googlePlacesApiKey, // At least one API key is required
    warnings,
  };
}

export function logEnvironmentStatus() {
  const status = validateEnvironment();
  
  if (!status.isValid) {
    console.error('❌ Environment Configuration Error:');
    console.error('At least one API key (GEMINI_API_KEY or GOOGLE_PLACES_API_KEY) must be configured.');
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

