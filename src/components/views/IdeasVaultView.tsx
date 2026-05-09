import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Trash2, Rocket, Search, LayoutGrid, List as ListIcon } from 'lucide-react';
import { cn } from '../common/Badge';
import { toast } from '../../hooks/useToast';
import { EmptyState } from '../common/EmptyState';
import { useContentStore } from '../../hooks/useContentStore';
import { ConfirmationModal } from '../common/ConfirmationModal';

interface IdeasVaultViewProps {
  onAddIdea: () => void;
}

export const IdeasVaultView: React.FC<IdeasVaultViewProps> = ({ onAddIdea }) => {
  const { ideas, deleteIdea, convertIdeaToContent } = useContentStore();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [layout, setLayout] = React.useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('ideasLayout') as 'grid' | 'list') || 'grid';
  });

  const toggleLayout = (newLayout: 'grid' | 'list') => {
    setLayout(newLayout);
    localStorage.setItem('ideasLayout', newLayout);
  };

  if (!ideas || ideas.length === 0) {
    return (
      <EmptyState 
        icon={Lightbulb}
        title="Your Ideas Vault is Empty"
        description="Every viral video starts with a raw spark. Capture your first idea now."
        action={{
          label: "+ Add First Idea",
          onClick: onAddIdea
        }}
      />
    );
  }

  const filteredIdeas = (ideas || []).filter(idea => 
    idea &&
    !idea.archived && 
    idea.status !== 'Converted' &&
    (idea.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-4">
          <div className="flex items-baseline gap-6">
             <h2 className="text-7xl font-display font-bold text-dark tracking-tighter italic-serif leading-none">
               Ideas Vault
             </h2>
             <span className="text-3xl font-display text-ash/30 font-bold">{(ideas?.length || 0).toString().padStart(2, '0')}</span>
          </div>
          <p className="text-ash/70 text-[11px] font-bold uppercase tracking-[0.4em]">Raw Brain Dumps & Sparking Concepts</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Layout Switcher */}
          <div className="flex bg-light-grey p-1 rounded-xl">
             <button 
               onClick={() => toggleLayout('grid')}
               className={cn("p-2 rounded-lg transition-all", layout === 'grid' ? "bg-white text-dark shadow-sm" : "text-ash/40 hover:text-ash")}
             >
                <LayoutGrid size={18} />
             </button>
             <button 
               onClick={() => toggleLayout('list')}
               className={cn("p-2 rounded-lg transition-all", layout === 'list' ? "bg-white text-dark shadow-sm" : "text-ash/40 hover:text-ash")}
             >
                <ListIcon size={18} />
             </button>
          </div>

          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ash/40 group-focus-within:text-cyan transition-all" />
            <input 
              type="text" 
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-mist pl-12 pr-6 py-4 rounded-xl text-[13px] font-medium outline-none focus:border-cyan focus:shadow-lg focus:shadow-cyan/5 transition-all w-64"
            />
          </div>
        </div>
      </div>

      {/* Grid or List View */}
      {filteredIdeas.length > 0 ? (
        <div className={cn(
          layout === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
            : "flex flex-col gap-4"
        )}>
          {filteredIdeas.map((idea) => (
            <motion.div
              key={idea.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "bg-white border border-mist transition-all group relative flex",
                layout === 'grid' 
                  ? "p-8 rounded-3xl hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/5 flex-col h-full" 
                  : "p-6 rounded-2xl hover:border-cyan/40 items-center gap-6"
              )}
            >
              <div className={cn(
                "flex justify-between items-start",
                layout === 'grid' ? "mb-6" : "flex-shrink-0"
              )}>
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500">
                  <Lightbulb size={20} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-display font-bold text-dark leading-snug group-hover:text-yellow-600 transition-colors truncate",
                  layout === 'grid' ? "text-xl mb-4" : "text-base"
                )}>
                  {idea.title}
                </h3>

                {layout === 'grid' && idea.notes && (
                  <p className="text-sm text-ash/60 leading-relaxed mb-6 line-clamp-3">
                    {idea.notes}
                  </p>
                )}
              </div>

              <div className={cn(
                "flex items-center gap-2",
                layout === 'grid' ? "opacity-0 group-hover:opacity-100 transition-all absolute top-6 right-6" : ""
              )}>
                <button 
                  onClick={async () => {
                    try {
                      await convertIdeaToContent(idea);
                      toast.success('Idea promoted to Content Bank!');
                    } catch (e: any) {
                      toast.error(`Failed to promote: ${e.message}`);
                    }
                  }}
                  className="p-2 hover:bg-cyan/10 rounded-lg text-cyan transition-all"
                  title="Promote to Content Bank"
                >
                  <Rocket size={16} />
                </button>
                <button 
                  onClick={() => setDeletingId(idea.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-all"
                  title="Discard"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className={cn(
                "pt-6 border-t border-mist/40 flex items-center justify-between",
                layout === 'grid' ? "mt-auto" : "hidden md:flex border-none pt-0 ml-4 border-l pl-4"
              )}>
                <div className="flex items-center gap-3">
                  {idea.platform && (
                    <span className="text-[9px] font-bold text-ash/40 uppercase tracking-widest bg-light-grey px-2 py-1 rounded-md whitespace-nowrap">
                      {idea.platform}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-ash/40 text-sm italic">No concepts match your search.</p>
        </div>
      )}
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={async () => {
          if (deletingId) {
            try {
              await deleteIdea(deletingId);
              toast.success('Idea discarded');
            } catch (e: any) {
              toast.error(`Failed: ${e.message}`);
            }
          }
        }}
        title="Discard Concept?"
        message="Are you sure you want to discard this idea? This will permanently remove it from your vault."
        confirmLabel="Discard"
        confirmVariant="danger"
      />
    </div>
  );
};
