/**
 * Lead Verification Service
 * Cross-verifies leads from multiple sources for accuracy
 */

import { BusinessLead } from '../types';
import { calculateSimilarity, normalizeBusinessName } from './dataValidationService';

export interface VerificationResult {
  isVerified: boolean;
  confidence: number; // 0-100
  sources: string[];
  discrepancies: string[];
}

/**
 * Verify a lead by cross-referencing with existing leads
 */
export function verifyLead(
  newLead: BusinessLead,
  existingLeads: BusinessLead[]
): VerificationResult {
  const sources: string[] = [];
  const discrepancies: string[] = [];
  let confidence = 50; // Start with base confidence

  // Find similar leads
  const similarLeads = existingLeads.filter(existing => {
    const nameSimilarity = calculateSimilarity(newLead.name, existing.name);
    const sameCity = existing.city.toLowerCase() === newLead.city.toLowerCase();
    const sameCountry = existing.country === newLead.country;
    
    return nameSimilarity > 0.7 && sameCity && sameCountry;
  });

  if (similarLeads.length > 0) {
    sources.push(`Found ${similarLeads.length} similar lead(s)`);
    confidence += 20;

    // Check for consistency
    similarLeads.forEach(similar => {
      if (similar.phone && newLead.phone && similar.phone !== newLead.phone) {
        discrepancies.push('Phone number mismatch with similar lead');
        confidence -= 10;
      }

      if (similar.email && newLead.email && similar.email !== newLead.email) {
        discrepancies.push('Email mismatch with similar lead');
        confidence -= 5;
      }

      if (similar.hasWebsite !== newLead.hasWebsite) {
        discrepancies.push('Website status mismatch');
        confidence -= 15;
      }
    });
  }

  // Verify source reliability
  const reliableSources = ['Google Places', 'Yelp', 'Yellow Pages'];
  if (reliableSources.includes(newLead.directorySource)) {
    confidence += 15;
    sources.push(`Source: ${newLead.directorySource} (reliable)`);
  } else if (newLead.directorySource.includes('AI')) {
    confidence -= 10;
    sources.push(`Source: ${newLead.directorySource} (synthetic)`);
  }

  // Check data completeness
  if (newLead.phone && newLead.email) {
    confidence += 10;
    sources.push('Complete contact information');
  }

  if (newLead.reviewCount > 0) {
    confidence += 5;
    sources.push('Has reviews (verified business)');
  }

  if (newLead.isActive) {
    confidence += 5;
    sources.push('Marked as active');
  }

  return {
    isVerified: confidence >= 60,
    confidence: Math.max(0, Math.min(100, confidence)),
    sources,
    discrepancies,
  };
}

/**
 * Merge duplicate leads intelligently
 */
export function mergeDuplicateLeads(leads: BusinessLead[]): BusinessLead[] {
  const merged: BusinessLead[] = [];
  const processed = new Set<string>();

  for (const lead of leads) {
    const normalizedName = normalizeBusinessName(lead.name);
    const key = `${normalizedName}-${lead.city.toLowerCase()}`;

    if (processed.has(key)) {
      // Find existing lead to merge with
      const existing = merged.find(m => {
        const mNormalized = normalizeBusinessName(m.name);
        const mKey = `${mNormalized}-${m.city.toLowerCase()}`;
        return mKey === key;
      });

      if (existing) {
        // Merge data - prefer more complete information
        if (!existing.phone && lead.phone) existing.phone = lead.phone;
        if (!existing.email && lead.email) {
          existing.email = lead.email;
          existing.emailSource = lead.emailSource;
        }
        if (lead.reviewCount > existing.reviewCount) {
          existing.reviewCount = lead.reviewCount;
          existing.lastReviewDate = lead.lastReviewDate;
        }
        if (lead.leadScore > existing.leadScore) {
          existing.leadScore = lead.leadScore;
        }
        // Update source to show multiple sources
        if (!existing.directorySource.includes(lead.directorySource)) {
          existing.directorySource += `, ${lead.directorySource}`;
        }
      }
    } else {
      processed.add(key);
      merged.push({ ...lead });
    }
  }

  return merged;
}

/**
 * Calculate overall lead quality score
 */
export function calculateLeadQuality(lead: BusinessLead): {
  score: number; // 0-100
  factors: { factor: string; score: number }[];
} {
  const factors: { factor: string; score: number }[] = [];
  let totalScore = 0;

  // No website (required)
  if (!lead.hasWebsite) {
    factors.push({ factor: 'No Website', score: 30 });
    totalScore += 30;
  } else {
    factors.push({ factor: 'Has Website (not ideal)', score: 0 });
  }

  // Active status
  if (lead.isActive) {
    factors.push({ factor: 'Active Business', score: 20 });
    totalScore += 20;
  }

  // Contact information
  if (lead.phone) {
    factors.push({ factor: 'Has Phone', score: 15 });
    totalScore += 15;
  }

  if (lead.email) {
    factors.push({ factor: 'Has Email', score: 15 });
    totalScore += 15;
  }

  // Reviews (indicates real business)
  if (lead.reviewCount > 0) {
    const reviewScore = Math.min(10, lead.reviewCount * 2);
    factors.push({ factor: `Has Reviews (${lead.reviewCount})`, score: reviewScore });
    totalScore += reviewScore;
  }

  // Source reliability
  const reliableSources = ['Google Places', 'Yelp'];
  if (reliableSources.some(s => lead.directorySource.includes(s))) {
    factors.push({ factor: 'Reliable Source', score: 10 });
    totalScore += 10;
  }

  return {
    score: Math.min(100, totalScore),
    factors,
  };
}

