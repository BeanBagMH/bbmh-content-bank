import { useState, useEffect, useCallback } from 'react';
import type { ContentItem, Idea, Campaign, Thumbnail } from '../types';
import { db, supabase } from '../lib/supabase';

export function useContentStore() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentProfile, setCurrentProfile] = useState<any>(null);

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
      
      // Fetch current profile (mocking with a default email for now or using auth if available)
      const profile = await db.getProfile('murphypatel11@gmail.com');
      setCurrentProfile(profile);
      
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

    // --- Realtime Subscription Safety Shield ---
    if (!supabase) return;

    // --- Realtime Subscription (Infinite Stability Pattern) ---
    const channelId = `db-sync-${Math.random().toString(36).slice(2, 9)}`;
    const channel = supabase.channel(channelId);
    
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'thumbnails' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  const updateIdea = async (id: string, updates: Partial<Idea>) => {
    try {
      const updatedIdea = await db.updateIdea(id, updates);
      setIdeas(prev => prev.map(idea => idea.id === id ? updatedIdea : idea));
      return updatedIdea;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteIdea = async (id: string) => {
    try {
      await db.deleteIdea(id);
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const convertIdeaToContent = async (idea: Idea) => {
    try {
      const newItem = await db.convertIdeaToContent(idea);
      setItems(prev => [newItem, ...prev]);
      setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, status: 'Converted', converted_to_content_id: newItem.id } : i));
      return newItem;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // --- Campaign Actions ---
  const addCampaign = async (campaign: Partial<Campaign>) => {
    try {
      const newCampaign = await db.addCampaign(campaign);
      setCampaigns(prev => [newCampaign, ...prev]);
      return newCampaign;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      const updatedCampaign = await db.updateCampaign(id, updates);
      setCampaigns(prev => prev.map(c => c.id === id ? updatedCampaign : c));
      return updatedCampaign;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      await db.deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // --- Thumbnail Actions ---
  const addThumbnail = async (thumbnail: Partial<Thumbnail>) => {
    try {
      const newThumbnail = await db.addThumbnail(thumbnail);
      setThumbnails(prev => [newThumbnail, ...prev]);
      return newThumbnail;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateThumbnail = async (id: string, updates: Partial<Thumbnail>) => {
    try {
      const updatedThumbnail = await db.updateThumbnail(id, updates);
      setThumbnails(prev => prev.map(t => t.id === id ? updatedThumbnail : t));
      return updatedThumbnail;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteThumbnail = async (id: string) => {
    try {
      await db.deleteThumbnail(id);
      setThumbnails(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (id: string, updates: any) => {
    try {
      const updatedProfile = await db.updateProfile(id, updates);
      setCurrentProfile(updatedProfile);
      return updatedProfile;
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
    updateIdea,
    deleteIdea,
    convertIdeaToContent,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addThumbnail,
    updateThumbnail,
    deleteThumbnail,
    updateProfile,
    currentProfile,
    initialized,
    loading,
    error,
    refresh: fetchData
  };
}
