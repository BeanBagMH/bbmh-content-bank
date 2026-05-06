import React from 'react';
import { ChevronLeft, ChevronRight, Hash } from 'lucide-react';
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
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-4 mb-2">
             <h2 className="font-display text-6xl text-white tracking-tighter uppercase font-black leading-none">{MONTHS[calMonth]}</h2>
             <span className="font-display text-6xl text-white/10">{calYear}</span>
          </div>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em]">Strategy Roadmap &rsaquo; Q{Math.ceil((calMonth + 1) / 3)} Deployment</p>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 shadow-2xl">
            <button onClick={() => setCalView('month')} className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", calView === 'month' ? "bg-white text-dark shadow-xl" : "text-white/40 hover:text-white")}>Month</button>
            <button onClick={() => setCalView('week')} className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", calView === 'week' ? "bg-white text-dark shadow-xl" : "text-white/40 hover:text-white")}>Week</button>
          </div>
          <div className="flex gap-3">
            <button onClick={handlePrev} className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center hover:border-cyan text-white/20 hover:text-cyan transition-all bg-white/5 active:scale-90"><ChevronLeft size={20} /></button>
            <button onClick={handleNext} className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center hover:border-cyan text-white/20 hover:text-cyan transition-all bg-white/5 active:scale-90"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white/[0.02] rounded-[40px] border border-white/5 overflow-hidden flex flex-col shadow-2xl shadow-black/40">
        <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.02]">
          {DAYS.map(d => <div key={d} className="py-5 text-center text-[10px] font-black text-white/20 tracking-[0.3em]">{d}</div>)}
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
                  "border-r border-b border-white/5 p-4 min-h-[140px] transition-all relative flex flex-col gap-2", 
                  isOtherMonth ? "bg-black/40 opacity-10" : "hover:bg-white/[0.02]"
                )}
              >
                {!isOtherMonth && (
                  <>
                    <div className={cn(
                      "w-8 h-8 flex items-center justify-center text-[14px] font-black mb-2 rounded-xl transition-all", 
                      isToday 
                        ? "bg-cyan text-dark shadow-2xl shadow-cyan/40 scale-110" 
                        : "text-white/20"
                    )}>
                      {dayNum}
                    </div>
                    <div className="space-y-2 overflow-y-auto custom-scrollbar-mini pr-1">
                      {dayItems.map(it => (
                        <div 
                          key={it.id} 
                          onClick={() => onCardClick(it.id)}
                          className={cn(
                            "text-[10px] font-bold px-3 py-2 rounded-xl cursor-pointer transition-all hover:scale-[1.05] active:scale-95 border-l-[3px] shadow-lg", 
                            it.col === 'video' ? "bg-cyan/10 text-cyan border-cyan/50 shadow-cyan/5" : 
                            it.col === 'social' ? "bg-red/10 text-red border-red/50 shadow-red/5" : "bg-turq/10 text-turq border-turq/50 shadow-turq/5"
                          )}
                        >
                          <div className="flex items-center gap-1.5 opacity-40 mb-1">
                             <Hash size={8} /> <span className="uppercase tracking-widest text-[7px]">{it.fmt}</span>
                          </div>
                          {it.title.length > 25 ? it.title.substring(0, 23) + '...' : it.title}
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
