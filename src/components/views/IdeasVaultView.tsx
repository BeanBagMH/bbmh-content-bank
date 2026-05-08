import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Trash2, Rocket, Search } from 'lucide-react';
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

  if (ideas.length === 0) {
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
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredIdeas = ideas.filter(idea => 
    !idea.archived && 
    idea.status !== 'Converted' &&
    idea.title.toLowerCase().includes(searchQuery.toLowerCase())
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
             <span className="text-3xl font-display text-ash/30 font-bold">{ideas.length.toString().padStart(2, '0')}</span>
          </div>
          <p className="text-ash/70 text-[11px] font-bold uppercase tracking-[0.4em]">Raw Brain Dumps & Sparking Concepts</p>
        </div>

        <div className="flex items-center gap-4">
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

      {/* Grid */}
      {filteredIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredIdeas.map((idea) => (
            <motion.div
              key={idea.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-mist p-8 rounded-3xl hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all group relative flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500">
                  <Lightbulb size={20} />
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
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
              </div>

              <h3 className="text-xl font-display font-bold text-dark leading-snug mb-4 group-hover:text-yellow-600 transition-colors">
                {idea.title}
              </h3>

              {idea.note && (
                <p className="text-sm text-ash/60 leading-relaxed mb-6 line-clamp-3">
                  {idea.note}
                </p>
              )}

              <div className="mt-auto pt-6 border-t border-mist/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {idea.platform && (
                    <span className="text-[9px] font-bold text-ash/40 uppercase tracking-widest bg-light-grey px-2 py-1 rounded-md">
                      {idea.platform}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-ash/20 italic">
                  {new Date(idea.created_at).toLocaleDateString()}
                </span>
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
