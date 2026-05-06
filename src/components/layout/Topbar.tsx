import React from 'react';
import { Search, Grid, List as ListIcon, Calendar as CalIcon, Plus, Bell } from 'lucide-react';
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
    <header className="h-20 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 px-8 flex items-center gap-8 shrink-0 z-50 sticky top-0">
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
        <TabButton active={currentFilter.tab === "all"} onClick={() => setFilter({ ...currentFilter, tab: "all" })}>All Library</TabButton>
        <TabButton active={currentFilter.tab === "ready"} onClick={() => setFilter({ ...currentFilter, tab: "ready" })}>Finalized</TabButton>
        <TabButton active={currentFilter.tab === "draft"} onClick={() => setFilter({ ...currentFilter, tab: "draft" })}>Scratchpad</TabButton>
      </div>

      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search clusters, hooks, or formats..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan/50 transition-all placeholder:text-white/10"
            value={currentFilter.search}
            onChange={(e) => setFilter({ ...currentFilter, search: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <ViewBtn active={currentView === 'board'} onClick={() => setView('board')}><Grid size={18} /></ViewBtn>
          <ViewBtn active={currentView === 'list'} onClick={() => setView('list')}><ListIcon size={18} /></ViewBtn>
          <ViewBtn active={currentView === 'calendar'} onClick={() => setView('calendar')}><CalIcon size={18} /></ViewBtn>
        </div>
        
        <button className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
          <Bell size={20} />
        </button>

        <button 
          onClick={onNewIdea} 
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-cyan text-dark font-black text-xs uppercase tracking-widest shadow-2xl shadow-cyan/20 hover:shadow-cyan/40 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={16} strokeWidth={3} /> New Strategy
        </button>
      </div>
    </header>
  );
};

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn("px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all", 
        active ? "bg-white text-dark shadow-xl" : "text-white/40 hover:text-white hover:bg-white/5"
      )}
    >
      {children}
    </button>
  );
}

function ViewBtn({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", 
        active ? "bg-cyan/20 text-cyan shadow-inner border border-cyan/30" : "text-white/20 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}
