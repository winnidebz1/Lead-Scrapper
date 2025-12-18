
import React from 'react';
import { DiscoveryStats } from '../types';
import { Target, Globe, Mail, Activity } from 'lucide-react';

interface Props {
  stats: DiscoveryStats;
}

const StatsCards: React.FC<Props> = ({ stats }) => {
  const cards = [
    { title: 'Total Leads Found', value: stats.totalFound, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'No Website Found', value: stats.noWebsiteCount, icon: Globe, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Emails Verified', value: stats.withEmailCount, icon: Mail, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Active Status', value: stats.activeCount, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className={`${card.bg} p-3 rounded-lg`}>
            <card.icon className={`w-6 h-6 ${card.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{card.title}</p>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
