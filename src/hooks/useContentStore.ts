import { useState, useEffect, useCallback } from 'react';
import type { ContentItem } from '../types';
import { DATA } from '../data/mockData';
import { teable } from '../lib/teable';

export function useContentStore() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Sync with Teable-like local storage
  const sync = useCallback(async () => {
    const rows = await teable.getRows();
    if (rows.length === 0 && !localStorage.getItem('bbmh_initialized')) {
      // First time initialization with mock data
      const initialRows = await Promise.all(DATA.map((item: ContentItem) => teable.createRow(item)));
      setItems(initialRows);
      localStorage.setItem('bbmh_initialized', 'true');
    } else {
      setItems(rows);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    sync();
  }, [sync]);

  const addItem = async (item: Omit<ContentItem, 'id'>) => {
    const newRow = await teable.createRow(item);
    setItems(prev => [...prev, newRow]);
  };

  const updateItem = async (id: number, updates: Partial<ContentItem>) => {
    const updatedRow = await teable.updateRow(id, updates);
    setItems(prev => prev.map(item => item.id === id ? updatedRow : item));
  };

  const deleteItem = async (id: number) => {
    await teable.deleteRow(id);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    initialized
  };
}
