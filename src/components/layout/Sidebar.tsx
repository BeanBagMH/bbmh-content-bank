import { 
  LayoutDashboard, 
  Database, 
  Lightbulb, 
  Calendar, 
  Flag, 
  FileText, 
  Image as ImageIcon, 
  BarChart3, 
  Settings,
  LogOut,
  Layout
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../common/Badge';

interface SidebarProps {
  currentView: string;
  setView: (view: any) => void;
  itemCounts: { [key: string]: number };
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'planner', label: 'Master Planner', icon: Layout },
  { id: 'content-bank', label: 'Content Bank', icon: Database },
  { id: 'ideas-vault', label: 'Ideas Vault', icon: Lightbulb },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'campaigns', label: 'Campaigns', icon: Flag },
  { id: 'scripts', label: 'Scripts', icon: FileText },
  { id: 'thumbnails', label: 'Thumbnail Bank', icon: ImageIcon },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, itemCounts }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="hidden lg:flex w-[280px] h-full bg-white border-r border-mist flex-col z-20">
      {/* Brand Header */}
      <div className="p-10 border-b border-mist">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 bg-dark rounded-md flex items-center justify-center">
            <span className="text-white font-display text-xl font-black">B</span>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight text-dark">BBMh</h1>
            <div className="flex items-center gap-2">
              <span className="text-[8px] bg-cyan/10 text-cyan px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">V3.1.6-ACTIVATED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 group",
                isActive 
                  ? "bg-dark text-white shadow-lg shadow-dark/10" 
                  : "text-ash/70 hover:bg-light-grey hover:text-dark"
              )}
            >
              <div className="flex items-center gap-4">
                <Icon size={18} className={cn("transition-transform group-hover:scale-110", isActive ? "text-turquoise" : "")} />
                <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
              </div>
              
              {itemCounts[item.id] !== undefined && (
                <span className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded-full border",
                  isActive ? "border-white/20 text-white/40" : "border-mist text-ash/40"
                )}>
                  {itemCounts[item.id].toString().padStart(2, '0')}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-6 border-t border-mist space-y-4">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-light-grey/50">
          <div className="w-10 h-10 rounded-full bg-mist overflow-hidden border border-white">
             {/* Avatar placeholder */}
             <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-ash">MP</div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-dark truncate">BeanBag Media</p>
            <p className="text-[10px] text-ash/60 truncate italic">Strategic Sanctuary</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-ash/40 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between px-2">
           <span className="text-[9px] font-bold text-ash/30 uppercase tracking-widest">V3.1.6-ACTIVATED</span>
           <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              <span className="text-[9px] font-bold text-cyan uppercase tracking-widest">Live Sync</span>
           </div>
        </div>
      </div>
    </aside>
  );
};
