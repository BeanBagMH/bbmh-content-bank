import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus
} from 'lucide-react';
import type { ContentItem } from '../../types';
import { cn } from '../common/Badge';

interface CalendarViewProps {
  items: ContentItem[];
  onCardClick: (id: string) => void;
  onNewContent: () => void;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const CalendarView: React.FC<CalendarViewProps> = ({ items, onCardClick, onNewContent }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Adjusted for Monday start
  let startDayOfWeek = firstDayOfMonth.getDay(); 
  const offset = (startDayOfWeek === 0 ? 6 : startDayOfWeek - 1); 
  
  const totalDays = lastDayOfMonth.getDate();
  const totalCells = Math.ceil((offset + totalDays) / 7) * 7;

  return (
    <div className="h-full flex flex-col space-y-12">
      {/* Calendar Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-4">
          <div className="flex items-baseline gap-6">
             <h2 className="text-7xl font-display font-bold text-dark tracking-tighter italic-serif leading-none">
               {MONTHS[month]}
             </h2>
             <span className="text-3xl font-display text-ash/30 font-bold">{year}</span>
          </div>
          <p className="text-ash/70 text-[11px] font-bold uppercase tracking-[0.4em]">Content Deployment Roadmap</p>
        </div>

        <div className="flex gap-4 items-center pb-2">
          <div className="flex bg-white border border-mist rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={handlePrevMonth}
              className="p-4 hover:bg-light-grey transition-all text-ash/60 hover:text-dark"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="w-px bg-mist" />
            <button 
              onClick={handleNextMonth}
              className="p-4 hover:bg-light-grey transition-all text-ash/60 hover:text-dark"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <button 
            onClick={onNewContent}
            className="bg-dark text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-cyan transition-all shadow-lg shadow-dark/5"
          >
            <Plus size={18} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Schedule Piece</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col bg-white border border-mist rounded-3xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-b border-mist bg-light-grey/30">
          {DAYS.map(d => (
            <div key={d} className="py-6 text-center text-[10px] font-black text-ash/40 uppercase tracking-[0.3em]">
              {d}
            </div>
          ))}
        </div>
        
        <div className="flex-1 grid grid-cols-7 grid-rows-5 divide-x divide-y divide-mist/40">
          {Array.from({ length: totalCells }).map((_, i) => {
            const dayNum = i - offset + 1;
            const isCurrentMonth = dayNum >= 1 && dayNum <= totalDays;
            const dateStr = isCurrentMonth ? `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}` : null;
            
            const dayItems = dateStr ? items.filter(it => it.publish_date?.startsWith(dateStr)) : [];
            const isToday = isCurrentMonth && 
              dayNum === new Date().getDate() && 
              month === new Date().getMonth() && 
              year === new Date().getFullYear();

            return (
              <div 
                key={i} 
                className={cn(
                  "p-4 min-h-[140px] transition-all relative flex flex-col group",
                  !isCurrentMonth ? "bg-light-grey/20" : "hover:bg-cyan/[0.02]"
                )}
              >
                {isCurrentMonth && (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <span className={cn(
                        "text-[18px] font-display font-bold transition-all",
                        isToday ? "text-cyan" : "text-ash/30 group-hover:text-ash/60"
                      )}>
                        {dayNum.toString().padStart(2, '0')}
                      </span>
                      {isToday && (
                        <span className="text-[8px] font-black text-cyan uppercase tracking-tighter bg-cyan/10 px-2 py-0.5 rounded-full">
                          Today
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 overflow-y-auto custom-scrollbar-mini pr-1">
                      {dayItems.map(it => (
                        <div 
                          key={it.id} 
                          onClick={() => onCardClick(it.id)}
                          className="p-3 bg-white border border-mist rounded-lg cursor-pointer hover:border-cyan/40 hover:shadow-lg hover:shadow-dark/5 transition-all group/item"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-cyan" />
                             <span className="text-[9px] font-bold text-ash/40 uppercase tracking-widest truncate">{it.content_type}</span>
                          </div>
                          <div className="text-[13px] font-bold text-dark leading-tight group-hover/item:text-cyan transition-colors truncate">
                            {it.title}
                          </div>
                        </div>
                      ))}
                    </div>

                    {isCurrentMonth && dayItems.length === 0 && (
                      <button 
                        onClick={onNewContent}
                        className="mt-auto opacity-0 group-hover:opacity-100 flex items-center gap-2 text-[10px] font-bold text-cyan/60 hover:text-cyan transition-all"
                      >
                         <Plus size={12} />
                         <span>Add</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
