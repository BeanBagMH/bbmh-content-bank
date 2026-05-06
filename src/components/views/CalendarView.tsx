import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ContentItem } from '../../types';
import { cn } from '../common/Badge';

interface CalendarViewProps {
  items: ContentItem[];
  onCardClick: (id: number) => void;
  calMonth: number;
  setCalMonth: (m: number) => void;
  calYear: number;
  setCalYear: (y: number) => void;
  calView: 'month' | 'week';
  setCalView: (v: 'month' | 'week') => void;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  items, 
  onCardClick,
  calMonth,
  setCalMonth,
  calYear,
  setCalYear,
  calView,
  setCalView
}) => {
  
  const handlePrev = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNext = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const firstDayOfMonth = new Date(calYear, calMonth, 1);
  const lastDayOfMonth = new Date(calYear, calMonth + 1, 0);
  const startDayOfWeek = firstDayOfMonth.getDay(); 
  const offset = (startDayOfWeek === 0 ? 6 : startDayOfWeek - 1); 
  const totalDays = lastDayOfMonth.getDate();
  const totalCells = Math.ceil((offset + totalDays) / 7) * 7;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-end justify-between mb-16">
        <div className="space-y-4">
          <div className="flex items-baseline gap-6">
             <h2 className="text-7xl font-display text-graphite tracking-tighter italic leading-none">{MONTHS[calMonth]}</h2>
             <span className="text-2xl font-display text-ash/30 italic">{calYear}</span>
          </div>
          <p className="text-ash/40 text-[10px] font-bold uppercase tracking-[0.4em]">Quarter {Math.ceil((calMonth + 1) / 3)} Deployment Roadmap</p>
        </div>
        <div className="flex gap-12 items-center pb-2">
          <div className="flex gap-8">
            <button onClick={() => setCalView('month')} className={cn("text-[10px] font-bold uppercase tracking-widest transition-all", calView === 'month' ? "text-magenta italic" : "text-ash/40 hover:text-ash")}>Monthly</button>
            <button onClick={() => setCalView('week')} className={cn("text-[10px] font-bold uppercase tracking-widest transition-all", calView === 'week' ? "text-magenta italic" : "text-ash/40 hover:text-ash")}>Weekly</button>
          </div>
          <div className="flex gap-6">
            <button onClick={handlePrev} className="text-ash/40 hover:text-magenta transition-all active:scale-90"><ChevronLeft size={20} /></button>
            <button onClick={handleNext} className="text-ash/40 hover:text-magenta transition-all active:scale-90"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-7 border-b border-mist pb-4">
          {DAYS.map(d => <div key={d} className="text-center text-[9px] font-bold text-ash/30 uppercase tracking-[0.3em]">{d}</div>)}
        </div>
        <div className="flex-1 grid grid-cols-7">
          {Array.from({ length: totalCells }).map((_, i) => {
            const dayNum = i - offset + 1;
            const isOtherMonth = dayNum < 1 || dayNum > totalDays;
            const dayItems = items.filter(it => it.day === dayNum && it.month === calMonth && it.year === calYear);
            const isToday = dayNum === new Date().getDate() && calMonth === new Date().getMonth() && calYear === new Date().getFullYear();
            
            return (
              <div 
                key={i} 
                className={cn(
                  "border-r border-b border-mist/40 p-4 min-h-[160px] transition-all relative flex flex-col gap-3 group", 
                  isOtherMonth ? "bg-mist/5 opacity-0" : "hover:bg-magenta-whisper/50"
                )}
              >
                {!isOtherMonth && (
                  <>
                    <div className={cn(
                      "text-[16px] font-display italic transition-all", 
                      isToday ? "text-magenta font-black scale-125" : "text-ash/30"
                    )}>
                      {dayNum.toString().padStart(2, '0')}
                    </div>
                    <div className="space-y-4 overflow-y-auto custom-scrollbar-mini pr-1">
                      {dayItems.map(it => (
                        <div 
                          key={it.id} 
                          onClick={() => onCardClick(it.id)}
                          className="group/item cursor-pointer"
                        >
                          <div className="text-[8px] font-bold text-ash/30 uppercase tracking-[0.2em] mb-1 group-hover/item:text-magenta/50 transition-colors">{it.fmt}</div>
                          <div className="text-[13px] font-display italic text-graphite/80 leading-snug group-hover/item:text-magenta transition-colors">
                            {it.title}
                          </div>
                        </div>
                      ))}
                    </div>
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
