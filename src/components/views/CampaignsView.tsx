// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Plus, Users, Layout, ArrowUpRight } from 'lucide-react';
import type { Campaign, ContentItem } from '../../types';
import { cn } from '../common/Badge';
import { NewCampaignModal } from '../modals/NewCampaignModal';

interface CampaignsViewProps {
  campaigns: Campaign[];
  items: ContentItem[];
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({ campaigns, items }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-5xl font-display font-bold text-dark tracking-tighter mb-4">Strategic Clusters</h2>
           <p className="text-ash/60 text-[11px] font-bold uppercase tracking-[0.4em]">High-Level Campaign Management</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-dark text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-cyan transition-all shadow-lg shadow-dark/5"
        >
          <Plus size={18} />
          <span className="text-[11px] font-bold uppercase tracking-widest">New Cluster</span>
        </button>
      </div>

      <NewCampaignModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              itemCount={items.filter(i => i.campaign_id === campaign.id).length} 
            />
          ))
        ) : (
          <div 
            onClick={() => setIsModalOpen(true)}
            className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-white border border-mist rounded-[40px] border-dashed cursor-pointer hover:bg-light-grey/30 transition-all"
          >
             <div className="w-16 h-16 bg-light-grey rounded-full flex items-center justify-center mb-6 text-ash/20">
                <Flag size={32} />
             </div>
             <p className="text-sm font-bold text-ash/40 uppercase tracking-widest">No active clusters found</p>
             <button className="mt-6 text-cyan text-[11px] font-black uppercase tracking-widest hover:tracking-[0.2em] transition-all">Initialize First Campaign →</button>
          </div>
        )}
      </div>
    </div>
  );
};

const CampaignCard = ({ campaign, itemCount }: { campaign: Campaign, itemCount: number }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="bg-white border border-mist p-10 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-dark/5 transition-all group"
  >
    <div className="flex justify-between items-start mb-8">
      <div className="w-14 h-14 bg-light-grey rounded-2xl flex items-center justify-center text-dark group-hover:bg-dark group-hover:text-white transition-all">
        <Layout size={24} />
      </div>
      <div className={cn(
        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
        campaign.status === 'Active' ? "bg-turquoise/10 text-cyan" : "bg-light-grey text-ash/40"
      )}>
        {campaign.status}
      </div>
    </div>

    <h3 className="text-2xl font-display font-bold text-dark mb-4 group-hover:text-cyan transition-colors">{campaign.name}</h3>
    <p className="text-ash/60 text-sm leading-relaxed mb-8 line-clamp-2">{campaign.objective || 'No objective defined for this cluster.'}</p>

    <div className="flex items-center gap-6 pt-8 border-t border-mist/40">
       <div className="flex items-center gap-2">
          <DatabaseIcon size={14} className="text-ash/30" />
          <span className="text-[11px] font-bold text-dark">{itemCount} Pieces</span>
       </div>
       <div className="flex items-center gap-2">
          <Users size={14} className="text-ash/30" />
          <span className="text-[11px] font-bold text-dark">85% Progress</span>
       </div>
       <button className="ml-auto text-ash/20 group-hover:text-dark transition-colors">
          <ArrowUpRight size={20} />
       </button>
    </div>
  </motion.div>
);

const DatabaseIcon = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);
