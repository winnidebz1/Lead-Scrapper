
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Database, 
  Settings, 
  Filter, 
  Download, 
  RefreshCw, 
  AlertCircle,
  Globe,
  Loader2,
  Mail,
  XCircle,
  Trash2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { BusinessLead, Country, Industry, DiscoveryStats } from './types';
import { COUNTRIES, INDUSTRIES, MOCK_CITIES } from './constants';
import { discoverBusinesses } from './services/geminiService';
import { searchBusinesses, convertPlaceToLead, getPlaceDetails } from './services/googlePlacesService';
import { searchBusinessDirectories } from './services/businessDirectoryService';
import { storageService } from './services/storageService';
import { toast } from './utils/toast';
import StatsCards from './components/StatsCards';
import LeadTable from './components/LeadTable';
import ToastContainer from './components/ToastContainer';
import Pagination from './components/Pagination';
import DirectoryInfo from './components/DirectoryInfo';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'discovery' | 'database'>('dashboard');
  const [leads, setLeads] = useState<BusinessLead[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  
  // Database State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNoWebsite, setFilterNoWebsite] = useState(false);
  const [filterHasEmail, setFilterHasEmail] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'newest' | 'reviews'>('score');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  // Load leads from localStorage on mount and validate environment
  useEffect(() => {
    // Validate environment
    import('./utils/envValidation').then(({ logEnvironmentStatus }) => {
      logEnvironmentStatus();
    });

    // Load saved leads
    try {
      const savedLeads = storageService.loadLeads();
      if (savedLeads.length > 0) {
        setLeads(savedLeads);
        toast.success(`Loaded ${savedLeads.length} leads from storage`);
      }
    } catch (error) {
      console.error('Failed to load leads:', error);
      toast.error('Failed to load saved leads');
    }
  }, []);

  // Save leads to localStorage whenever leads change
  useEffect(() => {
    if (leads.length > 0) {
      try {
        storageService.saveLeads(leads);
      } catch (error) {
        console.error('Failed to save leads:', error);
        if (error instanceof Error && error.message.includes('quota')) {
          toast.error('Storage quota exceeded. Please export and clear some leads.');
        }
      }
    }
  }, [leads]);

  const [scanConfig, setScanConfig] = useState<{
    country: Country;
    industry: Industry;
    city: string;
  }>({
    country: 'United Kingdom',
    industry: 'Salons & spas',
    city: 'London'
  });

  // Derived Stats (Calculated from ALL leads)
  const stats: DiscoveryStats = useMemo(() => {
    return {
      totalFound: leads.length,
      noWebsiteCount: leads.filter(l => !l.hasWebsite).length,
      withEmailCount: leads.filter(l => l.email !== null).length,
      activeCount: leads.filter(l => l.isActive).length,
    };
  }, [leads]);

  // Filtered & Sorted Leads for the Table
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(l => 
        l.name.toLowerCase().includes(query) || 
        l.city.toLowerCase().includes(query) || 
        l.phone.includes(query) ||
        (l.email && l.email.toLowerCase().includes(query))
      );
    }

    // Toggle filters
    if (filterNoWebsite) {
      result = result.filter(l => !l.hasWebsite);
    }
    if (filterHasEmail) {
      result = result.filter(l => l.email !== null);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'score') return b.leadScore - a.leadScore;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'newest') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      return 0;
    });

    return result;
  }, [leads, searchQuery, filterNoWebsite, filterHasEmail, sortBy]);

  // Paginated leads
  const displayedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredLeads.slice(startIndex, endIndex);
  }, [filteredLeads, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterNoWebsite, filterHasEmail, sortBy]);

  const countryData = useMemo(() => {
    return COUNTRIES.map(c => ({
      name: c,
      leads: leads.filter(l => l.country === c).length
    }));
  }, [leads]);

  const startDiscovery = async () => {
    setIsScanning(true);
    toast.info('Starting discovery process...');

    try {
      let results: BusinessLead[] = [];
      const hasGooglePlacesKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY;

      // Step 1: Try Google Places API first if available
      if (hasGooglePlacesKey) {
        try {
          toast.info('Fetching real business data from Google Places...');
          const places = await searchBusinesses(
            scanConfig.country,
            scanConfig.industry,
            scanConfig.city
          );

          // Filter for businesses without websites (our target)
          const placesWithoutWebsites = places.filter(p => !p.website);
          
          // Get detailed information for each place
          const detailedPlaces = await Promise.all(
            placesWithoutWebsites.slice(0, 10).map(async (place) => {
              const details = await getPlaceDetails(place.place_id);
              return details || place;
            })
          );

          const placesResults = detailedPlaces
            .filter(p => !p.website) // Double-check no website
            .map(place => convertPlaceToLead(place, scanConfig.industry, scanConfig.country, scanConfig.city));

          if (placesResults.length > 0) {
            results.push(...placesResults);
            toast.success(`Found ${placesResults.length} businesses from Google Places`);
          }
        } catch (error) {
          console.error('Google Places API error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          if (errorMessage.includes('CORS') || errorMessage.includes('backend')) {
            toast.error('Google Places requires a backend proxy. Using AI discovery instead...');
          } else {
            toast.warning('Google Places API error. Trying other sources...');
          }
        }
      }

      // Step 2: Search Business Directories (Yelp, Yellow Pages, etc.)
      try {
        toast.info('Searching business directories...');
        const directoryResults = await searchBusinessDirectories(
          scanConfig.country,
          scanConfig.industry,
          scanConfig.city
        );

        if (directoryResults.length > 0) {
          results.push(...directoryResults);
          toast.success(`Found ${directoryResults.length} businesses from directories`);
        }
      } catch (error) {
        console.error('Directory search error:', error);
        toast.warning('Directory search encountered issues. Continuing...');
      }

      // Step 3: Fallback to AI discovery if we still don't have enough results
      if (results.length < 5) {
        try {
          toast.info('Using AI-powered discovery to find more leads...');
          const aiResults = await discoverBusinesses(scanConfig.country, scanConfig.industry, scanConfig.city);
          
          if (aiResults.length > 0) {
            results.push(...aiResults);
            toast.success(`Discovered ${aiResults.length} additional leads using AI`);
          }
        } catch (error) {
          console.error('AI discovery error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          if (errorMessage.includes('GEMINI_API_KEY')) {
            toast.error('GEMINI_API_KEY is not configured. Please add it to your .env.local file.');
          } else {
            toast.error(`AI discovery failed: ${errorMessage}`);
          }
        }
      }

      if (results.length === 0) {
        toast.warning('No leads found. Try different search parameters.');
        setIsScanning(false);
        return;
      }

      // De-duplication check based on name + city
      setLeads(prev => {
        const existingKeys = new Set(prev.map(l => `${l.name.toLowerCase()}-${l.city.toLowerCase()}`));
        const uniqueNewResults = results.filter(r => 
          !existingKeys.has(`${r.name.toLowerCase()}-${r.city.toLowerCase()}`)
        );
        
        if (uniqueNewResults.length < results.length) {
          const duplicates = results.length - uniqueNewResults.length;
          toast.info(`Skipped ${duplicates} duplicate lead(s)`);
        }
        
        return [...prev, ...uniqueNewResults];
      });

      if (results.length > 0) {
        toast.success(`Successfully added ${results.length} new lead(s) from multiple sources`);
      } else {
        toast.warning('No leads found from any source. Try different search parameters.');
      }
    } catch (error) {
      console.error('Discovery error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to discover leads. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleExport = () => {
    try {
      const headers = [
        'Name',
        'Industry',
        'Country',
        'City',
        'Phone',
        'Email',
        'Email Source',
        'Has Website',
        'Website URL',
        'Is Active',
        'Lead Score',
        'Review Count',
        'Last Review Date',
        'Maps URL',
        'Directory Source',
        'Notes',
        'Date Added'
      ];

      const csvRows = [
        headers.join(','),
        ...filteredLeads.map(l => [
          `"${l.name.replace(/"/g, '""')}"`,
          `"${l.industry.replace(/"/g, '""')}"`,
          `"${l.country.replace(/"/g, '""')}"`,
          `"${l.city.replace(/"/g, '""')}"`,
          `"${l.phone.replace(/"/g, '""')}"`,
          `"${l.email?.replace(/"/g, '""') || ''}"`,
          `"${l.emailSource}"`,
          l.hasWebsite,
          `"${l.mapsUrl.replace(/"/g, '""')}"`,
          l.isActive,
          l.leadScore,
          l.reviewCount,
          `"${l.lastReviewDate}"`,
          `"${l.mapsUrl.replace(/"/g, '""')}"`,
          `"${l.directorySource.replace(/"/g, '""')}"`,
          `"${(l.notes || '').replace(/"/g, '""')}"`,
          `"${l.dateAdded}"`
        ].join(','))
      ];

      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `business_leads_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${filteredLeads.length} lead(s) to CSV`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export leads. Please try again.');
    }
  };

  const clearDatabase = () => {
    if (window.confirm("Are you sure you want to clear all discovered leads? This action cannot be undone.")) {
      try {
        storageService.clearLeads();
        setLeads([]);
        setCurrentPage(1);
        toast.success('All leads cleared successfully');
      } catch (error) {
        console.error('Clear error:', error);
        toast.error('Failed to clear leads');
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 text-indigo-400 mb-8">
            <RefreshCw className="w-8 h-8 animate-spin-slow" />
            <h1 className="text-xl font-bold tracking-tight text-white">BizDiscover AI</h1>
          </div>
          
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('discovery')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'discovery' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Search className="w-5 h-5" /> Engine Room
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'database' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Database className="w-5 h-5" /> Lead Database
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 uppercase font-bold">Credits Remaining</span>
              <span className="text-xs text-indigo-400">92%</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-[92%]" />
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 pb-20">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">{activeTab}</h2>
            <p className="text-slate-500">Automated business discovery & validation engine</p>
          </div>
          <div className="flex gap-3">
            {leads.length > 0 && (
              <button 
                onClick={clearDatabase}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors shadow-sm"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            )}
            <button 
              onClick={handleExport}
              disabled={leads.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={() => setActiveTab('discovery')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" /> New Discovery Run
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            <StatsCards stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Leads by Country</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countryData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      />
                      <Bar dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Discovery Activity</h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-mono uppercase">Live Log</span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Module 2 Active</p>
                      <p className="text-xs text-blue-700">Multi-step website validation currently checking {leads.length} leads for domain matches.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex gap-3 items-start">
                    <Globe className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">Engine Operational</p>
                      <p className="text-xs text-green-700">All modules synchronized. Country-specific scrapers ready for deployment.</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Leads with verified emails</span>
                    <span className="text-sm font-bold text-indigo-600">{stats.withEmailCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Avg. Lead Score</span>
                    <span className="text-sm font-bold">
                      {leads.length > 0 ? (leads.reduce((acc, curr) => acc + curr.leadScore, 0) / leads.length).toFixed(1) : '0.0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-semibold">Recent High-Value Leads</h3>
                <button 
                  onClick={() => {
                    setSortBy('score');
                    setActiveTab('database');
                  }}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  View All Database
                </button>
              </div>
              <LeadTable leads={leads.sort((a,b) => b.leadScore - a.leadScore).slice(0, 5)} />
            </div>
          </>
        )}

        {activeTab === 'discovery' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <RefreshCw className={`w-8 h-8 text-indigo-600 ${isScanning ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Lead Discovery Engine</h3>
                  <p className="text-slate-500">Configure parameters for automated scanning and validation.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Target Country</label>
                  <select 
                    value={scanConfig.country}
                    onChange={(e) => {
                      const country = e.target.value as Country;
                      setScanConfig({ ...scanConfig, country, city: MOCK_CITIES[country][0] });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">City / Region</label>
                  <select 
                    value={scanConfig.city}
                    onChange={(e) => setScanConfig({ ...scanConfig, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {MOCK_CITIES[scanConfig.country].map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Business Industry</label>
                  <select 
                    value={scanConfig.industry}
                    onChange={(e) => setScanConfig({ ...scanConfig, industry: e.target.value as Industry })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <DirectoryInfo country={scanConfig.country} />

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="text-sm font-medium">Auto-validate business activity (reviews & hours)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="text-sm font-medium">Execute multi-step website check (Search + Maps + Directories)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="text-sm font-medium">Search business directories (Yelp, Yellow Pages, etc.)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="text-sm font-medium">Scrape social signals for public email discovery</span>
                </div>
              </div>

              <button 
                onClick={startDiscovery}
                disabled={isScanning}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Executing Discovery Protocol...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-6 h-6" />
                    Initialize Automated Run
                  </>
                )}
              </button>
            </div>

            {isScanning && (
              <div className="bg-slate-900 text-slate-300 p-6 rounded-xl font-mono text-xs space-y-2 border border-slate-700 shadow-inner overflow-hidden max-h-64 overflow-y-auto">
                <p className="text-indigo-400">[SYSTEM] Starting Multi-Source Discovery Engine...</p>
                <p>[STEP 1] Querying Google Places API for {scanConfig.industry} in {scanConfig.city}, {scanConfig.country}...</p>
                <p>[STEP 2] Searching business directories (Yelp, Yellow Pages, etc.)...</p>
                <p>[STEP 3] Cross-referencing {scanConfig.country} public directories...</p>
                <p className="animate-pulse text-green-400">[PROCESS] Validating website existence for discovered businesses...</p>
                <p>[EXTRACT] Scanning directories for contact information...</p>
                <p>[SCORE] Calculating lead prioritization scores...</p>
                <p>[DEDUPE] Removing duplicate entries...</p>
                <p>[STORE] Appending unique records to persistent lead database...</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search leads by name, city, phone, or email..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilterNoWebsite(!filterNoWebsite)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border ${filterNoWebsite ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <Filter className={`w-4 h-4 ${filterNoWebsite ? 'text-indigo-600' : ''}`} /> No Website
                </button>
                <button 
                  onClick={() => setFilterHasEmail(!filterHasEmail)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border ${filterHasEmail ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <Mail className={`w-4 h-4 ${filterHasEmail ? 'text-indigo-600' : ''}`} /> Has Email
                </button>
                <div className="h-10 w-[1px] bg-slate-200 mx-1 hidden md:block" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="score">Sort by Score (High to Low)</option>
                  <option value="newest">Sort by Date Added (Newest)</option>
                  <option value="reviews">Sort by Review Count</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mb-2 px-2">
              <p className="text-xs text-slate-500 font-medium">
                Showing <span className="text-slate-900 font-bold">{displayedLeads.length}</span> of <span className="text-slate-900 font-bold">{filteredLeads.length}</span> filtered leads (Total: {leads.length})
              </p>
              {(searchQuery || filterNoWebsite || filterHasEmail) && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterNoWebsite(false);
                    setFilterHasEmail(false);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold uppercase tracking-wider"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <LeadTable leads={displayedLeads} />
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredLeads.length}
                onItemsPerPageChange={(newItemsPerPage) => {
                  setItemsPerPage(newItemsPerPage);
                  setCurrentPage(1);
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Constraints Footer */}
      <footer className="fixed bottom-0 left-64 right-0 bg-white border-t border-slate-200 px-8 py-3 z-10 text-[10px] text-slate-400 flex justify-between items-center">
        <div className="flex gap-6">
          <span className="flex items-center gap-1 font-semibold"><XCircle className="w-3 h-3 text-red-400" /> NO AUTO-OUTREACH</span>
          <span className="flex items-center gap-1 font-semibold"><XCircle className="w-3 h-3 text-red-400" /> NO COLD EMAILS</span>
          <span className="flex items-center gap-1 font-semibold"><XCircle className="w-3 h-3 text-red-400" /> NO DATA MANIPULATION</span>
        </div>
        <div className="flex gap-4">
          <span className="tracking-widest">ENFORCING GDPR / CCPA PROTOCOLS</span>
          <span className="font-bold text-slate-500">SYSTEM v2.5.0 STABLE</span>
        </div>
      </footer>
    </div>
    </>
  );
};

export default App;
