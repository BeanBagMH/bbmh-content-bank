import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Plus, Maximize2, Download } from 'lucide-react';
import type { Thumbnail, ContentItem } from '../../types';

interface ThumbnailBankViewProps {
  thumbnails: Thumbnail[];
  items: ContentItem[];
}

export const ThumbnailBankView: React.FC<ThumbnailBankViewProps> = ({ thumbnails, items }) => {
  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-5xl font-display font-bold text-dark tracking-tighter mb-4">Thumbnail Bank</h2>
           <p className="text-ash/60 text-[11px] font-bold uppercase tracking-[0.4em]">Visual Hook Repository & A/B Testing</p>
        </div>
        <button className="bg-dark text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-cyan transition-all shadow-lg shadow-dark/5">
          <Plus size={18} />
          <span className="text-[11px] font-bold uppercase tracking-widest">Add Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {thumbnails.length > 0 ? (
          thumbnails.map((thumb) => (
            <ThumbnailCard 
              key={thumb.id} 
              thumbnail={thumb} 
              parentItem={items.find(i => i.id === thumb.content_item_id)} 
            />
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-white border border-mist rounded-[40px] border-dashed">
             <div className="w-16 h-16 bg-light-grey rounded-full flex items-center justify-center mb-6 text-ash/20">
                <ImageIcon size={32} />
             </div>
             <p className="text-sm font-bold text-ash/40 uppercase tracking-widest">No visual assets archived</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ThumbnailCard = ({ thumbnail, parentItem }: { thumbnail: Thumbnail, parentItem?: ContentItem }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="group relative bg-white border border-mist rounded-2xl overflow-hidden shadow-sm"
  >
    {/* Aspect Ratio Container (16:9 for thumbnails, or 9:16 for Reels) */}
    <div className="aspect-[16/9] bg-light-grey relative overflow-hidden">
       {/* In a real app, this would be <img>. Using a placeholder for now. */}
       <div className="absolute inset-0 flex items-center justify-center text-ash/10">
          <ImageIcon size={48} />
       </div>
       
       {/* Overlay Actions */}
       <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button className="p-3 bg-white rounded-full text-dark hover:bg-cyan hover:text-white transition-all">
             <Maximize2 size={18} />
          </button>
          <button className="p-3 bg-white rounded-full text-dark hover:bg-cyan hover:text-white transition-all">
             <Download size={18} />
          </button>
       </div>
    </div>

    <div className="p-6">
       <div className="text-[9px] font-black uppercase text-ash/40 tracking-widest mb-2">
         {parentItem?.title || 'Standalone Asset'}
       </div>
       <h4 className="text-[14px] font-bold text-dark truncate mb-1">{thumbnail.title}</h4>
       <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-turquoise" />
          <span className="text-[10px] font-bold text-ash/60 uppercase tracking-tighter">{thumbnail.status}</span>
       </div>
    </div>
  </motion.div>
);
