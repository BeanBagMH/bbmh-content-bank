import React from 'react';
import { 
  Search, 
  Plus, 
  Lightbulb, 
  LayoutGrid,
  Columns,
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
    <header className="h-[80px] bg-white border-b border-mist px-6 lg:px-12 flex items-center justify-between sticky top-0 z-10">
      {/* Left: Global Search (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 max-w-md relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ash/40 group-focus-within:text-cyan transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search content, ideas, or campaigns..." 
          value={filter.search || ''}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="w-full bg-light-grey/50 border border-transparent focus:border-mist focus:bg-white p-4 pl-12 rounded-xl text-[13px] font-medium transition-all outline-none"
        />
      </div>

      {/* Brand Logo for Mobile */}
      <div className="lg:hidden flex items-center gap-2">
         <div className="w-8 h-8 bg-dark rounded-lg flex items-center justify-center text-white font-black text-[10px]">B</div>
         <span className="text-[11px] font-black uppercase tracking-widest text-dark">BBMh</span>
      </div>

      {/* Center: View Switcher (Visible in Content Bank, Hidden on Mobile) */}
      {isContentBank && (
        <div className="hidden lg:flex bg-light-grey p-1 rounded-xl mx-8">
          <ViewButton 
            icon={LayoutGrid} 
            active={filter.subView === 'grid'} 
            onClick={() => setFilter({ ...filter, subView: 'grid' })} 
            title="Grid View"
          />
          <ViewButton 
            icon={List} 
            active={filter.subView === 'list'} 
            onClick={() => setFilter({ ...filter, subView: 'list' })} 
            title="List View"
          />
          <ViewButton 
            icon={Columns} 
            active={filter.subView === 'board'} 
            onClick={() => setFilter({ ...filter, subView: 'board' })} 
            title="Kanban Board"
          />
          <ViewButton 
            icon={CalendarDays} 
            active={filter.subView === 'calendar'} 
            onClick={() => setFilter({ ...filter, subView: 'calendar' })} 
            title="Calendar View"
          />
        </div>
      )}

      {/* Right: Global Actions */}
      <div className="flex items-center gap-3 lg:gap-4">
        <button 
          onClick={onQuickIdea}
          className="flex items-center gap-3 px-3 lg:px-6 py-3 text-ash hover:text-dark transition-all group"
        >
          <Lightbulb size={18} className="text-ash/40 group-hover:text-yellow-500 group-hover:scale-110 transition-all" />
          <span className="hidden lg:inline text-[11px] font-bold uppercase tracking-widest">Quick Idea</span>
        </button>

        <div className="hidden lg:block h-6 w-px bg-mist mx-2" />

        <button 
          onClick={onNewContent}
          className="bg-dark text-white px-5 lg:px-8 py-3 rounded-xl flex items-center gap-3 hover:bg-cyan transition-all active:scale-95 shadow-lg shadow-dark/10"
        >
          <Plus size={18} />
          <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.2em]">New</span>
        </button>
      </div>
    </header>
  );
};

const ViewButton = ({ icon: Icon, active, onClick, title }: { icon: any, active: boolean, onClick: () => void, title?: string }) => (
  <button 
    onClick={onClick}
    title={title}
    className={cn(
      "p-2.5 rounded-lg transition-all duration-300",
      active ? "bg-white text-dark shadow-sm" : "text-ash/40 hover:text-ash"
    )}
  >
    <Icon size={18} />
  </button>
);
