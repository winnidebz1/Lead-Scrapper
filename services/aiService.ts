/**
 * Unified AI Service
 * Supports multiple AI providers: OpenAI, Anthropic Claude, Cohere, etc.
 * Automatically selects available provider based on configured API keys
 */

import { BusinessLead, Country, Industry, EmailSource } from '../types';

export type AIProvider = 'gemini' | 'openai' | 'claude' | 'cohere';

interface AIProviderConfig {
  name: string;
  available: boolean;
  apiKey?: string;
}

/**
 * Check which AI providers are available
 */
export function getAvailableProviders(): AIProviderConfig[] {
  const providers: AIProviderConfig[] = [
    {
      name: 'Google Gemini',
      available: !!(import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY),
      apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY,
    },
    {
      name: 'OpenAI GPT',
      available: !!(import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY),
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
    },
    {
      name: 'Anthropic Claude',
      available: !!(import.meta.env.VITE_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY),
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY,
    },
    {
      name: 'Cohere',
      available: !!(import.meta.env.VITE_COHERE_API_KEY || process.env.COHERE_API_KEY),
      apiKey: import.meta.env.VITE_COHERE_API_KEY || process.env.COHERE_API_KEY,
    },
  ];

  return providers;
}

/**
 * Get the best available AI provider
 */
export function getBestProvider(): AIProvider | null {
  const providers = getAvailableProviders();
  
  // Priority order: Gemini > OpenAI > Claude > Cohere
  if (providers[0].available) return 'gemini';
  if (providers[1].available) return 'openai';
  if (providers[2].available) return 'claude';
  if (providers[3].available) return 'cohere';
  
  return null;
}

/**
 * Main discovery function - uses best available provider
 */
export async function discoverBusinesses(
  country: Country,
  industry: Industry,
  city: string,
  preferredProvider?: AIProvider
): Promise<BusinessLead[]> {
  const provider = preferredProvider || getBestProvider();

  if (!provider) {
    throw new Error(
      'No AI provider configured. Please set at least one API key:\n' +
      '- GEMINI_API_KEY (Google Gemini)\n' +
      '- OPENAI_API_KEY (OpenAI GPT)\n' +
      '- ANTHROPIC_API_KEY (Anthropic Claude)\n' +
      '- COHERE_API_KEY (Cohere)'
    );
  }

  switch (provider) {
    case 'gemini':
      const { discoverBusinesses: geminiDiscover } = await import('./geminiService');
      return geminiDiscover(country, industry, city);
    
    case 'openai':
      const { discoverBusinesses: openaiDiscover } = await import('./openaiService');
      return openaiDiscover(country, industry, city);
    
    case 'claude':
      const { discoverBusinesses: claudeDiscover } = await import('./claudeService');
      return claudeDiscover(country, industry, city);
    
    case 'cohere':
      const { discoverBusinesses: cohereDiscover } = await import('./cohereService');
      return cohereDiscover(country, industry, city);
    
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

