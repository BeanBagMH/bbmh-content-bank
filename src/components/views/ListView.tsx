import React from 'react';
import type { ContentItem } from '../../types';
import { Badge } from '../common/Badge';
import { useContentStore } from '../../hooks/useContentStore';
import { toast } from '../../hooks/useToast';
import { ChevronDown, Calendar as CalendarIcon, List } from 'lucide-react';

interface ListViewProps {
  items: ContentItem[];
  onCardClick: (id: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({ items, onCardClick }) => {
  const { updateItem } = useContentStore();

  const handleStatusChange = async (id: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    try {
      await updateItem(id, { status: e.target.value as any });
      toast.success('Status updated!');
    } catch (err: any) {
      toast.error(`Failed: ${err.message}`);
    }
  };

  return (
    <div className="bg-white border border-mist rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all duration-500">
      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-mist/30">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => onCardClick(item.id)}
            className="p-6 bg-white active:bg-light-grey/20 transition-all flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
               <div>
                 <h4 className="text-[15px] font-display font-bold text-dark">{item.title}</h4>
                 <div className="flex items-center gap-2 mt-1">
                   <Badge variant={item.content_type} className="text-[8px] px-1.5 py-0.5">{item.content_type}</Badge>
                   <span className="text-[9px] font-mono text-ash/30">#{item.id.slice(0, 4)}</span>
                 </div>
               </div>
               <div className="relative" onClick={e => e.stopPropagation()}>
                 <select 
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e)}
                    className="appearance-none bg-mist/5 border border-mist/20 rounded-lg px-3 py-1.5 pr-8 text-[9px] font-black text-ash outline-none"
                  >
                    {['Raw Idea', 'Selected', 'Research', 'Scripting', 'Design', 'Editing', 'Review', 'Scheduled', 'Published'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-ash/40" />
               </div>
            </div>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-ash/40">
                 <CalendarIcon size={12} />
                 <span className="text-[10px] font-mono">
                    {item.publish_date ? new Date(item.publish_date).toLocaleDateString() : 'Unset'}
                 </span>
               </div>
               {item.cluster && (
                 <span className="text-[9px] font-black text-cyan/60 uppercase tracking-widest">{item.cluster}</span>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-light-grey/20 border-b border-mist/40">
              <th className="px-10 py-6 text-[10px] font-black text-ash/40 uppercase tracking-[0.3em]">Strategy & Vision</th>
              <th className="px-10 py-6 text-[10px] font-black text-ash/40 uppercase tracking-[0.3em]">Status Pipeline</th>
              <th className="px-10 py-6 text-[10px] font-black text-ash/40 uppercase tracking-[0.3em]">Content Type</th>
              <th className="px-10 py-6 text-[10px] font-black text-ash/40 uppercase tracking-[0.3em]">Deployment Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist/30">
            {items.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => onCardClick(item.id)}
                className="hover:bg-light-grey/20 transition-all duration-300 cursor-pointer group"
              >
                <td className="px-10 py-8">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[17px] font-display font-bold text-dark group-hover:text-cyan transition-colors duration-300">
                        {item.title}
                      </span>
                      {item.priority === 'Urgent' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" title="Urgent Priority" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono font-bold text-ash/30 tracking-widest uppercase">ID: {item.id.slice(0, 8)}</span>
                      {item.cluster && (
                        <span className="text-[9px] font-black text-cyan/60 uppercase tracking-widest bg-cyan/5 px-2 py-0.5 rounded">
                          {item.cluster}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="relative inline-block" onClick={e => e.stopPropagation()}>
                    <select 
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e)}
                      className="appearance-none bg-mist/10 border border-mist/30 rounded-full px-5 py-2 pr-10 text-[11px] font-black text-ash hover:border-cyan hover:text-dark hover:bg-white transition-all duration-300 outline-none cursor-pointer shadow-sm"
                    >
                      {['Raw Idea', 'Selected', 'Research', 'Scripting', 'Design', 'Editing', 'Review', 'Scheduled', 'Published'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ash/40 group-hover:text-cyan transition-colors" />
                  </div>
                </td>
                <td className="px-10 py-8">
                  <Badge variant={item.content_type} className="px-3 py-1 text-[10px] font-bold tracking-wider">{item.content_type}</Badge>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-3 text-ash/40 group-hover:text-dark transition-colors duration-300">
                    <CalendarIcon size={14} className="opacity-40" />
                    <span className="text-[12px] font-mono font-medium">
                      {item.publish_date ? new Date(item.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {items.length === 0 && (
        <div className="py-32 text-center bg-white/50 backdrop-blur-sm">
          <div className="w-16 h-16 bg-light-grey/40 rounded-full flex items-center justify-center mx-auto mb-6 text-ash/20">
            <List size={32} />
          </div>
          <p className="text-ash/30 text-[12px] font-black uppercase tracking-[0.4em] italic">No strategic pieces detected</p>
        </div>
      )}
    </div>
  );
};
