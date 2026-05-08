import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles } from 'lucide-react';
import { useContentStore } from '../../hooks/useContentStore';
import type { ContentType, Platform, ContentCluster, Priority, ContentStatus } from '../../types';

interface NewContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewContentModal: React.FC<NewContentModalProps> = ({ isOpen, onClose }) => {
  const { addItem } = useContentStore();
  const [formData, setFormData] = React.useState({
    title: '',
    content_type: 'Reel' as ContentType,
    platform: 'Instagram' as Platform,
    content_cluster: 'General' as ContentCluster,
    status: 'Raw Idea' as ContentStatus,
    priority: 'Medium' as Priority,
    publish_date: '',
    hook: '',
    script: '',
    caption: '',
    thumbnail_idea: '',
    notes: '',
    reference_url: '',
    asset_link: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    
    try {
      const { reference_url, asset_link, ...rest } = formData;
      await addItem({ 
        ...rest, 
        reference_links: reference_url ? [reference_url] : [],
        asset_links: asset_link ? [asset_link] : []
      });
      onClose();
      setFormData({
        title: '',
        content_type: 'Reel',
        platform: 'Instagram',
        content_cluster: 'General',
        status: 'Raw Idea',
        priority: 'Medium',
        publish_date: '',
        hook: '',
        script: '',
        caption: '',
        thumbnail_idea: '',
        notes: '',
        reference_url: '',
        asset_link: ''
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-mist flex items-center justify-between bg-light-grey/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-dark rounded-xl flex items-center justify-center text-turquoise">
                   <Sparkles size={20} />
                </div>
                <div>
                   <h2 className="text-xl font-display font-bold text-dark">Create Strategic Piece</h2>
                   <p className="text-[10px] font-bold text-ash/40 uppercase tracking-[0.2em]">New Content Item</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-mist rounded-lg transition-all text-ash">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 custom-scrollbar">
               <div className="space-y-12">
                  {/* Title */}
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-ash uppercase tracking-widest">Strategy Title</label>
                     <input 
                       autoFocus
                       required
                       type="text" 
                       value={formData.title}
                       onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                       placeholder="e.g. Why Your Website Is A Ghost Town"
                       className="w-full text-3xl font-display font-bold text-dark border-none outline-none bg-transparent placeholder:text-ash/10"
                     />
                  </div>

                  {/* Properties Grid */}
                  <div className="grid grid-cols-3 gap-8">
                     <SelectField 
                        label="Content Type" 
                        value={formData.content_type} 
                        options={['Reel', 'Carousel', 'LinkedIn Post', 'Blog', 'YouTube Short', 'Instagram Post', 'Twitter/X Post', 'Case Study', 'Email', 'Ad Creative', 'Script']} 
                        onChange={(v: string) => setFormData({ ...formData, content_type: v as ContentType })} 
                     />
                     <SelectField 
                        label="Primary Platform" 
                        value={formData.platform} 
                        options={['Instagram', 'LinkedIn', 'YouTube', 'Website Blog', 'Twitter/X', 'Email', 'Multi-platform']} 
                        onChange={(v: string) => setFormData({ ...formData, platform: v as Platform })} 
                     />
                     <SelectField 
                        label="Content Cluster" 
                        value={formData.content_cluster} 
                        options={['Brand Invisibility', 'Trust Building', 'Price War', 'Website Strategy', 'Branding', 'Design Education', 'AI Workflow', 'Client Case Study', 'Behind The Scenes', 'Founder Story', 'Sales / Outreach', 'General']} 
                        onChange={(v: string) => setFormData({ ...formData, content_cluster: v as ContentCluster })} 
                     />
                     <SelectField 
                        label="Initial Status" 
                        value={formData.status} 
                        options={['Raw Idea', 'Selected', 'Research', 'Scripting', 'Design', 'Editing', 'Review', 'Scheduled', 'Published']} 
                        onChange={(v: string) => setFormData({ ...formData, status: v as ContentStatus })} 
                     />
                     <SelectField 
                        label="Priority" 
                        value={formData.priority} 
                        options={['Low', 'Medium', 'High', 'Urgent']} 
                        onChange={(v: string) => setFormData({ ...formData, priority: v as Priority })} 
                     />
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-ash uppercase tracking-widest">Publish Date</label>
                        <div className="relative group">
                          <input 
                            type="date" 
                            id="date-picker-main"
                            value={formData.publish_date}
                            onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                            className="w-full bg-light-grey/50 border border-mist/40 p-4 rounded-xl text-[13px] font-bold outline-none focus:border-cyan focus:bg-white transition-all cursor-pointer [color-scheme:light] relative z-10"
                          />
                        </div>
                     </div>
                  </div>

                  {/* Links Section */}
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-mist/30">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-ash uppercase tracking-widest">Reference URL</label>
                        <input 
                          type="url" 
                          value={formData.reference_url}
                          onChange={(e) => setFormData({ ...formData, reference_url: e.target.value })}
                          placeholder="https://inspiration.com/..."
                          className="w-full bg-light-grey/50 border border-mist/40 p-4 rounded-xl text-[13px] font-bold outline-none focus:border-cyan focus:bg-white transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-ash uppercase tracking-widest">Asset Link (Framer/Canva)</label>
                        <input 
                          type="url" 
                          value={formData.asset_link}
                          onChange={(e) => setFormData({ ...formData, asset_link: e.target.value })}
                          placeholder="https://framer.com/projects/..."
                          className="w-full bg-light-grey/50 border border-mist/40 p-4 rounded-xl text-[13px] font-bold outline-none focus:border-cyan focus:bg-white transition-all"
                        />
                     </div>
                  </div>

                  {/* Writing Area */}
                  <div className="space-y-8 pt-8 border-t border-mist">
                     <div className="grid grid-cols-2 gap-8">
                        <TextAreaField label="The Hook" value={formData.hook} onChange={(v: string) => setFormData({ ...formData, hook: v })} placeholder="Stop them in their tracks..." />
                        <TextAreaField label="Thumbnail Concept" value={formData.thumbnail_idea} onChange={(v: string) => setFormData({ ...formData, thumbnail_idea: v })} placeholder="Visual hook..." />
                     </div>
                     <TextAreaField label="Initial Script / Outline" value={formData.script} onChange={(v: string) => setFormData({ ...formData, script: v })} placeholder="Download the brain..." minHeight="200px" />
                  </div>
               </div>
            </form>

            {/* Footer */}
            <div className="p-8 border-t border-mist bg-light-grey/20 flex justify-end gap-4">
               <button 
                 type="button"
                 onClick={onClose}
                 className="px-8 py-4 text-[11px] font-bold text-ash uppercase tracking-widest hover:text-dark transition-all"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleSubmit}
                 disabled={!formData.title}
                 className="bg-dark text-white px-12 py-4 rounded-xl flex items-center gap-3 hover:bg-cyan transition-all shadow-lg shadow-dark/10 disabled:opacity-20 disabled:cursor-not-allowed"
               >
                 <Plus size={18} />
                 <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Deploy Strategy</span>
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SelectField = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-ash uppercase tracking-widest">{label}</label>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-light-grey/50 border border-mist/40 p-4 rounded-xl text-[13px] font-bold outline-none focus:border-cyan appearance-none transition-all cursor-pointer"
    >
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, minHeight = "100px" }: { label: string, value: string | null, onChange: (v: string) => void, placeholder: string, minHeight?: string }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-ash uppercase tracking-widest">{label}</label>
    <textarea 
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ minHeight }}
      className="w-full bg-light-grey/30 border border-mist/40 p-5 rounded-xl text-[14px] font-medium outline-none focus:border-cyan focus:bg-white transition-all resize-none placeholder:text-ash/20"
    />
  </div>
);
