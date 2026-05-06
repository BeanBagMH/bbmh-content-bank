import React from 'react';
import { Search, Grid, List as ListIcon, Calendar as CalIcon, Plus } from 'lucide-react';
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
    <header className="h-16 bg-white border-b border-border px-8 flex items-center gap-6 shrink-0 z-10 shadow-sm">
      <h1 className="font-display text-xl tracking-tight text-dark uppercase font-black">BBMH Content</h1>
      
      <div className="flex bg-background p-1 rounded-xl border border-border/50">
        <TabButton active={currentFilter.tab === "all"} onClick={() => setFilter({ ...currentFilter, tab: "all" })}>All Ideas</TabButton>
        <TabButton active={currentFilter.tab === "ready"} onClick={() => setFilter({ ...currentFilter, tab: "ready" })}>Script Ready</TabButton>
        <TabButton active={currentFilter.tab === "draft"} onClick={() => setFilter({ ...currentFilter, tab: "draft" })}>Drafts</TabButton>
      </div>

      <div className="flex-1" />

      <div className="relative w-64 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-cyan transition-colors" size={14} />
        <input 
          type="text" 
          placeholder="Search strategy..." 
          className="w-full bg-background border border-border rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan/10 focus:border-cyan transition-all"
          value={currentFilter.search}
          onChange={(e) => setFilter({ ...currentFilter, search: e.target.value })}
        />
      </div>

      <div className="flex bg-background p-1 rounded-xl border border-border">
        <ViewBtn active={currentView === 'board'} onClick={() => setView('board')}><Grid size={14} /></ViewBtn>
        <ViewBtn active={currentView === 'list'} onClick={() => setView('list')}><ListIcon size={14} /></ViewBtn>
        <ViewBtn active={currentView === 'calendar'} onClick={() => setView('calendar')}><CalIcon size={14} /></ViewBtn>
      </div>

      <button onClick={onNewIdea} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan text-white font-bold text-xs shadow-lg shadow-cyan/20 hover:shadow-cyan/30 active:scale-95 transition-all">
        <Plus size={14} strokeWidth={3} /> New Idea
      </button>
    </header>
  );
};

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", 
        active ? "bg-dark text-white shadow-md shadow-dark/20" : "text-muted hover:text-dark hover:bg-white/50"
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
      className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all", 
        active ? "bg-white text-cyan shadow-sm border border-border/20" : "text-muted hover:text-dark"
      )}
    >
      {children}
    </button>
  );
}
