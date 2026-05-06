import { useState, useEffect } from 'react';
import type { ContentItem } from '../types';
import { DATA } from '../data/mockData';

const STORAGE_KEY = 'bbmh_content_bank_data';

export function useContentStore() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored data', e);
        setItems(DATA);
      }
    } else {
      setItems(DATA);
    }
    setInitialized(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, initialized]);

  const addItem = (item: Omit<ContentItem, 'id'>) => {
    const newItem: ContentItem = {
      ...item,
      id: Math.max(0, ...items.map(i => i.id)) + 1,
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: number, updates: Partial<ContentItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteItem = (id: number) => {
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
