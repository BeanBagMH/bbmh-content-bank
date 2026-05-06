import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Trash2, Edit3 } from 'lucide-react';
import type { ContentItem } from '../types';
import { SCRIPTS } from '../data/mockData';
import { Badge } from './common/Badge';

interface DetailPanelProps {
  selectedId: number | null;
  items: ContentItem[];
  onClose: () => void;
  onDelete: (id: number) => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ selectedId, items, onClose, onDelete }) => {
  const item = items.find(d => d.id === selectedId);

  return (
    <AnimatePresence>
      {selectedId && item && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-[200]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-screen w-[600px] bg-white z-[201] shadow-2xl flex flex-col border-l border-border"
          >
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:border-cyan text-muted hover:text-cyan transition-all active:scale-90"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="text-[11px] font-black uppercase tracking-[0.15em] text-muted">
                  Ideas &rsaquo; <span className="text-dark">{item.title.substring(0, 30)}...</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:border-cyan text-muted hover:text-cyan transition-all active:scale-90">
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => { if(confirm('Delete this idea?')) { onDelete(item.id); onClose(); } }}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:border-red-500 text-muted hover:text-red-500 transition-all active:scale-90"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="flex h-24 gap-1 rounded-2xl overflow-hidden mb-10 shadow-lg shadow-dark/5">
                {["#252527", "#1F8E8D", "#FAD74F", "#9AE3D3", "#F27D7D"].map(c => (
                  <div key={c} className="flex-1 transition-transform hover:scale-110" style={{ background: c }} />
                ))}
              </div>
              
              <h1 className="font-display text-4xl text-dark leading-[1.1] mb-10 font-black tracking-tight">{item.title}</h1>
              
              <div className="grid grid-cols-2 gap-y-10 gap-x-12 py-10 border-y border-border mb-10">
                <Field label="Status" value={item.status} badge />
                <Field label="Format" value={item.fmt} badge />
                <Field label="Cluster" value={`${item.cluster} · ${item.cname}`} />
                <Field label="Scheduled" value={item.day ? `${item.day} May, 2026` : "Unscheduled"} />
              </div>

              {item.hasScript && SCRIPTS[item.id] ? (
                <div className="space-y-12 pb-20">
                  <ScriptSection label="Hook" timing="0 – 3s" text={SCRIPTS[item.id].hook} />
                  <ScriptSection label="Empathy Bridge" timing="3 – 10s" text={SCRIPTS[item.id].empathy} />
                  <ScriptSection label="The Insight" timing="10 – 35s" text={SCRIPTS[item.id].insight} />
                  <ScriptSection label="The Reframe" timing="35 – 50s" text={SCRIPTS[item.id].reframe} />
                  <ScriptSection label="New World" timing="50 – 58s" text={SCRIPTS[item.id].newworld} />
                  {SCRIPTS[item.id].cta && <ScriptSection label="CTA" timing="58 – 60s" text={SCRIPTS[item.id].cta || ''} />}
                  
                  <div className="pt-10 border-t border-border">
                    <div className="text-[12px] text-muted italic leading-relaxed font-medium">
                      <strong className="text-dark not-italic">Frameworks:</strong> {SCRIPTS[item.id].framework}
                    </div>
                    <div className="mt-8 bg-cyan/[0.03] rounded-[24px] p-8 border-l-4 border-cyan shadow-sm">
                      <div className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan mb-4">Director's Notes</div>
                      <div className="text-[15px] text-dark/80 leading-relaxed italic font-medium">{SCRIPTS[item.id].director}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-background/50 rounded-3xl p-12 text-center space-y-4 border border-border/50">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <Clock size={32} className="text-muted/40" />
                  </div>
                  <h3 className="text-[16px] font-black text-dark uppercase tracking-tight">Script not yet written</h3>
                  <p className="text-xs text-muted leading-relaxed font-bold max-w-[280px] mx-auto opacity-60">Use the BBMh Script Engine injection in a new chat to generate this script. The pain point, cluster, and format are already defined.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Field = ({ label, value, badge }: { label: string, value: string, badge?: boolean }) => (
  <div className="space-y-2">
    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted opacity-60">{label}</div>
    {badge ? <Badge variant={value}>{value}</Badge> : <div className="text-[15px] font-black text-dark">{value}</div>}
  </div>
);

const ScriptSection = ({ label, timing, text }: { label: string, timing: string, text: string }) => (
  <div className="space-y-4">
    <div className="flex items-baseline gap-3 pb-3 border-b border-cyan/10">
      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan">{label}</span>
      <span className="text-[10px] text-muted font-black tracking-normal opacity-50">{timing}</span>
    </div>
    <p className="text-[16px] text-dark/90 leading-[1.8] font-semibold">{text}</p>
  </div>
);
