import React from 'react';
import { Plus } from 'lucide-react';
import type { ContentItem } from '../../types';
import { CalendarView } from './CalendarView';
import { BoardView } from './BoardView';

interface DualViewProps {
  items: ContentItem[];
  onCardClick: (id: string) => void;
  onNewContent: (date?: string, status?: string) => void;
}

export const DualView: React.FC<DualViewProps> = ({ items, onCardClick, onNewContent }) => {
  return (
    <div className="h-[calc(100vh-200px)] flex gap-6 overflow-hidden">
      {/* Left Side: Kanban (Strategy Pipeline) */}
      <div className="w-[450px] flex flex-col bg-white border border-mist rounded-[40px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-mist bg-light-grey/10 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-display font-bold text-dark">Strategy Pipeline</h3>
            <p className="text-[10px] font-bold text-ash/40 uppercase tracking-widest mt-1">Drag to schedule</p>
          </div>
          <button 
            onClick={() => onNewContent()}
            className="p-2 bg-dark text-white rounded-lg hover:bg-cyan transition-all"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <BoardView 
            items={items.filter(i => !i.publish_date)} 
            onCardClick={onCardClick} 
            onNewContent={(status) => onNewContent(undefined, status)}
          />
        </div>
      </div>

      {/* Right Side: Calendar (Deployment Roadmap) */}
      <div className="flex-1 flex flex-col bg-white border border-mist rounded-[40px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-mist bg-light-grey/10">
          <h3 className="text-xl font-display font-bold text-dark">Deployment Roadmap</h3>
          <p className="text-[10px] font-bold text-ash/40 uppercase tracking-widest mt-1">Interactive Scheduling</p>
        </div>
        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          <CalendarView items={items} onCardClick={onCardClick} onNewContent={onNewContent} />
        </div>
      </div>
    </div>
  );
};
