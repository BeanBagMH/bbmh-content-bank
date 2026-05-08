import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Lightbulb, 
  Calendar, 
  Plus
} from 'lucide-react';
import { cn } from '../common/Badge';

interface MobileNavProps {
  currentView: string;
  setView: (view: any) => void;
  onAddClick: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'planner', label: 'Planner', icon: Calendar },
  { id: 'add', label: 'Add', icon: Plus, isAction: true },
  { id: 'content-bank', label: 'Vault', icon: Database },
  { id: 'ideas-vault', label: 'Ideas', icon: Lightbulb },
];

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, setView, onAddClick }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-mist px-6 py-3 flex items-center justify-between z-40 pb-safe">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        if (item.isAction) {
          return (
            <button
              key={item.id}
              onClick={onAddClick}
              className="w-12 h-12 bg-dark rounded-full flex items-center justify-center text-white shadow-lg shadow-dark/20 active:scale-95 transition-all -translate-y-4"
            >
              <Icon size={24} />
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className="flex flex-col items-center gap-1 min-w-[50px]"
          >
            <Icon 
              size={20} 
              className={cn(
                "transition-all", 
                isActive ? "text-cyan scale-110" : "text-ash/40"
              )} 
            />
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-tighter",
              isActive ? "text-dark" : "text-ash/40"
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
