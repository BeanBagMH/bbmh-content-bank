import React from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, Clock, MessageSquare, Link as LinkIcon } from 'lucide-react';
import type { ContentItem, ContentStatus } from '../../types';
import { Badge } from '../common/Badge';
import { useContentStore } from '../../hooks/useContentStore';

interface BoardViewProps {
  items: ContentItem[];
  onCardClick: (id: string) => void;
  onNewContent?: (status: ContentStatus) => void;
}

const COLUMNS: ContentStatus[] = [
  'Raw Idea',
  'Selected',
  'Research',
  'Scripting',
  'Design',
  'Editing',
  'Review',
  'Scheduled',
  'Published'
];

export const BoardView: React.FC<BoardViewProps> = ({ items, onCardClick, onNewContent }) => {
  const { updateItem } = useContentStore();

  const handleDragStart = (e: any, id: string) => {
    e.dataTransfer.setData('itemId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: ContentStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('itemId');
    if (id) {
      await updateItem(id, { status });
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 h-full custom-scrollbar items-start">
      {COLUMNS.map((status) => (
        <div 
          key={status}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
          className="min-w-[320px] max-w-[320px] flex flex-col max-h-full bg-light-grey/30 rounded-2xl p-4"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-dark">{status}</h3>
              <span className="text-[10px] font-mono text-ash/40 bg-white px-2 py-0.5 rounded-full border border-mist">
                {items.filter(i => i.status === status).length.toString().padStart(2, '0')}
              </span>
            </div>
            <button className="text-ash/40 hover:text-dark transition-colors">
              <MoreVertical size={14} />
            </button>
          </div>

          {/* Column Content */}
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 min-h-[200px]">
            {items.filter(i => i.status === status).map((item) => (
              <motion.div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onClick={() => onCardClick(item.id)}
                layoutId={item.id}
                className="bg-white border border-mist p-5 rounded-xl cursor-grab active:cursor-grabbing hover:border-cyan/40 hover:shadow-xl hover:shadow-dark/5 transition-all group relative"
              >
                <div className="flex justify-between items-start mb-3">
                   <Badge variant={item.priority} className="text-[8px] px-1.5 py-0.5">{item.priority}</Badge>
                   <span className="text-[9px] font-mono text-ash/30">#{item.id.slice(0, 4)}</span>
                </div>

                <h4 className="text-[15px] font-display font-bold text-dark leading-snug mb-4 group-hover:text-cyan transition-colors">
                  {item.title}
                </h4>

                {item.content_cluster && (
                  <div className="mb-4">
                    <span className="text-[9px] font-bold text-ash/60 uppercase tracking-widest bg-light-grey px-2 py-1 rounded-md">
                      {item.content_cluster}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-mist/40 pt-4 mt-2">
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1 text-ash/40">
                        <MessageSquare size={12} />
                        <span className="text-[9px] font-bold">4</span>
                     </div>
                     <div className="flex items-center gap-1 text-ash/40">
                        <LinkIcon size={12} />
                        <span className="text-[9px] font-bold">2</span>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <Clock size={12} className="text-ash/30" />
                     <span className="text-[9px] font-bold text-ash/60">
                        {item.publish_date ? new Date(item.publish_date).toLocaleDateString() : 'Unscheduled'}
                     </span>
                  </div>
                </div>
              </motion.div>
            ))}

            <button 
              onClick={() => onNewContent?.(status)}
              className="w-full py-4 border-2 border-dashed border-mist rounded-xl text-ash/40 hover:text-cyan hover:border-cyan/40 hover:bg-cyan/5 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus size={16} className="group-hover:scale-125 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Add Piece</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
