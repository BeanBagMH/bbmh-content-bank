import React from 'react';
import { Video, FileText, Share2, Calendar as CalIcon, LayoutDashboard } from 'lucide-react';
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
    <aside className="w-[260px] bg-[#09090b] flex flex-col shrink-0 border-r border-white/5 h-screen">
      <div className="p-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan rounded-2xl flex items-center justify-center font-black text-dark text-lg shadow-2xl shadow-cyan/40 rotate-3">BB</div>
          <div>
            <div className="text-white font-black text-sm tracking-tight leading-none uppercase">BBMh Studio</div>
            <div className="text-white/30 text-[9px] mt-1.5 uppercase tracking-[0.2em] font-black">Content Bank</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar space-y-1">
        <div className="px-4 py-3 text-[10px] font-black text-white/20 uppercase tracking-[0.25em] mb-1">Navigation</div>
        <NavItem 
          icon={<LayoutDashboard size={16} />} 
          label="All Views" 
          active={currentView !== "calendar" && !currentFilter.col} 
          onClick={() => { setFilter({ ...currentFilter, col: "" }); setView("board") }} 
        />
        <NavItem 
          icon={<Video size={16} />} 
          label="Video Ideas" 
          count={itemCounts.video} 
          active={currentFilter.col === "video"} 
          onClick={() => { setFilter({ ...currentFilter, col: "video" }); setView("board") }} 
        />
        <NavItem 
          icon={<FileText size={16} />} 
          label="Blog Posts" 
          count={itemCounts.blog} 
          active={currentFilter.col === "blog"} 
          onClick={() => { setFilter({ ...currentFilter, col: "blog" }); setView("board") }} 
        />
        <NavItem 
          icon={<Share2 size={16} />} 
          label="Social Content" 
          count={itemCounts.social} 
          active={currentFilter.col === "social"} 
          onClick={() => { setFilter({ ...currentFilter, col: "social" }); setView("board") }} 
        />
        <NavItem 
          icon={<CalIcon size={16} />} 
          label="Content Calendar" 
          active={currentView === "calendar"} 
          onClick={() => { setView("calendar") }} 
        />

        <div className="pt-8 px-4 py-3 text-[10px] font-black text-white/20 uppercase tracking-[0.25em] mb-1">Strategic Clusters</div>
        <button 
          onClick={() => setFilter({ ...currentFilter, cluster: "" })}
          className={cn("nav-item w-full text-left", !currentFilter.cluster && "active")}
        >Global Strategy</button>
        {clusters.map(cluster => (
          <button 
            key={cluster.id}
            onClick={() => setFilter({ ...currentFilter, cluster: cluster.id })}
            className={cn("nav-item w-full text-left group", currentFilter.cluster === cluster.id && "active")}
          >
            <span className="opacity-30 mr-3 group-hover:opacity-100 transition-opacity">{cluster.id}</span> {cluster.name}
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
          <div className="text-[10px] font-black text-cyan uppercase tracking-widest mb-2">Usage Limit</div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-cyan w-3/4 shadow-lg shadow-cyan/20" />
          </div>
          <button className="w-full py-2.5 rounded-xl bg-cyan text-dark font-black text-[11px] uppercase tracking-wider transition-all hover:bg-cyan/80 active:scale-95 shadow-lg shadow-cyan/10">
            Upgrade Plan
          </button>
        </div>
      </div>
    </aside>
  );
};

function NavItem({ icon, label, count, active, onClick }: { icon: any, label: string, count?: number, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("nav-item w-full flex items-center justify-between group", active && "active")}>
      <div className="flex items-center gap-3">
        <span className={cn("transition-colors", active ? "text-cyan" : "text-white/20 group-hover:text-white/60")}>{icon}</span>
        <span className="font-bold">{label}</span>
      </div>
      {count !== undefined && (
        <span className={cn(
          "text-[10px] px-2 py-0.5 rounded-lg font-black transition-all", 
          active ? "bg-cyan/20 text-cyan" : "bg-white/5 text-white/20 group-hover:bg-white/10"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}
