// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { useContentStore } from '../../hooks/useContentStore';
import { Calendar as CalendarIcon, Clock, Edit3, Image as ImageIcon, CheckCircle, Video } from 'lucide-react';

export const CalendarView = ({ onCardClick, onNewContent }: any) => {
  const { calendarPosts } = useContentStore();
  const [selectedMonth, setSelectedMonth] = useState<string>('June 2026');

  // Find unique months for the filter
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    calendarPosts.forEach(post => {
      if (post.month) months.add(post.month);
    });
    // Sort logic could go here, but they are generally sequential
    return Array.from(months);
  }, [calendarPosts]);

  const filteredPosts = useMemo(() => {
    return calendarPosts.filter(p => p.month === selectedMonth).sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [calendarPosts, selectedMonth]);

  const getStatusColor = (status: string) => {
    if (status === 'drafting') return 'bg-yellow-500/20 text-yellow-500';
    if (status === 'review') return 'bg-orange-500/20 text-orange-500';
    if (status === 'approved') return 'bg-cyan/20 text-cyan';
    if (status === 'published') return 'bg-green-500/20 text-green-500';
    return 'bg-ash/20 text-ash';
  };

  const getContentTypeIcon = (type: string) => {
    if (type === 'deep_reel') return <Video size={14} />;
    if (type === 'carousel') return <ImageIcon size={14} />;
    if (type === 'fast_reel' || type === 'mirror' || type === 'question' || type === 'contrast' || type === 'frame') return <Video size={14} className="text-yellow-500" />;
    return <Edit3 size={14} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-dark italic-serif">Master Calendar</h1>
          <p className="text-ash mt-1">116 Posts • June 2026 to January 2027</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-surface border border-mist text-dark text-sm py-2 px-4 focus:outline-none focus:border-cyan"
          >
            {availableMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPosts.map(post => {
          const isFastReel = ['mirror', 'question', 'contrast', 'frame'].includes(post.content_type);
          
          return (
            <div 
              key={post.id}
              onClick={() => onCardClick(post.id)}
              className="bg-surface border border-mist p-5 hover:border-cyan transition-colors cursor-pointer group flex flex-col h-full relative"
            >
              {/* Top Meta */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wider text-ash uppercase">
                    {post.date ? new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'TBD'}
                  </span>
                  <span className="text-xs text-ash/50 uppercase">{post.day}</span>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${getStatusColor(post.publishing_status)}`}>
                  {post.publishing_status.replace('_', ' ')}
                </div>
              </div>

              {/* Title & Hook */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-ash/60">{getContentTypeIcon(post.content_type)}</span>
                  <span className="text-xs font-bold tracking-wider text-cyan uppercase">
                    {post.script?.script_code || (post.content_type === 'carousel' ? 'CAROUSEL' : post.content_type)}
                  </span>
                </div>
                
                <h3 className="text-dark font-medium leading-tight mb-2 group-hover:text-cyan transition-colors line-clamp-3">
                  {post.title_or_hook || post.script?.title || 'Untitled Post'}
                </h3>
              </div>

              {/* Footer Meta */}
              <div className="mt-4 pt-4 border-t border-mist/50 flex items-center justify-between">
                <div className="text-[10px] text-ash uppercase tracking-wider font-bold">
                  POST #{post.post_number}
                </div>
                {post.cascade_parent_script_id && (
                  <div className="text-[10px] text-cyan uppercase tracking-wider font-bold">
                    ↳ FROM DEEP REEL
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
