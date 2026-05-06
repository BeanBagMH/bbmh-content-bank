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
            className="fixed inset-0 bg-[#fcfaf9]/95 backdrop-blur-md z-[300]"
          />
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] bg-[#fcfaf9] z-[301] border border-mist shadow-[0_40px_80px_rgba(0,0,0,0.05)]"
          >
            <div className="px-12 py-10 border-b border-mist flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-display italic text-graphite">Initialize Strategy</h2>
                <p className="text-ash/40 text-[9px] font-bold uppercase tracking-[0.3em]">Creating New Creative Pillar</p>
              </div>
              <button onClick={onClose} className="text-ash/40 hover:text-magenta transition-all"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-12 space-y-12">
              <div className="space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-ash/40">Primary Hook</label>
                <textarea 
                  autoFocus
                  required
                  rows={2}
                  className="w-full bg-transparent border-b-2 border-mist py-4 text-2xl font-display italic text-graphite focus:border-magenta outline-none transition-all placeholder:text-ash/20"
                  placeholder="Capture the core insight..."
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-ash/40">Editorial Column</label>
                  <select 
                    className="w-full bg-transparent border-b border-mist py-2 text-sm font-medium text-graphite outline-none focus:border-magenta"
                    value={formData.col}
                    onChange={e => setFormData({ ...formData, col: e.target.value as ContentColumn })}
                  >
                    <option value="video">Video Production</option>
                    <option value="blog">Strategic Writing</option>
                    <option value="social">Micro-Content</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-ash/40">Content Format</label>
                  <select 
                    className="w-full bg-transparent border-b border-mist py-2 text-sm font-medium text-graphite outline-none focus:border-magenta"
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

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-ash/40">Strategic Cluster</label>
                  <select 
                    className="w-full bg-transparent border-b border-mist py-2 text-sm font-medium text-graphite outline-none focus:border-magenta"
                    value={formData.cluster}
                    onChange={e => {
                      const c = clusters.find(cl => cl.id === e.target.value);
                      setFormData({ ...formData, cluster: e.target.value, cname: c?.name || '' });
                    }}
                  >
                    {clusters.map(c => <option key={c.id} value={c.id}>{c.id} · {c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                   <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-ash/40">Roadmap Day</label>
                   <input 
                     type="number" 
                     className="w-full bg-transparent border-b border-mist py-2 text-sm font-medium text-graphite outline-none focus:border-magenta"
                     value={formData.day}
                     onChange={e => setFormData({ ...formData, day: parseInt(e.target.value) })}
                   />
                </div>
              </div>

              <div className="pt-8">
                <button type="submit" className="btn-editorial w-full justify-center py-6 text-[11px]">
                  Commit Strategy to Archive
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
