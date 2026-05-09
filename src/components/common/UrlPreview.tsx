import React, { useState, useEffect } from 'react';
import { ExternalLink, Globe, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UrlPreviewProps {
  url: string;
}

export const UrlPreview: React.FC<UrlPreviewProps> = ({ url }) => {
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url || !url.startsWith('http')) return;

    const fetchPreview = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        
        if (data.status === 'success') {
          setPreview({
            title: data.data.title,
            description: data.data.description,
            image: data.data.image?.url || data.data.logo?.url,
            site: data.data.publisher || data.data.author
          });
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  if (!url || !url.startsWith('http')) return null;

  return (
    <div className="mt-4">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 bg-light-grey rounded-2xl border border-mist animate-pulse"
          >
            <Loader2 size={16} className="animate-spin text-cyan" />
            <span className="text-[10px] font-black uppercase text-ash/40 tracking-widest">Fetching Intelligence...</span>
          </motion.div>
        ) : preview ? (
          <motion.a
            href={url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex gap-4 p-4 bg-white border border-mist rounded-2xl hover:border-cyan/40 hover:shadow-xl hover:shadow-dark/5 transition-all overflow-hidden"
          >
            {preview.image && (
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-light-grey">
                <img src={preview.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                 <Globe size={10} className="text-ash/40" />
                 <span className="text-[9px] font-black uppercase text-ash/40 tracking-widest truncate">{preview.site || 'External Link'}</span>
              </div>
              <h4 className="text-[13px] font-bold text-dark truncate mb-1">{preview.title}</h4>
              <p className="text-[11px] text-ash/60 line-clamp-2 leading-relaxed">{preview.description}</p>
            </div>
            <div className="self-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink size={14} className="text-cyan" />
            </div>
          </motion.a>
        ) : error ? (
           <a href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-light-grey rounded-2xl border border-mist text-ash/60 hover:text-cyan transition-colors">
              <span className="text-xs font-medium truncate pr-4">{url}</span>
              <ExternalLink size={14} />
           </a>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
