// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Calendar, Type, Globe, Tag, Maximize2 } from 'lucide-react';
import type { ContentItem } from '../../types';
import { Badge } from '../common/Badge';

interface GridViewProps {
  items: ContentItem[];
  onCardClick: (id: string) => void;
}

export const GridView: React.FC<GridViewProps> = ({ items, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onCardClick(item.id)}
          className="group relative bg-white border border-mist rounded-3xl p-6 hover:border-cyan/40 hover:shadow-xl hover:shadow-dark/5 transition-all cursor-pointer flex flex-col h-full"
        >
          {/* Top Metadata */}
          <div className="flex items-center justify-between mb-6">
             <Badge variant={item.content_type} className="text-[9px] px-2 py-0.5">{item.content_type}</Badge>
             <div className="flex items-center gap-3">
                <Badge variant={item.priority} className="w-2 h-2 rounded-full p-0" title={item.priority} />
                <button className="text-ash/30 hover:text-dark transition-colors">
                  <MoreHorizontal size={14} />
                </button>
             </div>
          </div>

          {/* Title */}
          <h4 className="text-xl font-display font-bold text-dark leading-[1.2] mb-4 group-hover:text-cyan transition-colors">
            {item.title}
          </h4>

          {/* Snippet */}
          <p className="text-[13px] text-ash/60 line-clamp-3 mb-8 italic-serif">
            {item.hook || item.notes || "No strategy snippet provided yet..."}
          </p>

          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity flex items-center justify-center gap-4 rounded-3xl pointer-events-none group-hover:pointer-events-none">
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 onCardClick(item.id);
               }}
               className="p-3 bg-white rounded-full text-dark hover:bg-cyan hover:text-white transition-all pointer-events-auto"
             >
                <Maximize2 size={18} />
             </button>
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 onCardClick(item.id);
               }}
               className="p-3 bg-white rounded-full text-dark hover:bg-cyan hover:text-white transition-all pointer-events-auto"
               title="Schedule Piece"
             >
                <Calendar size={18} />
             </button>
          </div>

          {/* Footer Metadata */}
          <div className="mt-auto pt-6 border-t border-mist/40 space-y-4">
             {item.status === 'Raw Idea' ? (
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   onCardClick(item.id);
                 }}
                 className="w-full py-3 bg-dark text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-cyan transition-all"
               >
                 Promote to Strategy
               </button>
             ) : (
               <>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-ash/40">
                       <Globe size={12} />
                       <span className="text-[10px] font-bold uppercase tracking-widest">{item.platform || 'Multi'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-ash/40">
                       <Calendar size={12} />
                       <span className="text-[10px] font-mono">{item.publish_date ? new Date(item.publish_date).toLocaleDateString() : 'Set Date'}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-2">
                    <Tag size={12} className="text-cyan/40" />
                    <span className="text-[10px] font-bold text-cyan uppercase tracking-[0.2em]">{item.cluster || 'General'}</span>
                 </div>
               </>
             )}
          </div>
        </motion.div>
      ))}
      
      {/* Empty State */}
      {items.length === 0 && (
        <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 bg-light-grey rounded-full flex items-center justify-center mb-6 text-ash/20">
              <Type size={40} />
           </div>
           <h3 className="text-xl font-display font-bold text-dark/40">The Vault Is Silent</h3>
           <p className="text-ash/30 text-[11px] font-bold uppercase tracking-widest mt-2">Deploy a new strategy to begin</p>
        </div>
      )}
    </div>
  );
};
