// @ts-nocheck
import React from 'react';
import { useContentStore } from '../../hooks/useContentStore';
import { MoreHorizontal, Video, Image as ImageIcon, Edit3, MessageCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export const BoardView = ({ onCardClick, onAddNew }: any) => {
  const { calendarPosts, publishingFlow } = useContentStore();

  const getContentTypeIcon = (type: string) => {
    if (type === 'deep_reel') return <Video size={14} className="text-cyan" />;
    if (type === 'carousel') return <ImageIcon size={14} className="text-yellow-500" />;
    if (['fast_reel', 'mirror', 'question', 'contrast', 'frame'].includes(type)) return <Video size={14} className="text-yellow-500" />;
    return <Edit3 size={14} className="text-ash" />;
  };

  // Build the board columns from publishing flow
  // Default stages if none loaded:
  const stages = publishingFlow.length > 0 ? publishingFlow : [
    { stage_name: 'idea / script source' },
    { stage_name: 'script approved' },
    { stage_name: 'visual direction' },
    { stage_name: 'shoot / design / edit' },
    { stage_name: 'thumbnail / carousel asset' },
    { stage_name: 'caption' },
    { stage_name: 'internal review' },
    { stage_name: 'scheduled' },
    { stage_name: 'published' }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display text-dark italic-serif">Publishing Pipeline</h1>
          <p className="text-ash mt-1">Track content through the production lifecycle.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar flex gap-6 pb-8">
        {stages.map((stage: any) => {
          const columnPosts = calendarPosts.filter(p => (p.publishing_status || 'idea / script source') === stage.stage_name);
          
          return (
            <div key={stage.stage_name} className="flex-shrink-0 w-80 flex flex-col h-full bg-light-grey/50 rounded-xl border border-mist overflow-hidden">
              <div className="p-4 border-b border-mist bg-surface flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold uppercase tracking-widest text-xs text-dark">{stage.stage_name}</h3>
                  <span className="bg-mist text-ash text-[10px] px-2 py-0.5 rounded-full font-medium">
                    {columnPosts.length}
                  </span>
                </div>
                <button className="text-ash hover:text-cyan transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {columnPosts.map(post => (
                  <motion.div 
                    layoutId={post.id}
                    key={post.id}
                    onClick={() => onCardClick(post.id)}
                    className="bg-surface p-4 border border-mist shadow-sm hover:border-cyan hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getContentTypeIcon(post.content_type)}
                        <span className="text-[10px] font-bold tracking-wider text-ash uppercase">
                          {post.script?.script_code || post.content_type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-ash/60 uppercase font-bold tracking-wider">
                        #{post.post_number}
                      </span>
                    </div>

                    <h4 className="text-dark font-medium text-sm leading-snug group-hover:text-cyan transition-colors line-clamp-3">
                      {post.title_or_hook || post.script?.title || 'Untitled Post'}
                    </h4>

                    {post.date && (
                      <div className="mt-3 pt-3 border-t border-mist/50 flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-ash">
                        <span>{new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                        <span>{post.month}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
