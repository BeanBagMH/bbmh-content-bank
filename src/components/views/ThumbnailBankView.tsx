// @ts-nocheck
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, Maximize2, Download, X, Trash2 } from 'lucide-react';
import type { ThumbnailAsset, ContentItem } from '../../types';
import { useContentStore } from '../../hooks/useContentStore';
import { supabase } from '../../lib/supabase';
import { toast } from '../../hooks/useToast';

interface ThumbnailBankViewProps {
  thumbnails: ThumbnailAsset[];
  items: ContentItem[];
}

export const ThumbnailBankView: React.FC<ThumbnailBankViewProps> = ({ thumbnails, items }) => {
  const { addThumbnail, uploadAsset, deleteThumbnail } = useContentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDelete = async (thumb: ThumbnailAsset) => {
    if (window.confirm('Archival Warning: Are you sure you want to delete this strategic asset? This action is permanent.')) {
      const toastId = toast.loading('Removing asset...');
      try {
        await deleteThumbnail(thumb.id, thumb.image_url);
        toast.success('Asset removed from cloud', { id: toastId });
      } catch (err: any) {
        toast.error(`Removal failed: ${err.message}`, { id: toastId });
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const toastId = toast.loading('Uploading to cloud...');
      try {
        const publicUrl = await uploadAsset(file);
        await addThumbnail({
          title: file.name,
          status: 'Draft',
          image_url: publicUrl,
          thumbnail_headline: 'New Hook Concept',
          visual_description: 'Uploaded to Strategic Cloud'
        });
        toast.success('Asset archived successfully', { id: toastId });
      } catch (err: any) {
        toast.error(`Archive failed: ${err.message}`, { id: toastId });
      }
    }
  };

  const getAssetUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // Fallback for legacy records that only stored filename
    const projectUrl = 'https://ddnyzycqfkkyyddmymuj.supabase.co';
    return `${projectUrl}/storage/v1/object/public/thumbnails/${url}`;
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-5xl lg:text-7xl font-display font-bold text-dark tracking-tighter mb-4 italic-serif">Thumbnail Bank</h2>
           <p className="text-ash/60 text-[11px] font-bold uppercase tracking-[0.4em]">Visual Hook Repository & Strategic Assets</p>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileSelect}
        />
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-dark text-white px-10 py-5 rounded-2xl flex items-center gap-4 hover:bg-cyan transition-all shadow-xl shadow-dark/5"
        >
          <Plus size={18} />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Add Strategic Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {thumbnails.length > 0 ? (
          thumbnails.map((thumb) => (
            <ThumbnailCard 
              key={thumb.id} 
              thumbnail={thumb} 
              parentItem={items.find(i => i.id === thumb.related_content_id)}
              onMaximize={() => setSelectedImage(getAssetUrl(thumb.image_url))}
              onDelete={() => handleDelete(thumb)}
              assetUrl={getAssetUrl(thumb.image_url)}
            />
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-white border border-mist rounded-[48px] border-dashed">
             <div className="w-20 h-20 bg-light-grey rounded-full flex items-center justify-center mb-6 text-ash/20">
                <ImageIcon size={32} />
             </div>
             <p className="text-sm font-bold text-ash/40 uppercase tracking-[0.3em]">No visual assets archived</p>
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-xl flex items-center justify-center p-8 lg:p-24"
            onClick={() => setSelectedImage(null)}
          >
             <button className="absolute top-12 right-12 text-white/40 hover:text-white transition-colors">
                <X size={32} />
             </button>
             <motion.img 
               layoutId={selectedImage}
               src={selectedImage} 
               className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
               onClick={(e) => e.stopPropagation()}
             />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ThumbnailCard = ({ thumbnail, parentItem, onMaximize, onDelete, assetUrl }: { thumbnail: ThumbnailAsset, parentItem?: ContentItem, onMaximize: () => void, onDelete: () => void, assetUrl: string }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="group relative bg-white border border-mist rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-dark/5 transition-all"
  >
    <div className="aspect-[16/9] bg-light-grey relative overflow-hidden">
       {assetUrl ? (
         <img src={assetUrl} alt={thumbnail.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
       ) : (
         <div className="absolute inset-0 flex items-center justify-center text-ash/10">
            <ImageIcon size={48} />
         </div>
       )}
       
       <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            className="p-3 bg-white rounded-xl text-dark hover:bg-cyan hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
             <Maximize2 size={18} />
          </button>
          <a 
            href={assetUrl || '#'} 
            download 
            target="_blank" 
            rel="noreferrer"
            className="p-3 bg-white rounded-xl text-dark hover:bg-cyan hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
          >
             <Download size={18} />
          </a>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-3 bg-white rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100"
          >
             <Trash2 size={18} />
          </button>
       </div>
    </div>

    <div className="p-8">
       <div className="text-[10px] font-black uppercase text-ash/30 tracking-[0.2em] mb-3">
         {parentItem?.title || 'Standalone Hook Asset'}
       </div>
       <h4 className="text-lg font-display font-bold text-dark truncate mb-4">{thumbnail.title}</h4>
       <div className="flex items-center justify-between pt-4 border-t border-mist/40">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_rgba(46,204,113,0.4)]" />
             <span className="text-[10px] font-black text-ash/60 uppercase tracking-widest">{thumbnail.status}</span>
          </div>
          <span className="text-[10px] font-bold text-ash/30">{new Date(thumbnail.created_at).toLocaleDateString()}</span>
       </div>
    </div>
  </motion.div>
);
