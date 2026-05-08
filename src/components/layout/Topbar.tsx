import React from 'react';
import { 
  Search, 
  Plus, 
  Lightbulb, 
  Filter, 
  ArrowUpDown,
  LayoutGrid,
  Layout,
  List,
  CalendarDays
} from 'lucide-react';
import { cn } from '../common/Badge';

interface TopbarProps {
  currentView: string;
  setView: (view: any) => void;
  onNewContent: () => void;
  onQuickIdea: () => void;
  filter: any;
  setFilter: (f: any) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ 
  currentView, 
  onNewContent, 
  onQuickIdea,
  filter,
  setFilter
}) => {
  const isContentBank = currentView === 'content-bank';

  return (
    <header className="h-[80px] bg-white border-b border-mist px-12 flex items-center justify-between sticky top-0 z-10">
      {/* Left: Global Search */}
      <div className="flex-1 max-w-md relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ash/40 group-focus-within:text-cyan transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search content, ideas, or campaigns..." 
          value={filter.search || ''}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="w-full bg-light-grey/50 border border-transparent focus:border-mist focus:bg-white p-4 pl-12 rounded-xl text-[13px] font-medium transition-all outline-none"
        />
      </div>

      {/* Center: View Switcher (Visible in Content Bank) */}
      {isContentBank && (
        <div className="flex bg-light-grey p-1 rounded-xl mx-8">
          <ViewButton 
            icon={LayoutGrid} 
            active={filter.subView === 'grid'} 
            onClick={() => setFilter({ ...filter, subView: 'grid' })} 
          />
          <ViewButton 
            icon={Layout} 
            active={filter.subView === 'board'} 
            onClick={() => setFilter({ ...filter, subView: 'board' })} 
          />
          <ViewButton 
            icon={List} 
            active={filter.subView === 'list'} 
            onClick={() => setFilter({ ...filter, subView: 'list' })} 
          />
          <ViewButton 
            icon={CalendarDays} 
            active={filter.subView === 'calendar'} 
            onClick={() => setFilter({ ...filter, subView: 'calendar' })} 
          />
        </div>
      )}

      {/* Right: Global Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onQuickIdea}
          className="flex items-center gap-3 px-6 py-3 text-ash hover:text-dark transition-all group"
        >
          <Lightbulb size={18} className="text-ash/40 group-hover:text-yellow-500 group-hover:scale-110 transition-all" />
          <span className="text-[11px] font-bold uppercase tracking-widest">Quick Idea</span>
        </button>

        <div className="h-6 w-px bg-mist mx-2" />

        <div className="flex items-center gap-2">
           <button className="p-3 text-ash/60 hover:text-dark hover:bg-light-grey rounded-lg transition-all">
             <Filter size={18} />
           </button>
           <button className="p-3 text-ash/60 hover:text-dark hover:bg-light-grey rounded-lg transition-all">
             <ArrowUpDown size={18} />
           </button>
        </div>

        <button 
          onClick={onNewContent}
          className="bg-dark text-white px-8 py-3 rounded-xl flex items-center gap-3 hover:bg-cyan transition-all active:scale-95 shadow-lg shadow-dark/10"
        >
          <Plus size={18} />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">New Content</span>
        </button>
      </div>
    </header>
  );
};

const ViewButton = ({ icon: Icon, active, onClick }: { icon: any, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "p-2.5 rounded-lg transition-all duration-300",
      active ? "bg-white text-dark shadow-sm" : "text-ash/40 hover:text-ash"
    )}
  >
    <Icon size={18} />
  </button>
);
