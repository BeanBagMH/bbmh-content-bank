import React from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal } from 'lucide-react';
import type { ContentItem } from '../../types';
import { Badge, cn } from '../common/Badge';

interface BoardViewProps {
  items: ContentItem[];
  onCardClick: (id: number) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({ items, onCardClick }) => {
  return (
    <div className="flex gap-8 items-start h-full">
      <BoardColumn 
        label="Video Library" 
        items={items.filter(d => d.col === "video")} 
        onCardClick={onCardClick} 
        color="bg-cyan" 
      />
      <BoardColumn 
        label="Written Strategy" 
        items={items.filter(d => d.col === "blog")} 
        onCardClick={onCardClick} 
        color="bg-turq" 
      />
      <BoardColumn 
        label="Social Micro-Content" 
        items={items.filter(d => d.col === "social")} 
        onCardClick={onCardClick} 
        color="bg-red" 
      />
    </div>
  );
};

interface BoardColumnProps {
  label: string;
  items: ContentItem[];
  onCardClick: (id: number) => void;
  color: string;
}

const BoardColumn: React.FC<BoardColumnProps> = ({ label, items, onCardClick, color }) => {
  return (
    <div className="w-[360px] bg-white/[0.02] rounded-[32px] border border-white/5 flex flex-col max-h-full">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn("w-3 h-3 rounded-full shadow-lg shadow-current", color)} />
          <h3 className="text-xs font-black text-white uppercase tracking-[0.15em]">{label}</h3>
          <span className="text-[10px] font-black text-white/30 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">{items.length}</span>
        </div>
        <button className="text-white/20 hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {items.map(item => (
          <motion.div 
            key={item.id} 
            layoutId={`card-${item.id}`}
            onClick={() => onCardClick(item.id)} 
            className="bg-[#1a1a1b] border border-white/5 p-6 rounded-[24px] cursor-pointer hover:border-cyan/50 hover:bg-white/[0.04] transition-all group shadow-2xl shadow-black/50"
          >
            <div className="flex justify-between items-start mb-6">
              <Badge variant={item.fmt}>{item.fmt}</Badge>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{item.cluster}</span>
            </div>
            
            <h4 className="text-[15px] font-bold text-white/90 leading-[1.6] mb-8 group-hover:text-white transition-colors">{item.title}</h4>
            
            <div className="flex items-center justify-between pt-5 border-t border-white/5">
              <div className="flex -space-x-2">
                {[1, 2].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-[#1a1a1b] bg-white/10 flex items-center justify-center text-[8px] font-black text-white/40 overflow-hidden">
                    VP
                  </div>
                ))}
                <div className="w-6 h-6 rounded-full border-2 border-[#1a1a1b] bg-white/5 flex items-center justify-center text-[8px] font-black text-white/20">
                  +3
                </div>
              </div>
              
              {item.hasScript ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                  <span className="text-[9px] font-black text-cyan uppercase tracking-widest">Active Script</span>
                </div>
              ) : (
                <span className="text-[9px] font-black text-white/10 uppercase tracking-widest italic">No Script</span>
              )}
            </div>
          </motion.div>
        ))}
        
        <button className="w-full py-6 rounded-[24px] border-2 border-dashed border-white/5 text-white/20 font-black text-xs uppercase tracking-widest hover:border-cyan/20 hover:text-cyan/50 hover:bg-cyan/[0.02] transition-all flex flex-col items-center gap-3">
          <Plus size={20} />
          Append Idea
        </button>
      </div>
    </div>
  );
};
