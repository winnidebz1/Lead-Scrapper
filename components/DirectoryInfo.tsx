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
      <p className="text-xs text-slate-500 mt-2">
        Note: Directory scraping requires backend services. Yelp API is available for US searches.
      </p>
    </div>
  );
};

export default DirectoryInfo;

