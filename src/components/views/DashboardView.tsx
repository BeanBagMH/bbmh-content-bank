// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, AlertCircle, PieChart, CheckCircle2, Calendar } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { cn } from '../common/Badge';
import type { ContentItem } from '../../types';

interface DashboardViewProps {
  items: ContentItem[];
  setView: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ items, setView }) => {
  if (items.length === 0) {
    return (
      <EmptyState 
        icon={TrendingUp}
        title="Your Ecosystem is Empty"
        description="The Master Dashboard will light up once you capture your first ideas and strategies."
        action={{
          label: "Start Here",
          onClick: () => setView('ideas-vault')
        }}
      />
    );
  }
  const stats = React.useMemo(() => {
    const statusCounts = items.reduce((acc: any, item) => {
      const status = item.status || 'Draft';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Sort statuses by count
    const sortedStatuses = Object.entries(statusCounts)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 3);

    return {
      total: items.length,
      topStatuses: sortedStatuses,
      ready: items.filter(i => ['Review', 'Scheduled', 'published', 'Published'].includes(i.status)).length,
      stuck: items.filter(i => i.priority === 'High' && i.status !== 'Published' && i.status !== 'published').length,
      ideasCount: items.filter(i => i.status === 'Raw Idea' || i.status === 'idea').length
    };
  }, [items]);

  const scheduledThisWeek = items.filter(i => {
    if (!i.publish_date) return false;
    const date = new Date(i.publish_date);
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    return date >= now && date <= nextWeek;
  });

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-5xl font-display font-bold text-dark tracking-tighter mb-4">Strategic Overview</h2>
           <p className="text-ash/60 text-[11px] font-bold uppercase tracking-[0.4em]">BeanBag Media House Content Ecosystem</p>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={() => setView('calendar')}
            className="flex items-center gap-3 px-6 py-3 bg-white border border-mist rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-light-grey transition-all"
           >
             <Calendar size={16} className="text-cyan" />
             View Schedule
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 min-h-screen lg:h-[600px]">
        {/* Main Stats Card */}
        <DashboardCard 
          className="col-span-1 md:col-span-2 row-span-1 bg-dark text-white p-8 lg:p-10 flex flex-col justify-between"
          icon={TrendingUp}
          title="Total Content Velocity"
        >
          <div className="flex items-baseline gap-4 mt-8">
            <span className="text-8xl font-display font-black tracking-tighter leading-none">{stats.total}</span>
            <span className="text-xl font-display italic text-turquoise">Pieces Active</span>
          </div>
          <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
            {stats.topStatuses.map(([status, count]: any, idx) => (
              <StatItem 
                key={status} 
                label={status} 
                value={count} 
                color={idx === 0 ? "text-cyan" : idx === 1 ? "text-yellow-400" : "text-turquoise"} 
              />
            ))}
            {stats.topStatuses.length === 0 && (
               <StatItem label="Brain Dump" value={0} color="text-yellow-400" />
            )}
          </div>
        </DashboardCard>

        {/* Stuck Content Card */}
        <DashboardCard 
          className="col-span-1 row-span-1 bg-white border border-mist p-8 lg:p-10"
          icon={AlertCircle}
          title="Stuck Items"
          iconColor="text-red-500"
        >
          <div className="mt-8">
            <span className="text-6xl font-display font-bold text-dark leading-none">{stats.stuck}</span>
            <p className="text-ash/60 text-[11px] font-bold uppercase tracking-widest mt-4">High Priority & Pending</p>
          </div>
          <div className="mt-8 space-y-4">
             {items.filter(i => i.priority === 'High' && i.status !== 'Published').slice(0, 2).map(item => (
               <div key={item.id} className="text-[12px] font-bold text-dark truncate border-l-2 border-red-500 pl-3 py-1">
                 {item.title}
               </div>
             ))}
          </div>
        </DashboardCard>

        {/* Weekly Schedule */}
        <DashboardCard 
          className="col-span-1 md:row-span-2 bg-white border border-mist p-8 lg:p-10 flex flex-col"
          icon={Clock}
          title="Scheduled This Week"
        >
          <div className="flex-1 mt-8 space-y-6 overflow-y-auto custom-scrollbar-mini">
            {scheduledThisWeek.length > 0 ? (
              scheduledThisWeek.map(item => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="text-[9px] font-bold text-ash/40 uppercase mb-1">{new Date(item.publish_date!).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</div>
                  <div className="text-[13px] font-bold text-dark group-hover:text-cyan transition-colors">{item.title}</div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                <Calendar size={40} className="mb-4" />
                <p className="text-[11px] font-bold uppercase">No posts scheduled</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setView('calendar')}
            className="mt-8 w-full py-4 bg-light-grey rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-mist transition-all"
          >
            Manage Roadmap
          </button>
        </DashboardCard>

        {/* Content Type Distribution */}
        <DashboardCard 
          className="col-span-1 row-span-1 bg-white border border-mist p-8 lg:p-10"
          icon={PieChart}
          title="Format Mix"
        >
          <div className="mt-8 space-y-4">
             {['deep_reel', 'mirror', 'frame', 'question', 'Carousel', 'LinkedIn Post'].map(type => {
               const count = items.filter(i => i.content_type === type).length;
               const percentage = items.length ? (count / items.length) * 100 : 0;
               return (
                 <div key={type} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                       <span className="text-ash">{type}</span>
                       <span className="text-dark">{count}</span>
                    </div>
                    <div className="h-1 bg-light-grey rounded-full overflow-hidden">
                       <div className="h-full bg-cyan rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                 </div>
               );
             })}
          </div>
        </DashboardCard>

        {/* Ready to Post */}
        <DashboardCard 
          className="col-span-1 row-span-1 bg-turquoise/10 border border-turquoise/20 p-8 lg:p-10"
          icon={CheckCircle2}
          title="Ready to Deploy"
          iconColor="text-cyan"
        >
          <div className="mt-8">
            <span className="text-6xl font-display font-bold text-cyan leading-none">{stats.ready}</span>
            <p className="text-ash/60 text-[11px] font-bold uppercase tracking-widest mt-4">Approved & Finalized</p>
          </div>
          <button 
            onClick={() => {
              setView('content-bank');
              // We need to pass setFilter too if we want to filter, but DashboardView doesn't have it.
              // For now, just setView is enough, or I can update DashboardView props.
              setView('content-bank');
            }}
            className="mt-8 text-[11px] font-bold text-cyan uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all"
          >
            Review Pieces →
          </button>
        </DashboardCard>
      </div>
    </div>
  );
};

const DashboardCard = ({ children, className, icon: Icon, title, iconColor = "text-ash/40" }: { children: React.ReactNode, className?: string, icon: any, title: string, iconColor?: string }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className={cn("rounded-3xl shadow-sm transition-all", className)}
  >
    <div className="flex items-center gap-3">
       <Icon size={18} className={iconColor} />
       <h3 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const StatItem = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div>
    <div className={cn("text-3xl font-display font-bold", color)}>{value.toString().padStart(2, '0')}</div>
    <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-1">{label}</div>
  </div>
);
