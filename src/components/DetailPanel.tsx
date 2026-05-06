import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Edit3, Save, X } from 'lucide-react';
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
            className="fixed inset-0 bg-[#fcfaf9]/90 backdrop-blur-sm z-[200]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 40, stiffness: 400 }}
            className="fixed top-0 right-0 h-screen w-[700px] bg-[#fcfaf9] z-[201] shadow-[-20px_0_60px_rgba(0,0,0,0.02)] flex flex-col border-l border-mist"
          >
            {/* Header */}
            <div className="px-16 py-12 border-b border-mist flex items-center justify-between sticky top-0 bg-[#fcfaf9] z-10">
              <div className="flex items-center gap-10">
                <button 
                  onClick={onClose}
                  className="text-ash/40 hover:text-magenta transition-all active:scale-90"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="space-y-1">
                  <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-ash/60">
                    Piece <span className="text-magenta">N°{item.id.toString().padStart(4, '0')}</span>
                  </div>
                  <div className="text-ash/30 text-[10px] font-mono uppercase tracking-tighter">Cluster Protocol Active</div>
                </div>
              </div>
              <div className="flex gap-6">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSave}
                      className="text-[10px] font-bold text-magenta uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-all"
                    >
                      <Save size={14} /> Commit Changes
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="text-ash/40 hover:text-graphite transition-all"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-ash/40 hover:text-magenta transition-all"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button 
                      onClick={() => { if(confirm('Permanently discard this strategy?')) { onDelete(item.id); onClose(); } }}
                      className="text-ash/40 hover:text-magenta transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-20 py-24 custom-scrollbar space-y-24 pb-48">
              {/* Title Section */}
              <div className="space-y-8">
                {isEditing ? (
                  <textarea 
                    className="w-full bg-transparent border-b-2 border-mist text-4xl font-display italic text-graphite focus:border-magenta outline-none transition-all leading-tight py-4"
                    value={editData.title || ''}
                    onChange={e => setEditData({ ...editData, title: e.target.value })}
                  />
                ) : (
                  <h1 className="text-6xl font-display text-graphite leading-[1.05] italic tracking-tight">
                    {item.title}
                  </h1>
                )}
              </div>
              
              {/* Meta Table */}
              <div className="grid grid-cols-2 gap-x-20 gap-y-16 py-12 border-t border-b border-mist">
                <EditableField 
                  label="Strategic Cluster" 
                  value={item.cluster + ' · ' + item.cname} 
                  isEditing={isEditing}
                  editNode={
                    <select 
                      className="w-full bg-transparent border-b border-mist py-2 text-sm font-medium text-graphite outline-none focus:border-magenta"
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
                      className="w-full bg-transparent border-b border-mist py-2 text-sm font-medium text-graphite outline-none focus:border-magenta"
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
                      className="w-full bg-transparent border-b border-mist py-2 text-sm font-medium text-graphite outline-none focus:border-magenta"
                      value={editData.status}
                      onChange={e => setEditData({ ...editData, status: e.target.value as ContentStatus })}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Script Ready">Script Ready</option>
                    </select>
                  }
                />
                <EditableField 
                  label="Deployment Roadmap" 
                  value={item.day ? `${item.day} May, ${item.year}` : "Unscheduled"} 
                  isEditing={isEditing}
                  editNode={
                    <div className="flex gap-4">
                       <input 
                         type="number" 
                         className="w-16 bg-transparent border-b border-mist py-2 text-sm font-medium text-graphite outline-none focus:border-magenta"
                         value={editData.day}
                         onChange={e => setEditData({ ...editData, day: parseInt(e.target.value) })}
                       />
                       <input 
                         type="number" 
                         className="w-24 bg-transparent border-b border-mist py-2 text-sm font-medium text-graphite outline-none focus:border-magenta"
                         value={editData.year}
                         onChange={e => setEditData({ ...editData, year: parseInt(e.target.value) })}
                       />
                    </div>
                  }
                />
              </div>

              {/* Script Content */}
              <div className="space-y-24">
                {item.hasScript && SCRIPTS[item.id] ? (
                  <div className="space-y-32">
                    <ScriptSection label="The Hook" timing="00:03" text={SCRIPTS[item.id].hook} />
                    <ScriptSection label="The Insight" timing="00:35" text={SCRIPTS[item.id].insight} />
                    <ScriptSection label="Resolution" timing="00:58" text={SCRIPTS[item.id].newworld} />
                    
                    <div className="pt-24 border-t border-mist/50">
                      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-magenta mb-8 italic">Director's Protocol</div>
                      <div className="text-3xl font-display text-graphite italic leading-relaxed opacity-70">
                        "Refer to protocol for delivery guidance."
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-24 text-center border-2 border-dashed border-mist rounded-sm">
                    <p className="text-ash/40 font-display italic text-2xl">Strategy awaiting editorial refinement.</p>
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
    <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-ash/40">{label}</div>
    {isEditing ? editNode : (
      badge ? <Badge variant={value}>{value}</Badge> : <div className="text-[15px] font-medium text-graphite">{value}</div>
    )}
  </div>
);

const ScriptSection = ({ label, timing, text }: { label: string, timing: string, text: string }) => (
  <div className="space-y-8 relative">
    <div className="flex items-baseline justify-between border-b border-mist/30 pb-4 mb-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-graphite">{label}</div>
      <div className="text-[10px] font-mono text-ash/40">{timing}</div>
    </div>
    <p className="text-2xl font-display text-charcoal leading-[1.6] italic">{text}</p>
  </div>
);
