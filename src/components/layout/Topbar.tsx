import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../common/Badge';

interface TopbarProps {
  currentFilter: { tab: string; search: string };
  setFilter: (f: any) => void;
  currentView: string;
  setView: (v: any) => void;
  onNewIdea: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ 
  currentFilter, 
  setFilter, 
  currentView, 
  setView,
  onNewIdea
}) => {
  return (
    <header className="h-24 bg-[#fcfaf9] border-b border-mist px-12 flex items-center gap-12 shrink-0 z-50 sticky top-0">
      <div className="flex gap-8 items-center h-full">
        <TabButton active={currentFilter.tab === "all"} onClick={() => setFilter({ ...currentFilter, tab: "all" })}>Full Archive</TabButton>
        <TabButton active={currentFilter.tab === "ready"} onClick={() => setFilter({ ...currentFilter, tab: "ready" })}>Finalized</TabButton>
        <TabButton active={currentFilter.tab === "draft"} onClick={() => setFilter({ ...currentFilter, tab: "draft" })}>Scratch</TabButton>
      </div>

      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-ash/40 group-focus-within:text-magenta transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search strategy & creative..." 
            className="w-full bg-transparent border-none py-3 pl-8 pr-4 text-sm font-medium text-graphite focus:outline-none transition-all placeholder:text-ash/30 placeholder:italic"
            value={currentFilter.search}
            onChange={(e) => setFilter({ ...currentFilter, search: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center gap-8 h-full">
        <div className="flex gap-4">
          <ViewBtn active={currentView === 'board'} onClick={() => setView('board')} label="Grid" />
          <ViewBtn active={currentView === 'list'} onClick={() => setView('list')} label="Table" />
          <ViewBtn active={currentView === 'calendar'} onClick={() => setView('calendar')} label="Timeline" />
        </div>
        
        <button 
          onClick={onNewIdea} 
          className="btn-editorial"
        >
          Initialize Strategy
        </button>
      </div>
    </header>
  );
};

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn("h-full px-2 flex items-center text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative", 
        active ? "text-graphite after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-0.5 after:bg-magenta" : "text-ash/50 hover:text-ash"
      )}
    >
      {children}
    </button>
  );
}

function ViewBtn({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn("text-[9px] font-bold uppercase tracking-widest transition-all px-2 py-1", 
        active ? "text-magenta italic" : "text-ash/40 hover:text-ash"
      )}
    >
      {label}
    </button>
  );
}
