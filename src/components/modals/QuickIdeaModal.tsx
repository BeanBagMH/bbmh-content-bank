import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Send } from 'lucide-react';
import { useContentStore } from '../../hooks/useContentStore';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    try {
      await addIdea({
        title,
        note,
        platform: platform || 'Multi-platform',
        cluster: cluster || 'General',
        archived: false
      });
      setTitle('');
      setNote('');
      onClose();
      alert('Idea saved to vault!');
    } catch (e: any) {
      console.error(e);
      alert(`Failed to save idea: ${e.message}`);
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-mist bg-yellow-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lightbulb size={20} className="text-yellow-500" />
                <h2 className="text-lg font-display font-bold text-dark">Quick Brain Dump</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-mist rounded-lg transition-all text-ash">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-ash uppercase tracking-widest">The Core Idea</label>
                  <input 
                    autoFocus
                    required
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Briefly describe the spark..."
                    className="w-full text-xl font-bold text-dark border-none outline-none bg-transparent placeholder:text-ash/20"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-ash uppercase tracking-widest">Rough Notes</label>
                  <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any quick details or context..."
                    className="w-full h-32 bg-light-grey/50 border border-mist/40 p-4 rounded-xl text-[14px] font-medium outline-none focus:border-yellow-500 focus:bg-white transition-all resize-none"
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
                 disabled={!title}
                 className="w-full bg-dark text-white py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-yellow-600 transition-all shadow-lg shadow-dark/10 disabled:opacity-20"
               >
                 <Send size={18} />
                 <span className="text-[11px] font-bold uppercase tracking-widest">Save to Vault</span>
               </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
