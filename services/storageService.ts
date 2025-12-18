import { BusinessLead } from '../types';

const STORAGE_KEY = 'bizdiscover_leads';
const STORAGE_VERSION = '1.0.0';

interface StoredData {
  version: string;
  leads: BusinessLead[];
  lastUpdated: string;
}

export const storageService = {
  /**
   * Save leads to localStorage
   */
  saveLeads: (leads: BusinessLead[]): void => {
    try {
      const data: StoredData = {
        version: STORAGE_VERSION,
        leads,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save leads to localStorage:', error);
      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please export and clear some leads.');
      }
    }
  },

  /**
   * Load leads from localStorage
   */
  loadLeads: (): BusinessLead[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const data: StoredData = JSON.parse(stored);
      
      // Handle version migration if needed
      if (data.version !== STORAGE_VERSION) {
        console.warn('Storage version mismatch. Migrating data...');
        // Future: Add migration logic here if schema changes
      }

      return data.leads || [];
    } catch (error) {
      console.error('Failed to load leads from localStorage:', error);
      return [];
    }
  },

  /**
   * Clear all leads from localStorage
   */
  clearLeads: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear leads from localStorage:', error);
    }
  },

  /**
   * Get storage usage info
   */
  getStorageInfo: (): { used: number; available: number; percentage: number } => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const used = stored ? new Blob([stored]).size : 0;
      // Approximate 5MB limit for localStorage
      const available = 5 * 1024 * 1024;
      const percentage = (used / available) * 100;
      
      return { used, available, percentage };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  },
};

