// @ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Copy, Archive, Trash2, ChevronRight, Info, PenTool, Palette, Share2, BarChart3, CheckCircle2, Download, FileText, Calendar, Link as LinkIcon
} from 'lucide-react';
import { useContentStore } from '../hooks/useContentStore';
import { cn } from './common/Badge';
import { toast } from '../hooks/useToast';

const TABS = [
  { id: 'info', label: 'Strategy', icon: Info },
  { id: 'writing', label: 'Script', icon: PenTool },
  { id: 'visual', label: 'Visuals', icon: Palette },
  { id: 'publishing', label: 'Platform', icon: Share2 },
];

export const DetailPanel = ({ selectedId, onClose, initialTab = 'info' }) => {
  const { scripts, calendarPosts, updateScript, updateCalendarPost } = useContentStore();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Identify what we are looking at
  const data = useMemo(() => {
    if (!selectedId) return null;
    
    // Check if it's a script
    const script = scripts.find(s => s.id === selectedId);
    if (script) return { type: 'script', item: script };
    
    // Check if it's a calendar post
    const post = calendarPosts.find(p => p.id === selectedId);
    if (post) return { type: 'post', item: post, script: post.script };
    
    return null;
  }, [selectedId, scripts, calendarPosts]);

  const [localItem, setLocalItem] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setLocalItem(data.item);
      setHasChanges(false);
    }
  }, [data]);

  if (!selectedId || !data || !localItem) return null;

  const handleUpdate = (updates) => {
    setLocalItem(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      if (data.type === 'script') {
        await updateScript(localItem.id, localItem);
      } else {
        await updateCalendarPost(localItem.id, localItem);
      }
      setHasChanges(false);
      toast.success('Strategic update saved');
    } catch (err) {
      toast.error('Save failed');
    }
  };

  const isPost = data.type === 'post';
  const scriptToView = isPost ? data.script : localItem;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white border-l border-mist shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-mist flex items-center justify-between sticky top-0 z-10 bg-white">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 -ml-2 text-ash hover:text-dark">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-ash/40 uppercase tracking-widest">
                {isPost ? 'Calendar Post' : 'Master Script'}
              </span>
              <span className="text-[10px] font-mono text-cyan">#{selectedId.slice(0, 8)}</span>
            </div>
          </div>
          
          {hasChanges && (
            <button 
              onClick={handleSave}
              className="bg-cyan text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-dark transition-all shadow-lg shadow-cyan/20 flex items-center gap-2"
            >
              <CheckCircle2 size={12} />
              Save Changes
            </button>
          )}
        </div>

        {/* Title Section */}
        <div className="p-8 lg:p-10 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-cyan text-[10px] font-black tracking-[0.2em] uppercase">
              {scriptToView?.script_code || 'PRO-V4'}
            </span>
            {isPost && (
              <span className="text-ash/40 text-[10px] font-black uppercase tracking-widest">
                • Post #{localItem.post_number}
              </span>
            )}
          </div>
          <h2 className="text-3xl font-display font-bold text-dark italic-serif leading-tight">
            {isPost ? (localItem.title_or_hook || scriptToView?.title) : localItem.title}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-mist overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 py-4 px-6 border-b-2 transition-all whitespace-nowrap",
                activeTab === tab.id ? "border-dark text-dark" : "border-transparent text-ash/40 hover:text-ash"
              )}
            >
              <tab.icon size={14} className={activeTab === tab.id ? "text-cyan" : ""} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-12 custom-scrollbar">
          {activeTab === 'info' && (
            <div className="space-y-8">
              {isPost && (
                <div className="grid grid-cols-2 gap-6 bg-light-grey/30 p-6 border border-mist rounded-2xl">
                  <DetailField label="Scheduled Date" value={localItem.date} />
                  <DetailField label="Status" value={localItem.publishing_status} />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-8">
                <DetailField label="Content Format" value={localItem.content_type || scriptToView?.content_type} />
                <DetailField label="Strategy Theme" value={scriptToView?.theme || localItem.theme} />
                <DetailField label="Pillar" value={scriptToView?.pillar} />
                <DetailField label="Category" value={scriptToView?.category} />
              </div>

              {scriptToView?.hook && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Master Hook</label>
                  <p className="text-lg font-serif italic text-dark leading-relaxed">"{scriptToView.hook}"</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'writing' && (
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Full Script Body</label>
                <div className="bg-light-grey/30 p-8 rounded-2xl border-l-4 border-cyan font-serif text-lg leading-relaxed text-dark whitespace-pre-wrap">
                  {scriptToView?.script_body || "No script content found for this ID."}
                </div>
              </div>
              
              {scriptToView?.caption_notes && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Instagram Caption</label>
                  <div className="bg-surface p-6 border border-mist rounded-xl text-sm text-ash leading-relaxed whitespace-pre-wrap">
                    {scriptToView.caption_notes}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'visual' && (
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Visual Direction</label>
                <p className="text-dark font-medium leading-relaxed italic">
                  {scriptToView?.visual_direction || "Refer to master strategy for visual cues."}
                </p>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">Thumbnail Headline</label>
                <div className="text-2xl font-display font-bold text-dark p-6 bg-light-grey rounded-2xl border border-mist flex items-center justify-center text-center">
                  {scriptToView?.thumbnail_headline || "NO HEADLINE SET"}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'publishing' && (
            <div className="space-y-8">
              <p className="text-ash text-sm italic">Platform specific push parameters and status tracking.</p>
              <div className="space-y-4 p-6 border border-mist bg-surface rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-ash uppercase">Performance Tracking</span>
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[9px] font-bold uppercase">Active</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-mist bg-light-grey/20 flex gap-4">
          <button className="flex-1 py-4 bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan transition-all flex items-center justify-center gap-2">
            <Download size={14} /> Export Script
          </button>
          <button className="flex-1 py-4 border border-mist bg-white text-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-light-grey transition-all flex items-center justify-center gap-2">
            <Copy size={14} /> Copy Hook
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

const DetailField = ({ label, value }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-ash/40 uppercase tracking-widest">{label}</label>
    <div className="text-sm font-bold text-dark">{value || 'N/A'}</div>
  </div>
);
