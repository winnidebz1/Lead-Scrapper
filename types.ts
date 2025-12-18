
export type Country = 'Ghana' | 'United Kingdom' | 'United States' | 'Australia';

export type Industry = 
  // General Categories
  | 'SMEs'
  | 'Local service businesses'
  | 'Professional services'
  
  // Food & Hospitality
  | 'Food & beverage'
  | 'Restaurants & Pubs'
  | 'Hotels'
  | 'Travel & Tours'
  
  // Beauty & Personal Care
  | 'Beauty & wellness'
  | 'Beauty & Personal Care'
  | 'Salons & spas'
  
  // Healthcare
  | 'Clinics & healthcare services'
  | 'Health'
  
  // Retail & Fashion
  | 'Fashion & retail'
  | 'Clothing, Textiles & Accessories'
  | 'Shopping Centers'
  
  // Technology & IT
  | 'IT Companies'
  | 'Information Services'
  | 'Telecommunications'
  | 'Electronics & Electricals'
  
  // Business Services
  | 'Consultants'
  | 'Sales and Marketing'
  | 'Human Resource'
  | 'Finance Companies'
  | 'Insurance'
  | 'Real Estate Companies'
  
  // Manufacturing & Trade
  | 'Manufacturers'
  | 'Imports & Exports'
  | 'Logistics & trade services'
  | 'Postal, Courier & Delivery Services'
  
  // Education & Training
  | 'Education'
  
  // Engineering & Construction
  | 'Engineering'
  | 'Environmental Services'
  
  // Media & Entertainment
  | 'Media'
  | 'Entertainment'
  | 'Printing & Publishing'
  
  // Automotive
  | 'Automobiles'
  | 'Transport'
  
  // Energy & Utilities
  | 'Energy'
  | 'Mining'
  
  // Other
  | 'Agriculture'
  | 'Security & Safety'
  | 'NGOs'
  | 'Associations'
  | 'Government'
  | 'Religious Bodies'
  | 'Sports';

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
  // Accuracy metrics (optional, added by validation)
  confidence?: number;
  verified?: boolean;
}

export interface DiscoveryStats {
  totalFound: number;
  noWebsiteCount: number;
  withEmailCount: number;
  activeCount: number;
}
