
export type Country = 'Ghana' | 'United Kingdom' | 'United States' | 'Australia';

export type Industry = 
  | 'SMEs'
  | 'Local service businesses'
  | 'Food & beverage'
  | 'Beauty & wellness'
  | 'Salons & spas'
  | 'Clinics & healthcare services'
  | 'Fashion & retail'
  | 'Logistics & trade services'
  | 'Professional services';

export enum EmailSource {
  DIRECTORY = 'Directory',
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  LINKEDIN = 'LinkedIn',
  SEARCH = 'Search',
  NONE = 'None'
}

export interface BusinessLead {
  id: string;
  name: string;
  industry: Industry;
  country: Country;
  city: string;
  phone: string;
  email: string | null;
  emailSource: EmailSource;
  hasWebsite: boolean;
  isActive: boolean;
  mapsUrl: string;
  directorySource: string;
  reviewCount: number;
  lastReviewDate: string;
  leadScore: number;
  dateAdded: string;
  notes: string;
}

export interface DiscoveryStats {
  totalFound: number;
  noWebsiteCount: number;
  withEmailCount: number;
  activeCount: number;
}
