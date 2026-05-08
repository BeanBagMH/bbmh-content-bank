import React from 'react';
import type { ContentItem } from '../../types';
import { Badge } from '../common/Badge';
import { useContentStore } from '../../hooks/useContentStore';
import { ChevronDown, Calendar as CalendarIcon } from 'lucide-react';

interface ListViewProps {
  items: ContentItem[];
  onCardClick: (id: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({ items, onCardClick }) => {
  const { updateItem } = useContentStore();

  const handleStatusChange = async (id: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    await updateItem(id, { status: e.target.value as any });
  };

  return (
    <div className="bg-white border border-mist rounded-3xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-light-grey/30 border-b border-mist">
            <th className="px-8 py-5 text-[10px] font-black text-ash uppercase tracking-widest">Strategy</th>
            <th className="px-8 py-5 text-[10px] font-black text-ash uppercase tracking-widest">Status</th>
            <th className="px-8 py-5 text-[10px] font-black text-ash uppercase tracking-widest">Type</th>
            <th className="px-8 py-5 text-[10px] font-black text-ash uppercase tracking-widest">Cluster</th>
            <th className="px-8 py-5 text-[10px] font-black text-ash uppercase tracking-widest">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-mist/40">
          {items.map((item) => (
            <tr 
              key={item.id} 
              onClick={() => onCardClick(item.id)}
              className="hover:bg-light-grey/30 transition-colors cursor-pointer group"
            >
              <td className="px-8 py-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-display font-bold text-dark group-hover:text-cyan transition-colors">{item.title}</span>
                  <span className="text-[10px] font-mono text-ash/30">#{item.id.slice(0, 8)}</span>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="relative inline-block" onClick={e => e.stopPropagation()}>
                  <select 
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e)}
                    className="appearance-none bg-mist/20 border border-mist/40 rounded-full px-4 py-1.5 pr-8 text-[11px] font-bold text-ash hover:border-cyan hover:text-dark transition-all outline-none cursor-pointer"
                  >
                    {['Raw Idea', 'Selected', 'Research', 'Scripting', 'Design', 'Editing', 'Review', 'Scheduled', 'Published'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ash/40" />
                </div>
              </td>
              <td className="px-8 py-6">
                <Badge variant={item.content_type}>{item.content_type}</Badge>
              </td>
              <td className="px-8 py-6">
                <span className="text-[11px] font-bold text-ash/60 uppercase tracking-widest">{item.content_cluster || 'General'}</span>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2 text-ash/40">
                  <CalendarIcon size={12} />
                  <span className="text-[11px] font-mono">
                    {item.publish_date ? new Date(item.publish_date).toLocaleDateString() : '---'}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {items.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-ash/30 text-[11px] font-bold uppercase tracking-widest italic">No pieces found in this view</p>
        </div>
      )}
    </div>
  );
};
