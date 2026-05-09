import { useState, useEffect, useCallback } from 'react';
import type { ContentItem, Idea, Campaign, ThumbnailAsset } from '../types';
import { db, supabase } from '../lib/supabase';

export function useContentStore() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [thumbnails, setThumbnails] = useState<ThumbnailAsset[]>([]);
  
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [socialProfile, setSocialProfile] = useState<any>(null);

  const fetchData = useCallback(async (userEmail?: string) => {
    setLoading(true);
    try {
      const [itemsData, ideasData, campaignsData, thumbnailsData] = await Promise.all([
        db.getItems(),
        db.getIdeas().catch(() => []),
        db.getCampaigns().catch(() => []),
        db.getThumbnailAssets().catch(() => [])
      ]);
      
      setItems(itemsData);
      setIdeas(ideasData);
      setCampaigns(campaignsData);
      setThumbnails(thumbnailsData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const [profile, social] = await Promise.all([
          db.getProfile(user.email || ''),
          db.getSocialProfile(user.id).catch(() => null)
        ]);
        setCurrentProfile(profile);
        setSocialProfile(social);
      }
      
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
    // Initial fetch with current user if exists
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      fetchData(session?.user?.email);
    });

    // --- Realtime Subscription Safety Shield ---
    if (!supabase) return;

    // --- Realtime Subscription (Infinite Stability Pattern) ---
    const channelId = `db-sync-${Math.random().toString(36).slice(2, 9)}`;
    const channel = supabase.channel(channelId);
    
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'thumbnail_assets' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_items' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_profiles' }, () => fetchData())
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
    const { id, created_at, updated_at, ...rest } = item;
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
  const addThumbnail = async (thumbnail: Partial<ThumbnailAsset>) => {
    try {
      const newThumbnail = await db.addThumbnailAsset(thumbnail as ThumbnailAsset);
      setThumbnails(prev => [newThumbnail, ...prev]);
      return newThumbnail;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateThumbnail = async (id: string, updates: Partial<ThumbnailAsset>) => {
    try {
      const updatedThumbnail = await db.updateThumbnailAsset(id, updates);
      setThumbnails(prev => prev.map(t => t.id === id ? updatedThumbnail : t));
      return updatedThumbnail;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteThumbnail = async (id: string, imageUrl?: string) => {
    try {
      // 1. If imageUrl exists, try to delete from storage first
      if (imageUrl) {
        try {
          const fileName = imageUrl.split('/').pop();
          if (fileName) {
            await db.deleteFile('thumbnails', fileName);
          }
        } catch (err) {
          console.warn('Storage deletion failed, continuing with DB removal:', err);
        }
      }
      
      // 2. Delete DB record
      await db.deleteThumbnailAsset(id);
      setThumbnails(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const uploadAsset = async (file: File) => {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const publicUrl = await db.uploadFile('thumbnails', fileName, file);
      
      // Ensure we have a valid URL
      if (!publicUrl) throw new Error('Failed to generate public URL');
      
      return publicUrl;
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

  const upsertSocialProfile = async (profile: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required to save profiles');

      const updatedSocial = await db.upsertSocialProfile({
        ...profile,
        user_id: user.id,
        updated_at: new Date().toISOString()
      });
      setSocialProfile(updatedSocial);
      return updatedSocial;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('bbmh_sanctuary_key');
    window.location.reload();
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
    uploadAsset,
    updateProfile,
    upsertSocialProfile,
    logout,
    currentProfile,
    socialProfile,
    initialized,
    loading,
    error,
    refresh: fetchData
  };
}
