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

  // Real Calendar Calculation
  const firstDayOfMonth = new Date(calYear, calMonth, 1);
  const lastDayOfMonth = new Date(calYear, calMonth + 1, 0);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
  const offset = (startDayOfWeek === 0 ? 6 : startDayOfWeek - 1); // Mon-start
  const totalDays = lastDayOfMonth.getDate();
  const totalCells = Math.ceil((offset + totalDays) / 7) * 7;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-4xl text-dark tracking-tighter uppercase font-black leading-none">{MONTHS[calMonth]} {calYear}</h2>
          <p className="text-muted text-[13px] font-bold mt-2 opacity-60">Planning the high-growth trajectory for Q{Math.ceil((calMonth + 1) / 3)}.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-white border border-border rounded-xl p-1 shadow-sm">
            <button onClick={() => setCalView('month')} className={cn("px-5 py-2 rounded-lg text-xs font-black transition-all", calView === 'month' ? "bg-dark text-white shadow-lg" : "text-muted hover:text-dark")}>Month</button>
            <button onClick={() => setCalView('week')} className={cn("px-5 py-2 rounded-lg text-xs font-black transition-all", calView === 'week' ? "bg-dark text-white shadow-lg" : "text-muted hover:text-dark")}>Week</button>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrev} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:border-cyan text-muted hover:text-cyan transition-all bg-white shadow-sm active:scale-90"><ChevronLeft size={18} /></button>
            <button onClick={handleNext} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:border-cyan text-muted hover:text-cyan transition-all bg-white shadow-sm active:scale-90"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[32px] border border-border overflow-hidden flex flex-col shadow-xl shadow-dark/5">
        <div className="grid grid-cols-7 border-b border-border bg-background/30">
          {DAYS.map(d => <div key={d} className="py-4 text-center text-[10px] font-black text-muted tracking-[0.2em]">{d}</div>)}
        </div>
        <div className="flex-1 grid grid-cols-7">
          {Array.from({ length: totalCells }).map((_, i) => {
            const dayNum = i - offset + 1;
            const isOtherMonth = dayNum < 1 || dayNum > totalDays;
            const dayItems = items.filter(it => it.day === dayNum && it.month === calMonth && it.year === calYear);
            
            return (
              <div 
                key={i} 
                className={cn(
                  "border-r border-b border-border/60 p-3 min-h-[120px] transition-colors relative flex flex-col gap-1.5", 
                  isOtherMonth ? "bg-background/20 opacity-30" : "hover:bg-cyan/[0.01]"
                )}
              >
                {!isOtherMonth && (
                  <>
                    <div className={cn(
                      "w-7 h-7 flex items-center justify-center text-[13px] font-black mb-2 rounded-full transition-all", 
                      dayNum === new Date().getDate() && calMonth === new Date().getMonth() && calYear === new Date().getFullYear() 
                        ? "bg-cyan text-white shadow-lg shadow-cyan/30" 
                        : "text-dark"
                    )}>
                      {dayNum}
                    </div>
                    <div className="space-y-1.5 overflow-y-auto custom-scrollbar-mini pr-0.5">
                      {dayItems.map(it => (
                        <div 
                          key={it.id} 
                          onClick={() => onCardClick(it.id)}
                          className={cn(
                            "text-[10px] font-black px-2.5 py-1.5 rounded-lg cursor-pointer transition-all hover:scale-[1.02] active:scale-95 border-l-2 shadow-sm", 
                            it.col === 'video' ? "bg-cyan/10 text-[#0d6b6a] border-cyan" : 
                            it.col === 'social' ? "bg-red/10 text-[#b03030] border-red" : "bg-turq/10 text-[#0a6055] border-turq"
                          )}
                        >
                          {it.title.length > 30 ? it.title.substring(0, 28) + '...' : it.title}
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
