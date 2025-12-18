
import React from 'react';
import { BusinessLead, EmailSource } from '../types';
import { ExternalLink, CheckCircle, XCircle, Star, Phone, Mail } from 'lucide-react';

interface Props {
  leads: BusinessLead[];
}

const LeadTable: React.FC<Props> = ({ leads }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Details</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">No Website</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Active</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Score</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                No leads discovered yet. Start a new discovery run.
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{lead.name}</span>
                    <span className="text-xs text-slate-500">{lead.industry} • {lead.city}, {lead.country}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Phone className="w-3 h-3" /> {lead.phone}
                    </div>
                    {lead.email ? (
                      <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium">
                        <Mail className="w-3 h-3" /> {lead.email}
                        <span className="bg-indigo-50 text-[10px] px-1 rounded text-indigo-700">{lead.emailSource}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">Email not found</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {!lead.hasWebsite ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="w-3 h-3" /> Missing
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3" /> Exists
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${lead.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {lead.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-[10px] text-slate-400">{lead.reviewCount} reviews</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-mono font-bold text-lg text-slate-700">{lead.leadScore}</span>
                </td>
                <td className="px-6 py-4">
                  <a 
                    href={lead.mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Maps Profile <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
