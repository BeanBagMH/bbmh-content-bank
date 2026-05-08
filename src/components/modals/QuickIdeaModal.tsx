import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Send } from 'lucide-react';
import { useContentStore } from '../../hooks/useContentStore';
import { toast } from '../../hooks/useToast';
import type { Platform, ContentCluster } from '../../types';

interface QuickIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickIdeaModal: React.FC<QuickIdeaModalProps> = ({ isOpen, onClose }) => {
  const { addIdea } = useContentStore();
  const [title, setTitle] = React.useState('');
  const [note, setNote] = React.useState('');
  const [platform, setPlatform] = React.useState<Platform>('Instagram');
  const [cluster, setCluster] = React.useState<ContentCluster>('General');
  const [isSubmitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setSubmitting(true);
    try {
      await addIdea({
        title,
        note,
        platform,
        cluster,
        archived: false
      });
      setTitle('');
      setNote('');
      toast.success('Idea captured!');
      onClose();
    } catch (err: any) {
      toast.error(`Failed: ${err.message}`);
    } finally {
      setSubmitting(false);
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
            className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-mist flex items-center justify-between bg-yellow-50/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-white">
                   <Lightbulb size={20} />
                </div>
                <div>
                   <h2 className="text-xl font-display font-bold text-dark">Quick Idea</h2>
                   <p className="text-[10px] font-bold text-ash/40 uppercase tracking-widest">Capture the spark</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-mist rounded-lg transition-all text-ash">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-ash uppercase tracking-widest">The Concept</label>
                  <input 
                    autoFocus
                    required
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Briefly state the idea..."
                    className="w-full text-2xl font-display font-bold text-dark border-none outline-none bg-transparent placeholder:text-ash/10"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-ash uppercase tracking-widest">Extra Context</label>
                  <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add details, hook ideas, or references..."
                    className="w-full bg-light-grey/50 border border-mist/40 p-4 rounded-xl text-[13px] font-medium outline-none focus:border-yellow-400 focus:bg-white transition-all h-32 resize-none"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-ash uppercase tracking-widest">Platform</label>
                    <select 
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as Platform)}
                      className="w-full bg-light-grey/50 border border-mist/40 p-3 rounded-xl text-[11px] font-bold outline-none appearance-none"
                    >
                      {['Instagram', 'LinkedIn', 'YouTube', 'Twitter/X', 'Email'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-ash uppercase tracking-widest">Cluster</label>
                    <select 
                      value={cluster}
                      onChange={(e) => setCluster(e.target.value as ContentCluster)}
                      className="w-full bg-light-grey/50 border border-mist/40 p-3 rounded-xl text-[11px] font-bold outline-none appearance-none"
                    >
                      {['General', 'Strategy', 'Case Study', 'Behind Scenes'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
               </div>

               <button 
                 type="submit"
                 disabled={!title || isSubmitting}
                 className="w-full bg-dark text-white py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-yellow-600 transition-all shadow-lg shadow-dark/10 disabled:opacity-20"
               >
                 <Send size={18} />
                 <span className="text-[11px] font-bold uppercase tracking-widest">
                   {isSubmitting ? 'Saving Idea...' : 'Save to Vault'}
                 </span>
               </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
