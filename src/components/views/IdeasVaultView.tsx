// @ts-nocheck
import React from 'react';
import { useContentStore } from '../../hooks/useContentStore';
import { FileText } from 'lucide-react';

export const IdeasVaultView = () => {
  const { sources } = useContentStore();

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-dark italic-serif">Source Documents</h1>
          <p className="text-ash mt-1">Original master strategy docs, PDFs, and parsed text.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map(source => (
          <div key={source.id} className="bg-surface border border-mist flex flex-col hover:border-cyan transition-colors">
            <div className="p-5 border-b border-mist/50 flex justify-between items-center bg-light-grey">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-cyan" />
                <span className="text-xs font-bold uppercase tracking-wider text-dark">{source.source_label}</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-white text-ash border border-mist">
                {source.source_type}
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-medium text-dark mb-4">{source.title}</h3>
              
              <div className="flex-1 bg-white border border-mist p-4 text-xs text-ash/80 font-mono overflow-y-auto max-h-48 custom-scrollbar whitespace-pre-wrap">
                {source.raw_text ? source.raw_text.substring(0, 500) + '...' : 'No content preview available.'}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-[10px] text-ash font-bold uppercase tracking-wider">Status: {source.parsed_status}</span>
                <button className="text-[10px] text-cyan hover:text-dark uppercase font-bold tracking-wider transition-colors">
                  View Full Document
                </button>
              </div>
            </div>
          </div>
        ))}
        {sources.length === 0 && (
          <div className="col-span-full py-24 text-center text-ash bg-surface border border-mist border-dashed">
            No source documents loaded. Run the migration script.
          </div>
        )}
      </div>
    </div>
  );
};
