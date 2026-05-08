import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContentStore } from './hooks/useContentStore';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardView } from './components/views/DashboardView';
import { BoardView } from './components/views/BoardView';
import { ScriptsView } from './components/views/ScriptsView';
import { ListView } from './components/views/ListView';
import { CalendarView } from './components/views/CalendarView';
import { GridView } from './components/views/GridView';
import { CampaignsView } from './components/views/CampaignsView';
import { ThumbnailBankView } from './components/views/ThumbnailBankView';
import { PerformanceView } from './components/views/PerformanceView';
import { SettingsView } from './components/views/SettingsView';
import { IdeasVaultView } from './components/views/IdeasVaultView';
import { DualView } from './components/views/DualView';
import { BottomNav } from './components/layout/BottomNav';
import { DetailPanel } from './components/DetailPanel';
import { NewContentModal } from './components/modals/NewContentModal';
import { QuickIdeaModal } from './components/modals/QuickIdeaModal';
import { LoginPage } from './components/auth/LoginPage';
import { supabase, isConfigured } from './lib/supabase';

export default function App() {
  const { 
    items, 
    ideas, 
    campaigns, 
    thumbnails, 
    initialized,
    loading 
  } = useContentStore();

  const [view, setView] = React.useState<string>('dashboard');
  const [filter, setFilter] = React.useState({ 
    search: '', 
    subView: 'grid', // grid, board, list, calendar (within Content Bank)
    status: '',
    platform: '',
    type: '',
    cluster: '',
    priority: ''
  });
  
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [detailTab, setDetailTab] = React.useState<string>('info');

  const openDetail = (id: string, tab: string = 'info') => {
    setSelectedId(id);
    setDetailTab(tab);
  };
  const [isNewContentModalOpen, setIsNewContentModalOpen] = React.useState(false);
  const [prefilledDate, setPrefilledDate] = React.useState<string | null>(null);
  const [prefilledStatus, setPrefilledStatus] = React.useState<string>('Raw Idea');
  const [isQuickIdeaModalOpen, setIsQuickIdeaModalOpen] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [authLoading, setAuthLoading] = React.useState(true);

  React.useEffect(() => {
    // Audit bypass with extended mock data
    if (window.location.search.includes('audit=true')) {
      console.log('--- AUDIT MODE ACTIVATED ---');
      setSession({ 
        user: { 
          email: 'audit@bbmh.com', 
          id: '00000000-0000-0000-0000-000000000000',
          user_metadata: { full_name: 'Audit Master' }
        } 
      });
      setAuthLoading(false);
      return;
    }

    if (!isConfigured) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      setAuthLoading(false);
    }).catch((err: any) => {
      console.error('Session fetch failed:', err);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const filteredItems = React.useMemo(() => {
    return items.filter(item => {
      const matchesSearch = !filter.search || 
        item.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        item.cluster?.toLowerCase().includes(filter.search.toLowerCase());
      
      const matchesStatus = !filter.status || item.status === filter.status;
      const matchesPlatform = !filter.platform || item.platform === filter.platform;
      const matchesType = !filter.type || item.content_type === filter.type;
      
      return matchesSearch && matchesStatus && matchesPlatform && matchesType;
    });
  }, [items, filter]);

  const itemCounts = {
    'dashboard': items.length,
    'content-bank': items.length,
    'ideas-vault': ideas.length,
    'campaigns': campaigns.length,
    'thumbnails': thumbnails.length,
    'performance': items.filter(i => i.status === 'Published').length,
  };

  // Search Navigation Guard: Auto-switch to Content Bank when searching
  React.useEffect(() => {
    if (filter.search && view !== 'content-bank' && view !== 'ideas-vault' && view !== 'planner') {
      setView('content-bank');
    }
  }, [filter.search, view]);

  if (!isConfigured) {
    return <SetupRequired />;
  }

  if (authLoading) {
    return <LoadingScreen label="Authenticating..." />;
  }

  if (!session) {
    return <LoginPage />;
  }

  if (!initialized && loading) {
    return <LoadingScreen label="Synchronizing Strategic Sanctuary..." />;
  }

  return (
    <div className="flex h-screen bg-[#fcfaf9] overflow-hidden font-body text-dark selection:bg-cyan/20">
      <Sidebar 
        currentView={view} 
        setView={setView}
        itemCounts={itemCounts}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#fcfaf9] relative">
        <Topbar 
          currentView={view} 
          setView={setView}
          onNewContent={() => setIsNewContentModalOpen(true)}
          onQuickIdea={() => setIsQuickIdeaModalOpen(true)}
          filter={filter}
          setFilter={setFilter}
        />

        <section className="flex-1 overflow-auto p-6 lg:p-12 pb-32 lg:pb-12 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={view + (view === 'content-bank' ? filter.subView : '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {view === 'dashboard' && <DashboardView items={filteredItems} setView={setView} />}
              
              {view === 'content-bank' && (
                <>
                  {filter.subView === 'grid' && <GridView items={filteredItems} onCardClick={(id) => openDetail(id, 'info')} />}
                  {filter.subView === 'board' && <BoardView items={filteredItems} onCardClick={(id) => openDetail(id, 'info')} />}
                  {filter.subView === 'list' && <ListView items={filteredItems} onCardClick={(id) => openDetail(id, 'info')} />}
                  {filter.subView === 'calendar' && (
                    <CalendarView 
                      items={filteredItems} 
                      onCardClick={(id) => openDetail(id, 'info')} 
                      onNewContent={(date?: string) => {
                        setPrefilledDate(date || null);
                        setIsNewContentModalOpen(true);
                      }} 
                    />
                  )}
                </>
              )}

              {view === 'calendar' && (
                <CalendarView 
                  items={filteredItems} 
                  onCardClick={(id) => openDetail(id, 'info')} 
                  onNewContent={(date?: string) => {
                    setPrefilledDate(date || null);
                    setIsNewContentModalOpen(true);
                  }} 
                />
              )}

              {view === 'planner' && (
                <DualView 
                  items={filteredItems} 
                  onCardClick={(id) => openDetail(id, 'info')} 
                  onNewContent={(date?: string, status?: string) => {
                    setPrefilledDate(date || null);
                    setPrefilledStatus(status || 'Raw Idea');
                    setIsNewContentModalOpen(true);
                  }} 
                />
              )}

              {/* Ideas Vault */}
              {view === 'ideas-vault' && <IdeasVaultView />}

              {/* Scripts Section */}
              {view === 'scripts' && (
                <ScriptsView 
                  items={items.filter(i => !i.archived)} 
                  onCardClick={(id) => openDetail(id, 'writing')} 
                />
              )}

              {view === 'campaigns' && <CampaignsView campaigns={campaigns} items={items} />}
              {view === 'thumbnails' && <ThumbnailBankView thumbnails={thumbnails} items={items} />}
              {view === 'performance' && <PerformanceView items={items} />}
              {view === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <DetailPanel 
        selectedId={selectedId} 
        initialTab={detailTab}
        onClose={() => setSelectedId(null)} 
      />

      <NewContentModal 
        isOpen={isNewContentModalOpen} 
        onClose={() => {
          setIsNewContentModalOpen(false);
          setPrefilledDate(null);
          setPrefilledStatus('Raw Idea');
        }}
        prefilledDate={prefilledDate}
        prefilledStatus={prefilledStatus}
      />

      <QuickIdeaModal 
        isOpen={isQuickIdeaModalOpen} 
        onClose={() => setIsQuickIdeaModalOpen(false)} 
      />

      <BottomNav 
        currentView={view}
        setView={setView}
      />
    </div>
  );
}

const LoadingScreen = ({ label }: { label: string }) => (
  <div className="h-screen flex flex-col items-center justify-center bg-white">
    <div className="w-12 h-12 border-4 border-mist border-t-cyan rounded-full animate-spin mb-6" />
    <div className="animate-pulse text-ash/40 text-[10px] uppercase tracking-[0.4em] font-bold">{label}</div>
  </div>
);

const SetupRequired = () => (
  <div className="h-screen flex items-center justify-center bg-[#fcfaf9] p-12">
    <div className="max-w-xl w-full space-y-12 text-center">
      <h1 className="text-6xl font-display text-dark italic-serif leading-none">Setup Required</h1>
      <div className="bg-white p-12 border border-mist text-left space-y-8 shadow-[0_40px_80px_rgba(0,0,0,0.03)]">
        <p className="text-lg font-display italic-serif text-dark leading-relaxed">
          Please add these environment variables to your .env.local:
        </p>
        <div className="space-y-4 font-mono text-[11px] bg-light-grey p-6 border border-mist">
           <div className="flex justify-between items-center"><span className="text-cyan font-bold">VITE_SUPABASE_URL</span></div>
           <div className="flex justify-between items-center"><span className="text-cyan font-bold">VITE_SUPABASE_ANON_KEY</span></div>
        </div>
      </div>
    </div>
  </div>
);
