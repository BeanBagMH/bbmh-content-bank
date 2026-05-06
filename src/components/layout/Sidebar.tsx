import React from 'react';
import { Video, FileText, Share2, Calendar as CalIcon, Plus } from 'lucide-react';
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
    <aside className="w-[240px] bg-[#1a1a1b] flex flex-col shrink-0 border-r border-white/5">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-cyan/20">BB</div>
          <div>
            <div className="text-white font-bold text-sm leading-none">BBMh Workspace</div>
            <div className="text-white/40 text-[10px] mt-1 uppercase tracking-wider font-semibold">Creative Strategy</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Content</div>
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
          label="Social Media" 
          count={itemCounts.social} 
          active={currentFilter.col === "social"} 
          onClick={() => { setFilter({ ...currentFilter, col: "social" }); setView("board") }} 
        />
        <NavItem 
          icon={<CalIcon size={16} />} 
          label="Calendar" 
          active={currentView === "calendar" && !currentFilter.col} 
          onClick={() => { setFilter({ ...currentFilter, col: "" }); setView("calendar") }} 
        />

        <div className="pt-6 px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Clusters</div>
        <button 
          onClick={() => setFilter({ ...currentFilter, cluster: "" })}
          className={cn("nav-item w-full text-left transition-all duration-200", !currentFilter.cluster && "active")}
        >All Clusters</button>
        {clusters.map(cluster => (
          <button 
            key={cluster.id}
            onClick={() => setFilter({ ...currentFilter, cluster: cluster.id })}
            className={cn("nav-item w-full text-left transition-all duration-200", currentFilter.cluster === cluster.id && "active")}
          >
            <span className="opacity-50 mr-2">{cluster.id}</span> {cluster.name}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button className="w-full py-2.5 px-4 rounded-xl bg-cyan/10 border border-cyan/20 text-cyan font-bold text-xs flex items-center justify-center gap-2 transition-all hover:bg-cyan/20 active:scale-95">
          <Plus size={14} strokeWidth={3} /> Invite Members
        </button>
      </div>
    </aside>
  );
};

function NavItem({ icon, label, count, active, onClick }: { icon: any, label: string, count?: number, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("nav-item w-full flex items-center justify-between transition-all duration-200", active && "active")}>
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="font-semibold text-[13px]">{label}</span>
      </div>
      {count !== undefined && <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors", active ? "bg-white/20 text-white" : "bg-white/10 text-white/50")}>{count}</span>}
    </button>
  );
}
