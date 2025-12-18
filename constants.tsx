
import { Country, Industry } from './types';

export const COUNTRIES: Country[] = ['Ghana', 'United Kingdom', 'United States', 'Australia'];

export const INDUSTRIES: Industry[] = [
  // General Categories
  'SMEs',
  'Local service businesses',
  'Professional services',
  
  // Food & Hospitality
  'Food & beverage',
  'Restaurants & Pubs',
  'Hotels',
  'Travel & Tours',
  
  // Beauty & Personal Care
  'Beauty & wellness',
  'Beauty & Personal Care',
  'Salons & spas',
  
  // Healthcare
  'Clinics & healthcare services',
  'Health',
  
  // Retail & Fashion
  'Fashion & retail',
  'Clothing, Textiles & Accessories',
  'Shopping Centers',
  
  // Technology & IT
  'IT Companies',
  'Information Services',
  'Telecommunications',
  'Electronics & Electricals',
  
  // Business Services
  'Consultants',
  'Sales and Marketing',
  'Human Resource',
  'Finance Companies',
  'Insurance',
  'Real Estate Companies',
  
  // Manufacturing & Trade
  'Manufacturers',
  'Imports & Exports',
  'Logistics & trade services',
  'Postal, Courier & Delivery Services',
  
  // Education & Training
  'Education',
  
  // Engineering & Construction
  'Engineering',
  'Environmental Services',
  
  // Media & Entertainment
  'Media',
  'Entertainment',
  'Printing & Publishing',
  
  // Automotive
  'Automobiles',
  'Transport',
  
  // Energy & Utilities
  'Energy',
  'Mining',
  
  // Other
  'Agriculture',
  'Security & Safety',
  'NGOs',
  'Associations',
  'Government',
  'Religious Bodies',
  'Sports',
];

export const MOCK_CITIES: Record<Country, string[]> = {
  'Ghana': ['Accra', 'Kumasi', 'Tamale', 'Takoradi'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow'],
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth']
};
