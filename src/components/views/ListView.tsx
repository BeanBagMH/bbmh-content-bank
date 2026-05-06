import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { ContentItem } from '../../types';
import { Badge } from '../common/Badge';

interface ListViewProps {
  items: ContentItem[];
  onCardClick: (id: number) => void;
}

export const ListView: React.FC<ListViewProps> = ({ items, onCardClick }) => {
  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-background border-b border-border">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Title</th>
            <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Category</th>
            <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Format</th>
            <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Cluster</th>
            <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr 
              key={item.id} 
              className="border-b border-border/50 hover:bg-cyan/[0.02] cursor-pointer transition-colors group"
              onClick={() => onCardClick(item.id)}
            >
              <td className="px-8 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-bold text-dark group-hover:text-cyan transition-colors">{item.title}</span>
                  {item.hasScript && <CheckCircle2 size={14} className="text-cyan shrink-0" />}
                </div>
              </td>
              <td className="px-8 py-4">
                <span className="text-xs font-bold text-muted/80 capitalize">{item.col}</span>
              </td>
              <td className="px-8 py-4">
                <Badge variant={item.fmt}>{item.fmt}</Badge>
              </td>
              <td className="px-8 py-4">
                <span className="text-[11px] font-black text-muted bg-muted/5 px-2.5 py-1 rounded-xl">
                  {item.cluster} · {item.cname}
                </span>
              </td>
              <td className="px-8 py-4">
                <Badge variant={item.status}>{item.status}</Badge>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="px-8 py-12 text-center text-muted font-bold italic opacity-40">
                No items match your filters
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
