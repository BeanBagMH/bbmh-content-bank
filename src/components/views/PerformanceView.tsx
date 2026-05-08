import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Target, ArrowUp, ArrowDown } from 'lucide-react';
import type { ContentItem } from '../../types';
import { cn } from '../common/Badge';

interface PerformanceViewProps {
  items: ContentItem[];
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({ items }) => {
  const publishedItems = items.filter(i => i.status === 'Published');
  
  const totalStats = publishedItems.reduce((acc, item) => {
    return {
      views: acc.views + (item.views || 0),
      likes: acc.likes + (item.likes || 0),
      leads: acc.leads + (item.leads || 0),
      shares: acc.shares + (item.shares || 0)
    };
  }, { views: 0, likes: 0, leads: 0, shares: 0 });

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-5xl font-display font-bold text-dark tracking-tighter mb-4">Strategic Intelligence</h2>
           <p className="text-ash/60 text-[11px] font-bold uppercase tracking-[0.4em]">Aggregated Performance & Conversion Metrics</p>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard label="Total Reach" value={totalStats.views} icon={TrendingUp} trend="+12.5%" isPositive={true} />
        <StatCard label="Engagement" value={totalStats.likes} icon={Users} trend="+8.2%" isPositive={true} />
        <StatCard label="Conversions" value={totalStats.leads} icon={Target} trend="-2.1%" isPositive={false} />
        <StatCard label="Virality" value={totalStats.shares} icon={BarChart3} trend="+24.0%" isPositive={true} />
      </div>

      {/* Leaderboard */}
      <div className="bg-white border border-mist rounded-[40px] overflow-hidden shadow-sm">
        <div className="p-10 border-b border-mist flex justify-between items-center bg-light-grey/10">
           <h3 className="text-xl font-display font-bold text-dark tracking-tight">Content Leaderboard</h3>
           <div className="text-[10px] font-bold text-ash/40 uppercase tracking-widest">Sort by: High Impact</div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-mist/50">
                <th className="p-8 text-[10px] font-black text-ash/40 uppercase tracking-widest">Piece Title</th>
                <th className="p-8 text-[10px] font-black text-ash/40 uppercase tracking-widest text-center">Views</th>
                <th className="p-8 text-[10px] font-black text-ash/40 uppercase tracking-widest text-center">CTR</th>
                <th className="p-8 text-[10px] font-black text-ash/40 uppercase tracking-widest text-center">Leads</th>
                <th className="p-8 text-[10px] font-black text-ash/40 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist/30">
              {publishedItems.length > 0 ? (
                publishedItems.slice(0, 10).map((item) => (
                  <tr key={item.id} className="hover:bg-light-grey/20 transition-all group">
                    <td className="p-8">
                       <div className="text-[14px] font-bold text-dark group-hover:text-cyan transition-colors">{item.title}</div>
                       <div className="text-[10px] font-bold text-ash/40 uppercase tracking-widest mt-1">{item.platform}</div>
                    </td>
                    <td className="p-8 text-center text-sm font-bold text-dark">{(item.views || 0).toLocaleString()}</td>
                    <td className="p-8 text-center text-sm font-bold text-dark">
                      {item.views > 0 ? (((item.likes || 0) + (item.comments || 0) + (item.shares || 0)) / item.views * 100).toFixed(1) : 0}%
                    </td>
                    <td className="p-8 text-center">
                       <span className="px-3 py-1 bg-turquoise/10 text-cyan rounded-full text-[11px] font-black">{item.leads || 0}</span>
                    </td>
                    <td className="p-8 text-right">
                       <div className="flex items-center justify-end gap-2 text-turquoise">
                          <TrendingUp size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">High</span>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-32 text-center text-ash/40 italic font-medium">
                    Deploy content pieces to begin tracking performance intelligence.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, trend, isPositive }: { label: string, value: number, icon: any, trend: string, isPositive: boolean }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white border border-mist p-10 rounded-[32px] shadow-sm"
  >
    <div className="flex justify-between items-start mb-6">
       <div className="w-12 h-12 bg-light-grey rounded-2xl flex items-center justify-center text-ash/60">
          <Icon size={20} />
       </div>
       <div className={cn(
         "flex items-center gap-1 text-[10px] font-black tracking-tighter",
         isPositive ? "text-turquoise" : "text-red-500"
       )}>
          {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {trend}
       </div>
    </div>
    <div className="text-4xl font-display font-black text-dark tracking-tighter leading-none mb-3">
      {value > 999 ? `${(value / 1000).toFixed(1)}k` : value}
    </div>
    <div className="text-[10px] font-bold text-ash/40 uppercase tracking-widest">{label}</div>
  </motion.div>
);
