import React from 'react';
import { Copy, CheckCircle2, Terminal } from 'lucide-react';
import type { ContentItem } from '../../types';
import { useContentStore } from '../../hooks/useContentStore';
import { toast } from '../../hooks/useToast';
import { Badge } from '../common/Badge';

interface ScriptsViewProps {
  items: ContentItem[];
  onCardClick: (id: string) => void;
}

export const ScriptsView: React.FC<ScriptsViewProps> = ({ items, onCardClick }) => {
  const { updateItem } = useContentStore();

  const copyToClipboard = (text: string | null, label: string) => {
    if (!text) {
      toast.error(`No ${label} to copy!`);
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const markReady = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateItem(id, { status: 'Review' });
      alert('Script marked as ready for review!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-5xl font-display font-bold text-dark tracking-tighter mb-4">Script Sanctuary</h2>
           <p className="text-ash/60 text-[11px] font-bold uppercase tracking-[0.4em]">Drafting & Refining Strategic Narratives</p>
        </div>
      </div>

      <div className="bg-white border border-mist rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-light-grey/20 border-b border-mist/40">
                <th className="px-10 py-6 text-[10px] font-black text-ash/40 uppercase tracking-[0.3em]">Title & Cluster</th>
                <th className="px-10 py-6 text-[10px] font-black text-ash/40 uppercase tracking-[0.3em]">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-ash/40 uppercase tracking-[0.3em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist/30">
              {items.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => onCardClick(item.id)}
                  className="hover:bg-light-grey/10 transition-all cursor-pointer group"
                >
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-2">
                      <span className="text-[16px] font-bold text-dark group-hover:text-cyan transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[9px] font-black text-ash/40 uppercase tracking-widest">{item.cluster || 'General'}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <Badge variant={item.status as any}>{item.status}</Badge>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                       <ScriptActionButton 
                         icon={Copy} 
                         label="Hook" 
                         onClick={() => copyToClipboard(item.hook, 'Hook')} 
                         disabled={!item.hook}
                       />
                       <ScriptActionButton 
                         icon={Copy} 
                         label="Script" 
                         onClick={() => copyToClipboard(item.script, 'Script')} 
                         disabled={!item.script}
                       />
                       <ScriptActionButton 
                         icon={Copy} 
                         label="Caption" 
                         onClick={() => copyToClipboard(item.caption, 'Caption')} 
                         disabled={!item.caption}
                       />
                       <button 
                         onClick={(e) => markReady(item.id, e)}
                         className="flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-cyan transition-all ml-4"
                       >
                         <CheckCircle2 size={14} />
                         <span>Mark Ready</span>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {items.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-16 h-16 bg-light-grey rounded-full flex items-center justify-center mx-auto mb-6 text-ash/20">
              <Terminal size={32} />
            </div>
            <p className="text-ash/30 text-[11px] font-black uppercase tracking-widest italic">No scripts currently in production</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ScriptActionButton = ({ icon: Icon, label, onClick, disabled }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-2 px-3 py-2 bg-light-grey rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-mist transition-all disabled:opacity-30 disabled:cursor-not-allowed text-ash"
  >
    <Icon size={14} className="text-ash/40" />
    <span>{label}</span>
  </button>
);
