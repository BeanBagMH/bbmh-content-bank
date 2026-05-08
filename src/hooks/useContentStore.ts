import { useState, useEffect, useCallback } from 'react';
import type { ContentItem, Idea, Campaign, Thumbnail } from '../types';
import { db } from '../lib/supabase';

export function useContentStore() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsData, ideasData, campaignsData, thumbnailsData] = await Promise.all([
        db.getItems(),
        db.getIdeas().catch(() => []), // Graceful fallback if table doesn't exist yet
        db.getCampaigns().catch(() => []),
        db.getThumbnails().catch(() => [])
      ]);
      
      setItems(itemsData);
      setIdeas(ideasData);
      setCampaigns(campaignsData);
      setThumbnails(thumbnailsData);
      
      setInitialized(true);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Content Item Actions ---
  const addItem = async (item: Partial<ContentItem>) => {
    try {
      const newItem = await db.addItem(item);
      setItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<ContentItem>) => {
    try {
      const updatedItem = await db.updateItem(id, updates);
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await db.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const duplicateItem = async (item: ContentItem) => {
    const { id, created_at, updated_at, last_updated_at, ...rest } = item;
    return addItem({ ...rest, title: `${item.title} (Copy)` });
  };

  // --- Idea Actions ---
  const addIdea = async (idea: Partial<Idea>) => {
    try {
      const newIdea = await db.addIdea(idea);
      setIdeas(prev => [newIdea, ...prev]);
      return newIdea;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    items,
    ideas,
    campaigns,
    thumbnails,
    addItem,
    updateItem,
    deleteItem,
    duplicateItem,
    addIdea,
    initialized,
    loading,
    error,
    refresh: fetchData
  };
}
