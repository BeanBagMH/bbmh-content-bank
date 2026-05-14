// @ts-nocheck
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, Send } from 'lucide-react';
import { useContentStore } from '../../hooks/useContentStore';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({ isOpen, onClose }) => {
  const { addCampaign } = useContentStore();
  const [formData, setFormData] = React.useState({
    name: '',
    objective: '',
    status: 'Planning',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    try {
      await addCampaign(formData);
      setFormData({
        name: '',
        objective: '',
        status: 'Planning',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        notes: ''
      });
      onClose();
      alert('Strategic cluster launched!');
    } catch (e: any) {
      console.error(e);
      alert(`Failed to launch cluster: ${e.message}`);
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
            <div className="p-8 border-b border-mist bg-light-grey/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flag size={20} className="text-cyan" />
                <h2 className="text-lg font-display font-bold text-dark">New Strategic Cluster</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-mist rounded-lg transition-all text-ash">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-ash uppercase tracking-widest">Cluster Name</label>
                  <input 
                    autoFocus
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Website Strategy Q3"
                    className="w-full text-xl font-bold text-dark border-none outline-none bg-transparent placeholder:text-ash/20"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-ash uppercase tracking-widest">Core Objective</label>
                  <textarea 
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    placeholder="What are we trying to achieve?"
                    className="w-full h-24 bg-light-grey/50 border border-mist/40 p-4 rounded-xl text-[14px] font-medium outline-none focus:border-cyan focus:bg-white transition-all resize-none"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-ash uppercase tracking-widest">Start Date</label>
                    <input 
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full bg-light-grey/50 border border-mist/40 p-3 rounded-xl text-[11px] font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-ash uppercase tracking-widest">End Date</label>
                    <input 
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full bg-light-grey/50 border border-mist/40 p-3 rounded-xl text-[11px] font-bold outline-none"
                    />
                  </div>
               </div>

               <button 
                 type="submit"
                 disabled={!formData.name}
                 className="w-full bg-dark text-white py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-cyan transition-all shadow-lg shadow-dark/10 disabled:opacity-20"
               >
                 <Send size={18} />
                 <span className="text-[11px] font-bold uppercase tracking-widest">Launch Cluster</span>
               </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
