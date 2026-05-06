import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContentStore } from './hooks/useContentStore';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { BoardView } from './components/views/BoardView';
import { ListView } from './components/views/ListView';
import { CalendarView } from './components/views/CalendarView';
import { DetailPanel } from './components/DetailPanel';
import { NewIdeaModal } from './components/modals/NewIdeaModal';

const CLUSTERS = [
  { id: '01', name: 'Invisibility' },
  { id: '02', name: 'Trust Filter' },
  { id: '03', name: 'Scale Problem' },
  { id: '04', name: 'Second Gen' },
  { id: '05', name: 'Inconsistency' },
  { id: '06', name: 'Price War' },
  { id: '07', name: 'Export Filter' },
  { id: '08', name: 'Dead Website' },
  { id: '09', name: 'Referral Gap' },
  { id: '10', name: 'Revenue Link' }
];

export default function App() {
  const { items, addItem, deleteItem, initialized } = useContentStore();
  
  const [view, setView] = useState<'board' | 'list' | 'calendar'>('calendar');
  const [calView, setCalView] = useState<'month' | 'week'>('month');
  const [filter, setFilter] = useState({ col: "", cluster: "", tab: "all", search: "" });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  const filteredData = useMemo(() => {
    return items.filter(d => {
      if (filter.col && d.col !== filter.col) return false;
      if (filter.cluster && d.cluster !== filter.cluster) return false;
      if (filter.tab === "ready" && d.status !== "Script Ready") return false;
      if (filter.tab === "draft" && d.status !== "Draft") return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        if (!d.title.toLowerCase().includes(q) && !d.cname.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [items, filter]);

  const itemCounts = {
    video: items.filter(i => i.col === 'video').length,
    blog: items.filter(i => i.col === 'blog').length,
    social: items.filter(i => i.col === 'social').length,
  };

  if (!initialized) return null; // Or a loading spinner

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-dark selection:bg-cyan/20">
      <Sidebar 
        currentFilter={filter} 
        setFilter={setFilter} 
        currentView={view} 
        setView={setView}
        itemCounts={itemCounts}
        clusters={CLUSTERS}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Topbar 
          currentFilter={filter} 
          setFilter={setFilter} 
          currentView={view} 
          setView={setView}
          onNewIdea={() => setIsNewModalOpen(true)}
        />

        <section className="flex-1 overflow-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {view === 'board' && <BoardView items={filteredData} onCardClick={setSelectedId} />}
              {view === 'list' && <ListView items={filteredData} onCardClick={setSelectedId} />}
              {view === 'calendar' && (
                <CalendarView 
                  items={filteredData} 
                  onCardClick={setSelectedId}
                  calMonth={calMonth}
                  setCalMonth={setCalMonth}
                  calYear={calYear}
                  setCalYear={setCalYear}
                  calView={calView}
                  setCalView={setCalView}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <DetailPanel 
        selectedId={selectedId} 
        items={items} 
        onClose={() => setSelectedId(null)} 
        onDelete={deleteItem}
      />

      <NewIdeaModal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)} 
        onAdd={addItem} 
      />
    </div>
  );
}
