// @ts-nocheck
import React, { useState } from 'react';
import { useContentStore } from '../../hooks/useContentStore';
import { Video, Search, Filter, Edit3, Image as ImageIcon } from 'lucide-react';

export const ContentBankView = ({ onCardClick }: any) => {
  const { scripts } = useContentStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredScripts = scripts.filter(s => {
    const matchesSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || (s.script_code && s.script_code.toLowerCase().includes(search.toLowerCase()));
    const matchesType = filterType === 'all' || s.content_type === filterType;
    return matchesSearch && matchesType;
  });

  const getContentTypeIcon = (type: string) => {
    if (type === 'deep_reel') return <Video size={14} className="text-cyan" />;
    if (type === 'carousel') return <ImageIcon size={14} className="text-yellow-500" />;
    if (['fast_reel', 'mirror', 'question', 'contrast', 'frame'].includes(type)) return <Video size={14} className="text-yellow-500" />;
    return <Edit3 size={14} className="text-ash" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-dark italic-serif">Script Bank</h1>
          <p className="text-ash mt-1">Master library of all approved hooks, insights, and structures.</p>
        </div>
        
        <div className="flex w-full lg:w-auto items-center gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
            <input 
              type="text" 
              placeholder="Search scripts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-mist pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan text-dark placeholder:text-ash/50"
            />
          </div>
          
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-surface border border-mist px-4 py-2 text-sm text-dark focus:outline-none focus:border-cyan"
          >
            <option value="all">All Formats</option>
            <option value="deep_reel">Deep Reels</option>
            <option value="mirror">The Mirror</option>
            <option value="question">The Question</option>
            <option value="contrast">The Contrast</option>
            <option value="frame">The Frame</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredScripts.map(script => (
          <div 
            key={script.id}
            onClick={() => onCardClick(script.id)}
            className="bg-surface border border-mist hover:border-cyan transition-all cursor-pointer group flex flex-col"
          >
            <div className="p-5 border-b border-mist/50 flex justify-between items-start">
              <div className="flex items-center gap-2">
                {getContentTypeIcon(script.content_type)}
                <span className="text-xs font-bold tracking-widest uppercase text-dark">
                  {script.script_code || script.content_type}
                </span>
              </div>
              {script.theme && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-light-grey text-ash">
                  {script.theme}
                </span>
              )}
            </div>
            
            <div className="p-5 flex-1">
              <h3 className="text-lg font-medium text-dark leading-tight group-hover:text-cyan transition-colors mb-3">
                {script.title}
              </h3>
              
              {script.hook && (
                <div className="mb-4">
                  <span className="text-[10px] font-bold tracking-widest text-ash uppercase mb-1 block">Hook</span>
                  <p className="text-sm text-dark/80 italic font-serif">"{script.hook}"</p>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {filteredScripts.length === 0 && (
          <div className="col-span-full py-12 text-center text-ash bg-surface border border-mist border-dashed">
            No scripts found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};
