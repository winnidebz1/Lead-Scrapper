/**
 * Data Validation Service
 * Validates and normalizes lead data for accuracy
 */

import { BusinessLead } from '../types';

export interface ValidationResult {
  isValid: boolean;
  confidence: number; // 0-100
  issues: string[];
  normalized: Partial<BusinessLead>;
}

/**
 * Validate phone number format
 */
export function validatePhone(phone: string, country: string): {
  isValid: boolean;
  normalized: string;
  format: string;
} {
  if (!phone) {
    return { isValid: false, normalized: '', format: 'empty' };
  }

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Country-specific validation
  const countryFormats: Record<string, { min: number; max: number; pattern?: RegExp }> = {
    'United States': { min: 10, max: 11, pattern: /^1?[2-9]\d{2}[2-9]\d{2}\d{4}$/ },
    'United Kingdom': { min: 10, max: 13, pattern: /^(\+44|0)[1-9]\d{8,9}$/ },
    'Australia': { min: 9, max: 10, pattern: /^(\+61|0)[2-9]\d{8}$/ },
    'Ghana': { min: 9, max: 10, pattern: /^(\+233|0)[2-9]\d{8}$/ },
  };

  const format = countryFormats[country] || { min: 7, max: 15 };
  
  const isValid = digits.length >= format.min && digits.length <= format.max;
  const normalized = formatPhoneNumber(phone, country);

  return {
    isValid,
    normalized,
    format: isValid ? 'valid' : 'invalid',
  };
}

/**
 * Normalize phone number to standard format
 */
function formatPhoneNumber(phone: string, country: string): string {
  const digits = phone.replace(/\D/g, '');
  
  // Country-specific formatting
  if (country === 'United States') {
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
  }
  
  if (country === 'United Kingdom') {
    if (digits.startsWith('44')) {
      return `+44 ${digits.slice(2, 5)} ${digits.slice(5)}`;
    }
    if (digits.startsWith('0')) {
      return `+44 ${digits.slice(1, 4)} ${digits.slice(4)}`;
    }
  }
  
  if (country === 'Ghana') {
    if (digits.startsWith('233')) {
      return `+233 ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    if (digits.startsWith('0')) {
      return `+233 ${digits.slice(1, 4)} ${digits.slice(4)}`;
    }
  }
  
  // Default: return with country code if missing
  return phone;
}

/**
 * Validate email format
 */
export function validateEmail(email: string | null): {
  isValid: boolean;
  normalized: string | null;
} {
  if (!email) {
    return { isValid: false, normalized: null };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const normalized = email.toLowerCase().trim();
  const isValid = emailRegex.test(normalized);

  // Check for common fake email patterns
  const fakePatterns = [
    /example\.(com|org|net)/i,
    /test@/i,
    /noreply@/i,
    /no-reply@/i,
    /donotreply@/i,
  ];

  const isFake = fakePatterns.some(pattern => pattern.test(normalized));

  return {
    isValid: isValid && !isFake,
    normalized: isValid ? normalized : null,
  };
}

/**
 * Normalize business name
 */
export function normalizeBusinessName(name: string): string {
  if (!name) return '';

  return name
    .trim()
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/[^\w\s&'-]/g, '') // Remove special chars except &, ', -
    .replace(/^(the|a|an)\s+/i, '') // Remove leading articles
    .trim();
}

/**
 * Calculate similarity between two strings (0-1)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeBusinessName(str1).toLowerCase();
  const s2 = normalizeBusinessName(str2).toLowerCase();

  if (s1 === s2) return 1.0;
  if (s1.length === 0 || s2.length === 0) return 0.0;

  // Simple Levenshtein-like similarity
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  // Check if one contains the other
  if (longer.includes(shorter)) {
    return shorter.length / longer.length;
  }

  // Calculate character overlap
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) {
      matches++;
    }
  }

  return matches / longer.length;
}

/**
 * Validate and score a business lead
 */
export function validateLead(lead: BusinessLead, existingLeads: BusinessLead[] = []): ValidationResult {
  const issues: string[] = [];
  let confidence = 100;

  // Validate phone
  const phoneValidation = validatePhone(lead.phone, lead.country);
  if (!phoneValidation.isValid) {
    issues.push('Invalid phone number format');
    confidence -= 20;
  }

  // Validate email
  const emailValidation = validateEmail(lead.email);
  if (lead.email && !emailValidation.isValid) {
    issues.push('Invalid email format');
    confidence -= 15;
  }

  // Validate business name
  if (!lead.name || lead.name.trim().length < 2) {
    issues.push('Business name too short or missing');
    confidence -= 30;
  }

  // Check for duplicates
  const normalizedName = normalizeBusinessName(lead.name);
  const duplicate = existingLeads.find(existing => {
    const existingNormalized = normalizeBusinessName(existing.name);
    const similarity = calculateSimilarity(normalizedName, existingNormalized);
    const sameCity = existing.city.toLowerCase() === lead.city.toLowerCase();
    return similarity > 0.85 && sameCity;
  });

  if (duplicate) {
    issues.push('Potential duplicate lead');
    confidence -= 25;
  }

  // Validate location
  if (!lead.city || lead.city.trim().length < 2) {
    issues.push('City missing or invalid');
    confidence -= 15;
  }

  // Check data completeness
  if (!lead.phone) {
    issues.push('Phone number missing');
    confidence -= 10;
  }

  if (!lead.email) {
    confidence -= 5; // Email is optional, so less penalty
  }

  // Normalize data
  const normalized: Partial<BusinessLead> = {
    name: normalizeBusinessName(lead.name),
    phone: phoneValidation.normalized || lead.phone,
    email: emailValidation.normalized || lead.email,
  };

  return {
    isValid: confidence >= 50 && issues.length < 3,
    confidence: Math.max(0, Math.min(100, confidence)),
    issues,
    normalized,
  };
}

/**
 * Check if lead is high quality
 */
export function isHighQualityLead(lead: BusinessLead): boolean {
  const validation = validateLead(lead);
  
  return (
    validation.confidence >= 70 &&
    validation.isValid &&
    lead.phone.length > 0 &&
    lead.name.length > 2 &&
    !lead.hasWebsite // Must not have website
  );
}

