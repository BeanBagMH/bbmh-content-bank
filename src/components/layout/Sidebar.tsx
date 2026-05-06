import React from 'react';
import { cn } from '../common/Badge';

interface SidebarProps {
  currentFilter: { col: string; cluster: string };
  setFilter: (f: any) => void;
  currentView: string;
  setView: (v: any) => void;
  itemCounts: Record<string, number>;
  clusters: { id: string; name: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentFilter, 
  setFilter, 
  currentView, 
  setView,
  itemCounts,
  clusters
}) => {
  return (
    <aside className="w-[300px] bg-[#fcfaf9] flex flex-col shrink-0 border-r border-[#ececec] h-screen overflow-hidden">
      <div className="p-12 pb-16">
        <div className="space-y-1">
          <h1 className="text-3xl text-graphite tracking-tight leading-none mb-4">BBMh</h1>
          <div className="h-px w-12 bg-magenta mb-6" />
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ash">Editorial Sanctuary</p>
        </div>
      </div>

      <nav className="flex-1 px-8 overflow-y-auto custom-scrollbar space-y-8 pb-20">
        <div className="space-y-1">
          <div className="text-[9px] font-bold text-ash uppercase tracking-[0.2em] mb-4 opacity-50">Navigation</div>
          <NavItem 
            label="Library Overview" 
            active={currentView !== "calendar" && !currentFilter.col} 
            onClick={() => { setFilter({ ...currentFilter, col: "" }); setView("board") }} 
          />
          <NavItem 
            label="Video Essays" 
            count={itemCounts.video} 
            active={currentFilter.col === "video"} 
            onClick={() => { setFilter({ ...currentFilter, col: "video" }); setView("board") }} 
          />
          <NavItem 
            label="Longform Strategy" 
            count={itemCounts.blog} 
            active={currentFilter.col === "blog"} 
            onClick={() => { setFilter({ ...currentFilter, col: "blog" }); setView("board") }} 
          />
          <NavItem 
            label="Social Threads" 
            count={itemCounts.social} 
            active={currentFilter.col === "social"} 
            onClick={() => { setFilter({ ...currentFilter, col: "social" }); setView("board") }} 
          />
          <NavItem 
            label="Planning Calendar" 
            active={currentView === "calendar"} 
            onClick={() => { setView("calendar") }} 
          />
          <div className="pt-4">
            <a 
              href="https://app.appsmith.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-item w-full flex items-center justify-between group px-0 border-none bg-transparent hover:bg-transparent"
            >
              <span className="text-magenta font-bold underline underline-offset-4">Appsmith Admin Panel &rsaquo;</span>
            </a>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[9px] font-bold text-ash uppercase tracking-[0.2em] mb-4 opacity-50">Strategic Clusters</div>
          <button 
            onClick={() => setFilter({ ...currentFilter, cluster: "" })}
            className={cn("nav-item w-full text-left italic font-display text-lg px-0", !currentFilter.cluster && "active !bg-transparent !text-magenta")}
          >Global Voice</button>
          {clusters.map(cluster => (
            <button 
              key={cluster.id}
              onClick={() => setFilter({ ...currentFilter, cluster: cluster.id })}
              className={cn("nav-item w-full text-left font-display text-lg px-0 italic transition-all hover:pl-2", currentFilter.cluster === cluster.id && "active !bg-transparent !text-magenta")}
            >
              <span className="text-[10px] font-sans font-bold not-italic opacity-30 mr-3">{cluster.id}</span> {cluster.name}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-12 border-t border-mist bg-white/50">
        <div className="text-[10px] font-bold text-ash uppercase tracking-widest mb-4">v1.4.0 Live</div>
        <p className="text-[11px] leading-relaxed text-charcoal/60 italic font-display">
          "The interface feels considered, unhurried, and expert."
        </p>
      </div>
    </aside>
  );
};

function NavItem({ label, count, active, onClick }: { label: string, count?: number, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("nav-item w-full flex items-center justify-between group px-0 border-none bg-transparent hover:bg-transparent", active && "active")}>
      <span className={cn("font-medium transition-colors", active ? "text-magenta underline decoration-magenta/30 underline-offset-8" : "text-charcoal/70 group-hover:text-magenta")}>{label}</span>
      {count !== undefined && (
        <span className={cn(
          "text-[10px] font-bold transition-all", 
          active ? "text-magenta" : "text-ash opacity-40 group-hover:opacity-100"
        )}>
          {count.toString().padStart(2, '0')}
        </span>
      )}
    </button>
  );
}
