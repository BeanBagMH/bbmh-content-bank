import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { ContentItem } from '../../types';
import { Badge } from '../common/Badge';

interface BoardViewProps {
  items: ContentItem[];
  onCardClick: (id: number) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({ items, onCardClick }) => {
  return (
    <div className="flex gap-16 items-start h-full">
      <BoardColumn 
        label="Video Production" 
        items={items.filter(d => d.col === "video")} 
        onCardClick={onCardClick} 
      />
      <BoardColumn 
        label="Strategic Writing" 
        items={items.filter(d => d.col === "blog")} 
        onCardClick={onCardClick} 
      />
      <BoardColumn 
        label="Micro-Content" 
        items={items.filter(d => d.col === "social")} 
        onCardClick={onCardClick} 
      />
    </div>
  );
};

interface BoardColumnProps {
  label: string;
  items: ContentItem[];
  onCardClick: (id: number) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({ label, items, onCardClick }) => {
  return (
    <div className="w-[380px] flex flex-col max-h-full">
      <div className="pb-8 border-b border-mist flex items-baseline justify-between mb-8">
        <h3 className="text-xl font-display text-graphite italic">{label}</h3>
        <span className="text-[10px] font-bold text-ash opacity-40">{items.length.toString().padStart(2, '0')} PIECES</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-12 custom-scrollbar pr-4">
        {items.map(item => (
          <motion.div 
            key={item.id} 
            layoutId={`card-${item.id}`}
            onClick={() => onCardClick(item.id)} 
            className="cursor-pointer group relative"
          >
            <div className="flex items-baseline gap-4 mb-4">
               <span className="text-[9px] font-bold text-ash/40 font-mono tracking-tighter">0{item.id}</span>
               <div className="h-px flex-1 bg-mist group-hover:bg-magenta/20 transition-colors" />
               <span className="text-[8px] font-bold text-ash uppercase tracking-widest">{item.cluster}</span>
            </div>
            
            <h4 className="text-2xl font-display text-graphite leading-[1.2] mb-6 group-hover:text-magenta transition-colors italic">
              {item.title}
            </h4>
            
            <div className="flex items-center gap-6">
              <Badge variant={item.fmt}>{item.fmt}</Badge>
              {item.hasScript && (
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-magenta rounded-full" />
                   <span className="text-[8px] font-bold text-magenta uppercase tracking-widest">Drafted</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        <button className="w-full py-12 border-t border-mist text-[10px] font-bold text-ash/30 uppercase tracking-[0.3em] hover:text-magenta transition-all flex items-center justify-center gap-3">
          <Plus size={14} />
          Append Strategy
        </button>
      </div>
    </div>
  );
};
