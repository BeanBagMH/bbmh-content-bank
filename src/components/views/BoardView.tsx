import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { ContentItem } from '../../types';
import { Badge, cn } from '../common/Badge';

interface BoardViewProps {
  items: ContentItem[];
  onCardClick: (id: number) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({ items, onCardClick }) => {
  return (
    <div className="flex gap-6 items-start h-full">
      <BoardColumn 
        label="Video Ideas" 
        items={items.filter(d => d.col === "video")} 
        onCardClick={onCardClick} 
        color="bg-cyan" 
      />
      <BoardColumn 
        label="Blog Posts" 
        items={items.filter(d => d.col === "blog")} 
        onCardClick={onCardClick} 
        color="bg-turq" 
      />
      <BoardColumn 
        label="Social Media" 
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
    <div className="w-[320px] bg-background/50 rounded-3xl border border-border flex flex-col max-h-full shadow-inner">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", color)} />
          <h3 className="text-sm font-black text-dark uppercase tracking-tight">{label}</h3>
          <span className="text-[10px] font-black text-muted bg-muted/10 px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <button className="text-muted hover:text-cyan transition-colors p-1 hover:bg-cyan/5 rounded-lg active:scale-90"><Plus size={16} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {items.map(item => (
          <motion.div 
            key={item.id} 
            layoutId={`card-${item.id}`}
            onClick={() => onCardClick(item.id)} 
            className="bg-white border border-border p-5 rounded-2xl cursor-pointer hover:border-cyan hover:shadow-xl hover:shadow-cyan/5 transition-all group active:scale-[0.98]"
          >
            <h4 className="text-[14px] font-bold text-dark leading-[1.4] mb-5 group-hover:text-cyan transition-colors">{item.title}</h4>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant={item.fmt}>{item.fmt}</Badge>
              <span className="text-[9px] font-black text-muted/50 uppercase tracking-widest">{item.cluster}</span>
              {item.hasScript && <div className="w-1.5 h-1.5 rounded-full bg-cyan ml-auto shadow-sm shadow-cyan/40" />}
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-xs text-muted font-bold italic opacity-40">No items found</p>
          </div>
        )}
      </div>
    </div>
  );
};
