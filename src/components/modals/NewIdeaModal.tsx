import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
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
    setFormData({ ...formData, title: '' }); // Reset
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
            className="fixed inset-0 bg-dark/60 backdrop-blur-md z-[300]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-[40px] shadow-2xl z-[301] overflow-hidden"
          >
            <div className="p-8 border-b border-border flex items-center justify-between bg-background/50">
              <h2 className="text-xl font-black text-dark uppercase tracking-tight">New Creative Idea</h2>
              <button onClick={onClose} className="p-2 hover:bg-dark/5 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Hook / Title</label>
                <input 
                  autoFocus
                  required
                  className="w-full bg-background border-2 border-border rounded-2xl p-4 text-sm font-bold focus:border-cyan outline-none transition-all"
                  placeholder="e.g., Your website is losing you money..."
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Column</label>
                  <select 
                    className="w-full bg-background border-2 border-border rounded-2xl p-4 text-sm font-bold focus:border-cyan outline-none appearance-none cursor-pointer"
                    value={formData.col}
                    onChange={e => setFormData({ ...formData, col: e.target.value as ContentColumn })}
                  >
                    <option value="video">Video Ideas</option>
                    <option value="blog">Blog Posts</option>
                    <option value="social">Social Media</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Format</label>
                  <select 
                    className="w-full bg-background border-2 border-border rounded-2xl p-4 text-sm font-bold focus:border-cyan outline-none appearance-none cursor-pointer"
                    value={formData.fmt}
                    onChange={e => setFormData({ ...formData, fmt: e.target.value as ContentFormat })}
                  >
                    <option value="Deep Reel">Deep Reel</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Wide Short">Wide Short</option>
                    <option value="Long Form">Long Form</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Strategic Cluster</label>
                <select 
                  className="w-full bg-background border-2 border-border rounded-2xl p-4 text-sm font-bold focus:border-cyan outline-none appearance-none cursor-pointer"
                  value={formData.cluster}
                  onChange={e => {
                    const c = clusters.find(cl => cl.id === e.target.value);
                    setFormData({ ...formData, cluster: e.target.value, cname: c?.name || '' });
                  }}
                >
                  {clusters.map(c => <option key={c.id} value={c.id}>{c.id} · {c.name}</option>)}
                </select>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-dark text-white rounded-2xl py-4 font-black uppercase tracking-widest hover:bg-cyan transition-all shadow-lg active:scale-[0.98]">
                  Initialize Idea
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
