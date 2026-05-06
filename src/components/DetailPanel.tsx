import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Trash2, Edit3, Save, X } from 'lucide-react';
import type { ContentItem, ContentStatus, ContentColumn } from '../types';
import { SCRIPTS } from '../data/mockData';
import { Badge } from './common/Badge';

interface DetailPanelProps {
  selectedId: number | null;
  items: ContentItem[];
  onClose: () => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<ContentItem>) => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ selectedId, items, onClose, onDelete, onUpdate }) => {
  const item = items.find(d => d.id === selectedId);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ContentItem>>({});

  useEffect(() => {
    if (item) {
      setEditData(item);
      setIsEditing(false);
    }
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    onUpdate(item.id, editData);
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      {selectedId && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-screen w-[650px] bg-[#09090b] z-[201] shadow-2xl flex flex-col border-l border-white/10"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#09090b]/80 backdrop-blur-xl z-10">
              <div className="flex items-center gap-6">
                <button 
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center hover:border-cyan text-white/20 hover:text-cyan transition-all active:scale-90 bg-white/5"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 mb-1">
                    Management &rsaquo; <span className="text-cyan">Strategy Detail</span>
                  </div>
                  <div className="text-white/40 text-[11px] font-bold">UID: BBMH-{item.id.toString().padStart(4, '0')}</div>
                </div>
              </div>
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan text-dark font-black text-xs uppercase tracking-widest shadow-2xl shadow-cyan/20 transition-all hover:scale-105"
                    >
                      <Save size={16} /> Save Changes
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-white/20 hover:text-white transition-all bg-white/5"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center hover:border-cyan text-white/20 hover:text-cyan transition-all bg-white/5"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button 
                      onClick={() => { if(confirm('Permanently delete this strategy?')) { onDelete(item.id); onClose(); } }}
                      className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center hover:border-red-500 text-white/20 hover:text-red-500 transition-all bg-white/5"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12 pb-32">
              {/* Cover Gradient */}
              <div className="h-32 bg-gradient-to-r from-cyan/20 via-turq/20 to-red/20 rounded-[32px] border border-white/5 shadow-inner" />
              
              {/* Title Section */}
              <div className="space-y-4">
                {isEditing ? (
                  <textarea 
                    className="w-full bg-white/5 border-2 border-white/10 rounded-3xl p-6 text-3xl font-black text-white focus:border-cyan outline-none transition-all leading-tight"
                    value={editData.title || ''}
                    onChange={e => setEditData({ ...editData, title: e.target.value })}
                  />
                ) : (
                  <h1 className="font-display text-5xl text-white leading-[1.05] font-black tracking-tight drop-shadow-2xl">
                    {item.title}
                  </h1>
                )}
              </div>
              
              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-8 p-8 bg-white/[0.02] rounded-[32px] border border-white/5 shadow-2xl">
                <EditableField 
                  label="Strategic Cluster" 
                  value={item.cluster + ' · ' + item.cname} 
                  isEditing={isEditing}
                  editNode={
                    <select 
                      className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-none"
                      value={editData.cluster}
                      onChange={e => setEditData({ ...editData, cluster: e.target.value })}
                    >
                      <option value="01">01 · Invisibility</option>
                      <option value="02">02 · Trust Filter</option>
                      <option value="03">03 · Scale Problem</option>
                      <option value="04">04 · Second Gen</option>
                      <option value="05">05 · Inconsistency</option>
                      <option value="06">06 · Price War</option>
                      <option value="07">07 · Export Filter</option>
                      <option value="08">08 · Dead Website</option>
                      <option value="09">09 · Referral Gap</option>
                      <option value="10">10 · Revenue Link</option>
                    </select>
                  }
                />
                <EditableField 
                  label="Content Column" 
                  value={item.col} 
                  isEditing={isEditing}
                  badge
                  editNode={
                    <select 
                      className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-none"
                      value={editData.col}
                      onChange={e => setEditData({ ...editData, col: e.target.value as ContentColumn })}
                    >
                      <option value="video">Video Library</option>
                      <option value="blog">Written Strategy</option>
                      <option value="social">Micro-Content</option>
                    </select>
                  }
                />
                <EditableField 
                  label="Workflow Status" 
                  value={item.status} 
                  isEditing={isEditing}
                  badge
                  editNode={
                    <select 
                      className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-none"
                      value={editData.status}
                      onChange={e => setEditData({ ...editData, status: e.target.value as ContentStatus })}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Script Ready">Script Ready</option>
                    </select>
                  }
                />
                <EditableField 
                  label="Deployment Date" 
                  value={item.day ? `${item.day} May, ${item.year}` : "Unscheduled"} 
                  isEditing={isEditing}
                  editNode={
                    <div className="flex gap-2">
                       <input 
                         type="number" 
                         className="w-20 bg-white/10 border border-white/10 rounded-xl p-3 text-sm font-bold text-white"
                         value={editData.day}
                         onChange={e => setEditData({ ...editData, day: parseInt(e.target.value) })}
                       />
                       <input 
                         type="number" 
                         className="w-24 bg-white/10 border border-white/10 rounded-xl p-3 text-sm font-bold text-white"
                         value={editData.year}
                         onChange={e => setEditData({ ...editData, year: parseInt(e.target.value) })}
                       />
                    </div>
                  }
                />
              </div>

              {/* Script Section */}
              <div className="space-y-12">
                <div className="flex items-center gap-4">
                   <div className="h-px flex-1 bg-white/5" />
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Creative Script</div>
                   <div className="h-px flex-1 bg-white/5" />
                </div>

                {item.hasScript && SCRIPTS[item.id] ? (
                  <div className="space-y-16">
                    <ScriptSection label="Hook" timing="0 – 3s" text={SCRIPTS[item.id].hook} />
                    <ScriptSection label="The Insight" timing="10 – 35s" text={SCRIPTS[item.id].insight} />
                    <ScriptSection label="New World" timing="50 – 58s" text={SCRIPTS[item.id].newworld} />
                    
                    <div className="bg-cyan/[0.03] rounded-[40px] p-10 border border-cyan/10 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Clock size={120} />
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan mb-6 flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-cyan" />
                         Director's Protocol
                      </div>
                      <div className="text-[16px] text-white/70 leading-relaxed italic font-medium relative z-10">
                        {SCRIPTS[item.id].director}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/[0.02] rounded-[40px] p-16 text-center space-y-6 border border-white/5 border-dashed">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-white/5">
                      <Clock size={40} className="text-white/10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">Strategy Pending</h3>
                      <p className="text-xs text-white/20 leading-relaxed font-bold max-w-[320px] mx-auto">
                        This content piece is awaiting script injection. Use the strategic pillars to generate high-conversion hooks.
                      </p>
                    </div>
                    <button className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                       Initialize Generator
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const EditableField = ({ label, value, isEditing, badge, editNode }: { label: string, value: string, isEditing: boolean, badge?: boolean, editNode: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">{label}</div>
    {isEditing ? editNode : (
      badge ? <Badge variant={value}>{value}</Badge> : <div className="text-[14px] font-black text-white ml-1">{value}</div>
    )}
  </div>
);

const ScriptSection = ({ label, timing, text }: { label: string, timing: string, text: string }) => (
  <div className="space-y-6 relative pl-8 border-l-2 border-white/5 hover:border-cyan/30 transition-colors group">
    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#09090b] border-2 border-white/5 group-hover:border-cyan/50 transition-colors" />
    <div className="flex items-center justify-between">
      <div className="text-[11px] font-black uppercase tracking-[0.25em] text-cyan">{label}</div>
      <div className="text-[9px] text-white/20 font-black tracking-widest bg-white/5 px-3 py-1 rounded-full">{timing}</div>
    </div>
    <p className="text-[18px] text-white/80 leading-[1.7] font-semibold tracking-tight">{text}</p>
  </div>
);
