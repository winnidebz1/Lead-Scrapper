
import { Country, Industry } from './types';

export const COUNTRIES: Country[] = ['Ghana', 'United Kingdom', 'United States', 'Australia'];

export const INDUSTRIES: Industry[] = [
  'SMEs',
  'Local service businesses',
  'Food & beverage',
  'Beauty & wellness',
  'Salons & spas',
  'Clinics & healthcare services',
  'Fashion & retail',
  'Logistics & trade services',
  'Professional services'
];

export const MOCK_CITIES: Record<Country, string[]> = {
  'Ghana': ['Accra', 'Kumasi', 'Tamale', 'Takoradi'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow'],
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth']
};
