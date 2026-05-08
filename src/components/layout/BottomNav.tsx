import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Calendar, 
  Flag,
  Settings
} from 'lucide-react';
import { cn } from '../common/Badge';
import { Link } from 'react-router-dom';

interface BottomNavProps {
  currentView: string;
}

const BOTTOM_NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'content-bank', label: 'Archive', icon: Database },
  { id: 'calendar', label: 'Roadmap', icon: Calendar },
  { id: 'campaigns', label: 'Clusters', icon: Flag },
  { id: 'settings', label: 'Setup', icon: Settings },
];

export const BottomNav: React.FC<BottomNavProps> = ({ currentView }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-mist z-50 px-6 py-2 pb-8 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <Link
            key={item.id}
            to={item.id === 'dashboard' ? '/' : `/${item.id}`}
            className="flex flex-col items-center gap-1.5 p-2 transition-all duration-300 relative group"
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
              isActive ? "bg-dark text-white shadow-lg shadow-dark/20 scale-110" : "text-ash/40"
            )}>
              <Icon size={20} />
            </div>
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-widest transition-all",
              isActive ? "text-dark" : "text-ash/20"
            )}>
              {item.label}
            </span>
            
            {isActive && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
