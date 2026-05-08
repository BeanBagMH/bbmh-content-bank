import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Copy, 
  Archive, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Info,
  PenTool,
  Palette,
  Share2,
  BarChart3,
  CheckCircle2,
  Download
} from 'lucide-react';
import { useContentStore } from '../hooks/useContentStore';
import { cn } from './common/Badge';
import type { ContentItem, ContentStatus, ContentType, Priority, Platform, ContentCluster } from '../types';

interface DetailPanelProps {
  selectedId: string | null;
  onClose: () => void;
}

const TABS = [
  { id: 'info', label: 'Basics', icon: Info },
  { id: 'writing', label: 'Writing', icon: PenTool },
  { id: 'creative', label: 'Creative', icon: Palette },
  { id: 'publishing', label: 'Publishing', icon: Share2 },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
];

export const DetailPanel: React.FC<DetailPanelProps> = ({ selectedId, onClose }) => {
  const { items, campaigns, updateItem, deleteItem, duplicateItem } = useContentStore();
  const [activeTab, setActiveTab] = React.useState('info');
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  
  const originalItem = items.find(i => i.id === selectedId);
  const [localItem, setLocalItem] = React.useState<ContentItem | null>(null);
  
  React.useEffect(() => {
    if (originalItem) {
      setLocalItem({ ...originalItem });
      setHasChanges(false);
    }
  }, [originalItem, selectedId]);

  const handleLocalUpdate = (updates: Partial<ContentItem>) => {
    setLocalItem(prev => prev ? { ...prev, ...updates } : null);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!selectedId || !localItem) return;
    setIsSaving(true);
    try {
      await updateItem(selectedId, localItem);
      setHasChanges(false);
      setTimeout(() => setIsSaving(false), 500);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (confirm('Permanently delete this strategy?')) {
      await deleteItem(selectedId);
      onClose();
    }
  };

  const handleDuplicate = async () => {
    if (!originalItem) return;
    await duplicateItem(originalItem);
    onClose();
  };

  if (!selectedId || !localItem) return null;

  return (
    <AnimatePresence>
      {selectedId && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white border-l border-mist shadow-2xl z-30 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 lg:p-8 border-b border-mist flex items-center justify-between bg-light-grey/20">
            <div className="flex items-center gap-4">
               <button onClick={onClose} className="p-2 hover:bg-mist rounded-lg transition-all text-ash">
                 <X size={20} />
               </button>
               <div className="h-6 w-px bg-mist" />
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-ash/40">#{selectedId.slice(0, 8)}</span>
                  {hasChanges ? (
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-cyan text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-dark transition-all shadow-lg shadow-cyan/20 flex items-center gap-2"
                    >
                       {isSaving ? (
                         <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                       ) : (
                         <CheckCircle2 size={12} />
                       )}
                       {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-ash/40">
                       <CheckCircle2 size={12} />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Synced</span>
                    </div>
                  )}
               </div>
            </div>
            
            <div className="flex items-center gap-2">
               <ActionButton 
                 onClick={() => {
                   const text = `Strategy: ${localItem.title}\nStatus: ${localItem.status}\nHook: ${localItem.hook || 'No hook set'}\nView: ${window.location.href}`;
                   navigator.clipboard.writeText(text);
                   alert('Strategy summary copied to clipboard!');
                 }} 
                 icon={Share2} 
                 title="Share Strategy" 
               />
               <ActionButton onClick={handleDuplicate} icon={Copy} title="Duplicate" />
               <ActionButton onClick={() => updateItem(selectedId, { archived: true })} icon={Archive} title="Archive" />
               <ActionButton onClick={handleDelete} icon={Trash2} title="Delete" className="hover:text-red-500 hover:bg-red-50" />
            </div>
          </div>

          {/* Item Title Section */}
          <div className="p-8 lg:p-10 pb-0">
             <textarea 
               value={localItem.title || ''}
               onChange={(e) => handleLocalUpdate({ title: e.target.value })}
               placeholder="Piece Title..."
               className="w-full text-3xl lg:text-4xl font-display font-bold text-dark border-none outline-none bg-transparent resize-none leading-tight placeholder:text-ash/20"
               rows={2}
             />
          </div>

          {/* Tabs */}
          <div className="flex px-6 lg:px-10 border-b border-mist mt-6 overflow-x-auto custom-scrollbar-mini">
             {TABS.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={cn(
                   "flex items-center gap-3 py-4 px-6 border-b-2 transition-all group whitespace-nowrap",
                   activeTab === tab.id 
                    ? "border-dark text-dark" 
                    : "border-transparent text-ash/40 hover:text-ash hover:border-mist"
                 )}
               >
                 <tab.icon size={16} className={cn("transition-transform group-hover:scale-110", activeTab === tab.id ? "text-cyan" : "")} />
                 <span className="text-[11px] font-bold uppercase tracking-widest">{tab.label}</span>
               </button>
             ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-12 custom-scrollbar">
             {activeTab === 'info' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                  <PropertyField label="Status" value={localItem.status} onChange={(v) => handleLocalUpdate({ status: v as ContentStatus })} options={['Raw Idea', 'Selected', 'Research', 'Scripting', 'Design', 'Editing', 'Review', 'Scheduled', 'Published']} />
                  <PropertyField label="Type" value={localItem.content_type} onChange={(v) => handleLocalUpdate({ content_type: v as ContentType })} options={['Reel', 'Carousel', 'LinkedIn Post', 'Blog', 'YouTube Short', 'Instagram Post', 'Twitter/X Post', 'Case Study', 'Email', 'Ad Creative', 'Script']} />
                  <PropertyField label="Platform" value={localItem.platform} onChange={(v) => handleLocalUpdate({ platform: v as Platform })} options={['Instagram', 'LinkedIn', 'YouTube', 'Website Blog', 'Twitter/X', 'Email', 'Multi-platform']} />
                  <PropertyField label="Cluster" value={localItem.content_cluster} onChange={(v) => handleLocalUpdate({ content_cluster: v as ContentCluster })} options={['Brand Invisibility', 'Trust Building', 'Price War', 'Website Strategy', 'Branding', 'Design Education', 'AI Workflow', 'Client Case Study', 'Behind The Scenes', 'Founder Story', 'Sales / Outreach', 'General']} />
                  <PropertyField label="Priority" value={localItem.priority} onChange={(v) => handleLocalUpdate({ priority: v as Priority })} options={['Low', 'Medium', 'High', 'Urgent']} />
                  <PropertyField 
                    label="Campaign Cluster" 
                    value={localItem.campaign_id} 
                    onChange={(v) => handleLocalUpdate({ campaign_id: v })} 
                    options={campaigns.map((c: any) => ({ label: c.name, value: c.id }))} 
                  />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-ash uppercase tracking-widest">Publish Date</label>
                    <input 
                      type="date" 
                      value={localItem.publish_date || ''}
                      onChange={(e) => handleLocalUpdate({ publish_date: e.target.value })}
                      className="w-full bg-light-grey/50 border border-mist/40 p-4 rounded-xl text-[13px] font-bold outline-none focus:border-cyan focus:bg-white transition-all cursor-pointer [color-scheme:light]"
                    />
                  </div>
               </div>
             )}

             {activeTab === 'writing' && (
                <div className="space-y-10">
                   <div className="flex justify-end">
                      <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-6 py-3 bg-light-grey rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-dark hover:text-white transition-all shadow-sm"
                      >
                         <Download size={14} />
                         <span>Export as PDF</span>
                      </button>
                   </div>
                   <EditorSection label="Hook / Headline" value={localItem.hook} onChange={(v: string) => handleLocalUpdate({ hook: v })} placeholder="The opening signal..." />
                   <EditorSection label="Script / Body" value={localItem.script} onChange={(v: string) => handleLocalUpdate({ script: v })} placeholder="The core message..." minHeight="300px" />
                   <EditorSection label="Caption" value={localItem.caption} onChange={(v: string) => handleLocalUpdate({ caption: v })} placeholder="For the platforms..." />
                   <EditorSection label="Call to Action" value={localItem.cta} onChange={(v: string) => handleLocalUpdate({ cta: v })} placeholder="The strategic move..." />
                </div>
              )}

             {activeTab === 'creative' && (
               <div className="space-y-10">
                  <EditorSection label="Thumbnail Idea" value={localItem.thumbnail_idea} onChange={(v: string) => handleLocalUpdate({ thumbnail_idea: v })} placeholder="Visual concept..." />
                  <EditorSection label="Visual Direction" value={localItem.visual_direction} onChange={(v: string) => handleLocalUpdate({ visual_direction: v })} placeholder="Aesthetic notes..." />
                  
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-ash uppercase tracking-widest">Reference URL</label>
                      <div className="flex gap-4">
                        <input 
                          type="url" 
                          value={localItem.reference_url || ''}
                          onChange={(e) => handleLocalUpdate({ reference_url: e.target.value })}
                          placeholder="https://..."
                          className="flex-1 bg-light-grey/50 border border-mist/40 p-4 rounded-xl text-[13px] font-medium outline-none focus:border-cyan transition-all"
                        />
                        {localItem.reference_url && (
                          <a href={localItem.reference_url} target="_blank" rel="noopener noreferrer" className="p-4 bg-dark text-white rounded-xl hover:bg-cyan transition-all">
                             <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-ash uppercase tracking-widest">Asset Link</label>
                      <div className="flex gap-4">
                        <input 
                          type="url" 
                          value={localItem.asset_link || ''}
                          onChange={(e) => handleLocalUpdate({ asset_link: e.target.value })}
                          placeholder="https://framer.com/..."
                          className="flex-1 bg-light-grey/50 border border-mist/40 p-4 rounded-xl text-[13px] font-medium outline-none focus:border-cyan transition-all"
                        />
                        {localItem.asset_link && (
                          <a href={localItem.asset_link} target="_blank" rel="noopener noreferrer" className="p-4 bg-dark text-white rounded-xl hover:bg-cyan transition-all">
                             <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
               </div>
             )}

             {activeTab === 'publishing' && (
               <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-ash uppercase tracking-widest">Published URL</label>
                    <div className="flex gap-4">
                      <input 
                        type="url" 
                        value={localItem.published_url || ''}
                        onChange={(e) => handleLocalUpdate({ published_url: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 bg-light-grey/50 border border-mist/40 p-4 rounded-xl text-[13px] font-medium outline-none focus:border-cyan transition-all"
                      />
                      {localItem.published_url && (
                        <a href={localItem.published_url} target="_blank" rel="noopener noreferrer" className="p-4 bg-dark text-white rounded-xl hover:bg-cyan transition-all">
                           <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
               </div>
             )}

             {activeTab === 'performance' && (
               <div className="space-y-10">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                     <PerformanceInput label="Views" value={localItem.performance_stats?.views} onChange={(v: string) => handleLocalUpdate({ performance_stats: { ...localItem.performance_stats, views: parseInt(v) || 0 } })} />
                     <PerformanceInput label="Likes" value={localItem.performance_stats?.likes} onChange={(v: string) => handleLocalUpdate({ performance_stats: { ...localItem.performance_stats, likes: parseInt(v) || 0 } })} />
                     <PerformanceInput label="Comments" value={localItem.performance_stats?.comments} onChange={(v: string) => handleLocalUpdate({ performance_stats: { ...localItem.performance_stats, comments: parseInt(v) || 0 } })} />
                     <PerformanceInput label="Shares" value={localItem.performance_stats?.shares} onChange={(v: string) => handleLocalUpdate({ performance_stats: { ...localItem.performance_stats, shares: parseInt(v) || 0 } })} />
                     <PerformanceInput label="Saves" value={localItem.performance_stats?.saves} onChange={(v: string) => handleLocalUpdate({ performance_stats: { ...localItem.performance_stats, saves: parseInt(v) || 0 } })} />
                     <PerformanceInput label="Leads" value={localItem.performance_stats?.leads} onChange={(v: string) => handleLocalUpdate({ performance_stats: { ...localItem.performance_stats, leads: parseInt(v) || 0 } })} />
                  </div>
               </div>
             )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

const ActionButton = ({ onClick, icon: Icon, title, className }: any) => (
  <button 
    onClick={onClick}
    className={cn("p-2.5 hover:bg-mist rounded-lg transition-all text-ash/60 group", className)}
    title={title}
  >
    <Icon size={18} className="group-hover:scale-110 transition-transform" />
  </button>
);

const PropertyField = ({ label, value, onChange, options }: { label: string, value: any, onChange: (v: string) => void, options: (string | { label: string, value: string })[] }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-ash uppercase tracking-widest">{label}</label>
    <div className="relative group/select">
      <select 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-light-grey/50 border border-mist/40 p-4 rounded-xl text-[13px] font-bold outline-none focus:border-cyan appearance-none transition-all cursor-pointer"
      >
        <option value="">Select {label}</option>
        {options.map(opt => {
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const optValue = typeof opt === 'string' ? opt : opt.value;
          return <option key={optValue} value={optValue}>{optLabel}</option>;
        })}
      </select>
      <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-ash/30 group-hover/select:text-dark transition-all" />
    </div>
  </div>
);

const EditorSection = ({ label, value, onChange, placeholder, minHeight = "100px" }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black text-ash uppercase tracking-widest">{label}</label>
    <textarea 
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ minHeight }}
      className="w-full bg-light-grey/30 border-l-2 border-mist/40 p-6 text-[15px] font-medium leading-relaxed outline-none focus:border-cyan focus:bg-white transition-all resize-none placeholder:text-ash/20"
    />
  </div>
);

const PerformanceInput = ({ label, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-ash uppercase tracking-widest">{label}</label>
    <input 
      type="number" 
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0"
      className="w-full bg-light-grey/50 border border-mist/40 p-4 rounded-xl text-[13px] font-mono font-bold outline-none focus:border-cyan transition-all"
    />
  </div>
);
