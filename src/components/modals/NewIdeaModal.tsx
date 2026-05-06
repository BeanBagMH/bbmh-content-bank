import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import type { ContentColumn, ContentFormat, ContentStatus } from '../../types';

interface NewIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
}

export const NewIdeaModal: React.FC<NewIdeaModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    col: 'video' as ContentColumn,
    fmt: 'Deep Reel' as ContentFormat,
    cluster: '01',
    cname: 'Invisibility',
    status: 'Draft' as ContentStatus,
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    hasScript: false
  });

  const clusters = [
    { id: '01', name: 'Invisibility' },
    { id: '02', name: 'Trust Filter' },
    { id: '03', name: 'Scale Problem' },
    { id: '04', name: 'Second Gen' },
    { id: '05', name: 'Inconsistency' },
    { id: '06', name: 'Price War' },
    { id: '07', name: 'Export Filter' },
    { id: '08', name: 'Dead Website' },
    { id: '09', name: 'Referral Gap' },
    { id: '10', name: 'Revenue Link' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
    setFormData({ ...formData, title: '' }); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[300]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] bg-[#09090b] rounded-[48px] shadow-[0_0_100px_rgba(34,211,238,0.15)] z-[301] overflow-hidden border border-white/10"
          >
            <div className="p-10 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Sparkles size={80} className="text-cyan" />
               </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Create Strategy</h2>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Initializing new creative pillar</p>
              </div>
              <button onClick={onClose} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Primary Hook</label>
                <textarea 
                  autoFocus
                  required
                  rows={2}
                  className="w-full bg-white/5 border-2 border-white/10 rounded-3xl p-6 text-lg font-bold text-white focus:border-cyan outline-none transition-all placeholder:text-white/5 leading-snug"
                  placeholder="Capture the core insight or empathy gap..."
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Platform Column</label>
                  <div className="relative group">
                    <select 
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:border-cyan outline-none appearance-none cursor-pointer group-hover:bg-white/10 transition-all"
                      value={formData.col}
                      onChange={e => setFormData({ ...formData, col: e.target.value as ContentColumn })}
                    >
                      <option value="video">Video Library</option>
                      <option value="blog">Written Strategy</option>
                      <option value="social">Micro-Content</option>
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 rotate-90 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Content Format</label>
                  <div className="relative group">
                    <select 
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:border-cyan outline-none appearance-none cursor-pointer group-hover:bg-white/10 transition-all"
                      value={formData.fmt}
                      onChange={e => setFormData({ ...formData, fmt: e.target.value as ContentFormat })}
                    >
                      <option value="Deep Reel">Deep Reel</option>
                      <option value="Carousel">Carousel</option>
                      <option value="Wide Short">Wide Short</option>
                      <option value="Long Form">Long Form</option>
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 rotate-90 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Strategic Cluster</label>
                  <div className="relative group">
                    <select 
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:border-cyan outline-none appearance-none cursor-pointer group-hover:bg-white/10 transition-all"
                      value={formData.cluster}
                      onChange={e => {
                        const c = clusters.find(cl => cl.id === e.target.value);
                        setFormData({ ...formData, cluster: e.target.value, cname: c?.name || '' });
                      }}
                    >
                      {clusters.map(c => <option key={c.id} value={c.id}>{c.id} · {c.name}</option>)}
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 rotate-90 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Schedule Day</label>
                   <input 
                     type="number" 
                     className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:border-cyan outline-none"
                     value={formData.day}
                     onChange={e => setFormData({ ...formData, day: parseInt(e.target.value) })}
                   />
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-cyan text-dark rounded-3xl py-6 font-black uppercase tracking-[0.2em] hover:bg-cyan/90 transition-all shadow-2xl shadow-cyan/20 active:scale-[0.98]">
                  Initialize Protocol
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
