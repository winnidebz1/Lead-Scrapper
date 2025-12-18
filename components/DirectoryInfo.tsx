import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';
import { Country } from '../types';
import { getAvailableDirectories } from '../services/businessDirectoryService';

interface DirectoryInfoProps {
  country: Country;
}

const DirectoryInfo: React.FC<DirectoryInfoProps> = ({ country }) => {
  const directories = getAvailableDirectories(country);

  if (directories.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Globe className="w-4 h-4 text-slate-600" />
        <span className="text-sm font-semibold text-slate-700">Available Directories for {country}:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {directories.map((dir, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600"
          >
            {dir}
          </span>
        ))}
      </div>
      <div className="mt-2 space-y-1">
        <p className="text-xs text-slate-500">
          <strong>Note:</strong> Most directories require a backend service for scraping. 
        </p>
        <div className="text-xs text-slate-600 space-y-1">
          <p>✅ <strong>Works Now:</strong> Yelp API (US only) - Add YELP_API_KEY to .env.local</p>
          <p>⚠️ <strong>Needs Backend:</strong> Other directories - See BACKEND_SETUP.md for quick setup</p>
          <p>💡 <strong>Alternative:</strong> Use AI discovery (GEMINI_API_KEY) - works immediately without backend</p>
        </div>
      </div>
    </div>
  );
};

export default DirectoryInfo;

