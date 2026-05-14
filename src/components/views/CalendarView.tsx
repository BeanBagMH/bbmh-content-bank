// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { useContentStore } from '../../hooks/useContentStore';
import { Calendar as CalendarIcon, Clock, Edit3, Image as ImageIcon, CheckCircle, Video, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarView = ({ onCardClick, onNewContent }: any) => {
  const { calendarPosts } = useContentStore();
  
  const [filters, setFilters] = useState({
    month: 'June 2026',
    type: 'all',
    theme: 'all',
    status: 'all',
    search: ''
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Derive unique filter options
  const options = useMemo(() => {
    const months = new Set<string>();
    const themes = new Set<string>();
    const types = new Set<string>();
    const statuses = new Set<string>();

    calendarPosts.forEach(post => {
      if (post.month) months.add(post.month);
      if (post.content_type) types.add(post.content_type);
      if (post.publishing_status) statuses.add(post.publishing_status);
      if (post.theme) themes.add(post.theme);
      if (post.script?.theme) themes.add(post.script.theme);
    });

    return {
      months: Array.from(months).sort(),
      themes: Array.from(themes).sort(),
      types: Array.from(types).sort(),
      statuses: Array.from(statuses).sort()
    };
  }, [calendarPosts]);

  const filteredPosts = useMemo(() => {
    return calendarPosts.filter(p => {
      const matchesMonth = filters.month === 'all' || p.month === filters.month;
      const matchesType = filters.type === 'all' || p.content_type === filters.type;
      const matchesTheme = filters.theme === 'all' || p.theme === filters.theme || p.script?.theme === filters.theme;
      const matchesStatus = filters.status === 'all' || p.publishing_status === filters.status;
      const matchesSearch = !filters.search || 
        (p.title_or_hook || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (p.script?.title || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (p.script?.script_code || '').toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesMonth && matchesType && matchesTheme && matchesStatus && matchesSearch;
    }).sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [calendarPosts, filters]);

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
    return <Edit3 size={14} />;
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Filters */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display text-dark italic-serif">Master Calendar</h1>
          <p className="text-ash/60 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">116 Posts • V4.0.0-PRO Strategy</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash/40" />
            <input 
              type="text" 
              placeholder="Search scripts, codes, hooks..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full bg-surface border border-mist pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-cyan text-dark font-bold"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-3 border transition-all ${isFilterOpen ? 'bg-dark text-white border-dark' : 'bg-surface text-ash border-mist hover:border-dark'}`}
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Advanced Filters Drawer */}
      {isFilterOpen && (
        <div className="bg-surface border border-mist p-6 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Active Month</label>
            <select 
              value={filters.month}
              onChange={(e) => setFilters({...filters, month: e.target.value})}
              className="w-full p-3 bg-light-grey rounded-lg text-xs font-bold text-dark border-none outline-none"
            >
              <option value="all">All Months</option>
              {options.months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Content Type</label>
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="w-full p-3 bg-light-grey rounded-lg text-xs font-bold text-dark border-none outline-none"
            >
              <option value="all">All Types</option>
              {options.types.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Strategy Theme</label>
            <select 
              value={filters.theme}
              onChange={(e) => setFilters({...filters, theme: e.target.value})}
              className="w-full p-3 bg-light-grey rounded-lg text-xs font-bold text-dark border-none outline-none"
            >
              <option value="all">All Themes</option>
              {options.themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Workflow Status</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full p-3 bg-light-grey rounded-lg text-xs font-bold text-dark border-none outline-none"
            >
              <option value="all">All Statuses</option>
              {options.statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPosts.map(post => (
          <div 
            key={post.id}
            onClick={() => onCardClick(post.id)}
            className="bg-surface border border-mist p-6 hover:border-cyan transition-all cursor-pointer group flex flex-col h-full relative hover:shadow-xl hover:shadow-cyan/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-widest text-dark uppercase">
                  {post.day}
                </span>
                <span className="text-xl font-display italic-serif text-ash/30">
                  {post.date ? new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'TBD'}
                </span>
              </div>
              <div className={`px-2 py-1 rounded text-[9px] uppercase font-bold tracking-widest ${getStatusColor(post.publishing_status)}`}>
                {post.publishing_status.replace('_', ' ')}
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-light-grey rounded text-ash">{getContentTypeIcon(post.content_type)}</span>
                <span className="text-[10px] font-black tracking-[0.2em] text-cyan uppercase">
                  {post.script?.script_code || (post.content_type === 'carousel' ? 'CAROUSEL' : post.content_type)}
                </span>
              </div>
              
              <h3 className="text-dark font-bold leading-tight group-hover:text-cyan transition-colors line-clamp-3">
                {post.title_or_hook || post.script?.title || 'Untitled Strategic Post'}
              </h3>
            </div>

            <div className="mt-6 pt-4 border-t border-mist/30 flex items-center justify-between">
              <div className="text-[9px] text-ash/40 uppercase tracking-widest font-black">
                ID: {post.post_number}
              </div>
              {post.cascade_parent_script_id && (
                <div className="flex items-center gap-1 text-[9px] text-cyan uppercase tracking-widest font-black">
                  <ChevronRight size={10} /> CASCADE
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-mist bg-light-grey/20 rounded-3xl">
            <CalendarIcon size={48} className="mx-auto text-ash/20 mb-4" />
            <p className="text-ash font-bold uppercase tracking-widest text-xs">No posts matching these parameters</p>
          </div>
        )}
      </div>
    </div>
  );
};
