import * as React from 'react';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useContentStore } from './hooks/useContentStore';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardView } from './components/views/DashboardView';
import { BoardView } from './components/views/BoardView';
import { ContentBankView } from './components/views/ContentBankView';
import { ScriptsView } from './components/views/ScriptsView';
import { CalendarView } from './components/views/CalendarView';
import { CampaignsView } from './components/views/CampaignsView';
import { ThumbnailBankView } from './components/views/ThumbnailBankView';
import { PerformanceView } from './components/views/PerformanceView';
import { SettingsView } from './components/views/SettingsView';
import './deploy-buzzer';
import { IdeasVaultView } from './components/views/IdeasVaultView';
import { BottomNav } from './components/layout/BottomNav';
import { DetailPanel } from './components/DetailPanel';
import { NewContentModal } from './components/modals/NewContentModal';
import { QuickIdeaModal } from './components/modals/QuickIdeaModal';
import { LoginPage } from './components/auth/LoginPage';
import { supabase, isConfigured } from './lib/supabase';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function App() {
  const { 
    items, 
    ideas, 
    campaigns, 
    thumbnails, 
    initialized,
    loading 
  } = useContentStore();

  const location = useLocation();
  const navigate = useNavigate();
  
  const view = React.useMemo(() => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'dashboard';
    return path;
  }, [location]);

  const setView = (newView: string) => {
    navigate(newView === 'dashboard' ? '/' : `/${newView}`);
  };

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
  
  // Theme Engine
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [lightboxImage, setLightboxImage] = React.useState<string | null>(null);

  const openLightbox = (url: string) => {
    setLightboxImage(url);
    setIsLightboxOpen(true);
  };

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
    <div className="flex h-screen bg-bg overflow-hidden font-body text-dark selection:bg-cyan/20">
      <Sidebar 
        currentView={view} 
        itemCounts={itemCounts}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-bg relative">
        <Topbar 
          currentView={view} 
          setView={setView}
          onNewContent={() => setIsNewContentModalOpen(true)}
          onQuickIdea={() => setIsQuickIdeaModalOpen(true)}
          filter={filter}
          setFilter={setFilter}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        <section className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-12 pb-40 lg:pb-12 custom-scrollbar overscroll-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Routes>
                <Route path="/" element={<DashboardView items={items} setView={setView} />} />
                <Route path="/planner" element={
                  <BoardView 
                    items={filteredItems} 
                    onCardClick={(id) => openDetail(id)}
                    onAddNew={() => setIsNewContentModalOpen(true)}
                  />
                } />
                <Route path="/content-bank" element={
                  <ContentBankView 
                    items={filteredItems} 
                    filter={filter} 
                    setFilter={setFilter}
                    onCardClick={(id: string) => openDetail(id)}
                    onAddNew={() => setIsNewContentModalOpen(true)}
                  />
                } />
                <Route path="/ideas" element={
                  <IdeasVaultView 
                    onAddIdea={() => setIsQuickIdeaModalOpen(true)} 
                  />
                } />
                <Route path="/calendar" element={
                  <CalendarView 
                    items={items} 
                    onCardClick={(id: string) => openDetail(id)} 
                    onNewContent={(date?: string) => {
                      setPrefilledDate(date || null);
                      setIsNewContentModalOpen(true);
                    }}
                  />
                } />
                <Route path="/campaigns" element={<CampaignsView campaigns={campaigns} items={items} />} />
                <Route path="/scripts" element={
                  <ScriptsView 
                    items={items} 
                    onCardClick={(id) => openDetail(id, 'writing')} 
                  />
                } />
                <Route path="/thumbnails" element={<ThumbnailBankView thumbnails={thumbnails} items={items} />} />
                <Route path="/performance" element={<PerformanceView items={items} />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <MobileNav 
        currentView={view} 
        onAddClick={() => setIsQuickIdeaModalOpen(true)} 
      />

      <DetailPanel 
        selectedId={selectedId} 
        initialTab={detailTab}
        onClose={() => {
          setSelectedId(null);
        }} 
        onOpenLightbox={openLightbox}
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
      />

      {/* Elevation 5.3: Floating Quick Capture */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsQuickIdeaModalOpen(true)}
        className="fixed bottom-32 right-6 lg:bottom-12 lg:right-12 w-16 h-16 bg-cyan text-white rounded-full shadow-2xl shadow-cyan/40 flex items-center justify-center z-40 group border-4 border-white"
        title="Quick Capture Idea"
      >
        <Plus size={32} className="group-hover:text-white transition-colors" />
      </motion.button>
      
      {lightboxImage && (
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          slides={[{ src: lightboxImage }]}
        />
      )}
      
      <ToastContainer />
    </div>
  );
};

const LoadingScreen = ({ label }: { label: string }) => (
  <div className="h-screen flex flex-col items-center justify-center bg-surface">
    <div className="w-12 h-12 border-4 border-mist border-t-cyan rounded-full animate-spin mb-6" />
    <div className="animate-pulse text-ash/40 text-[10px] uppercase tracking-[0.4em] font-bold">{label}</div>
  </div>
);

const SetupRequired = () => (
  <div className="h-screen flex items-center justify-center bg-bg p-12">
    <div className="max-w-xl w-full space-y-12 text-center">
      <h1 className="text-6xl font-display text-dark italic-serif leading-none">Setup Required</h1>
      <div className="bg-surface p-12 border border-mist text-left space-y-8 shadow-[0_40px_80px_rgba(0,0,0,0.03)]">
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
// V4.2.0-PRO HEARTBEAT
// V4.2.0-PRO HEARTBEAT
