// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import type { 
  ContentSource, 
  ContentScript, 
  ContentCalendarPost, 
  PublishingFlowStage, 
  ContentAsset, 
  ContentPlatformPush,
  Campaign 
} from '../types';
import { db, supabase } from '../lib/supabase';

export function useContentStore() {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [scripts, setScripts] = useState<ContentScript[]>([]);
  const [calendarPosts, setCalendarPosts] = useState<ContentCalendarPost[]>([]);
  const [publishingFlow, setPublishingFlow] = useState<PublishingFlowStage[]>([]);
  
  // Legacy stubs
  const [items, setItems] = useState<any[]>([]);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  
  // To preserve profile functionality
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [socialProfile, setSocialProfile] = useState<any>(null);
  
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sourcesData, scriptsData, calendarData, flowData] = await Promise.all([
        db.getSources().catch(() => []),
        db.getScripts().catch(() => []),
        db.getCalendarPosts().catch(() => []),
        db.getPublishingFlow().catch(() => [])
      ]);
      
      setSources(sourcesData);
      setScripts(scriptsData);
      setCalendarPosts(calendarData);
      setPublishingFlow(flowData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Assume profiles are loaded similarly if needed
        // For now, ignore full profile fetch safely
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
    supabase.auth.getSession().then(() => {
      fetchData();
    });

    if (!supabase) return;

    const channelId = `db-sync-${Math.random().toString(36).slice(2, 9)}`;
    const channel = supabase.channel(channelId);
    
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_scripts' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_calendar_posts' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_publishing_flow' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  const updateScript = async (id: string, updates: Partial<ContentScript>) => {
    try {
      const updatedScript = await db.updateScript(id, updates);
      setScripts(prev => prev.map(s => s.id === id ? updatedScript : s));
      return updatedScript;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateCalendarPost = async (id: string, updates: Partial<ContentCalendarPost>) => {
    try {
      const updatedPost = await db.updateCalendarPost(id, updates);
      setCalendarPosts(prev => prev.map(p => p.id === id ? { ...p, ...updatedPost } : p));
      return updatedPost;
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
    sources,
    scripts,
    calendarPosts,
    publishingFlow,
    items,
    ideas,
    thumbnails,
    campaigns, // stubbed for compatibility
    updateScript,
    updateCalendarPost,
    addItem: async () => {},
    updateItem: async () => {},
    deleteItem: async () => {},
    duplicateItem: async () => {},
    addIdea: async () => {},
    updateIdea: async () => {},
    deleteIdea: async () => {},
    convertIdeaToContent: async () => {},
    addCampaign: async () => {},
    updateCampaign: async () => {},
    deleteCampaign: async () => {},
    addThumbnail: async () => {},
    updateThumbnail: async () => {},
    deleteThumbnail: async () => {},
    uploadAsset: async () => {},
    updateProfile: async () => {},
    upsertSocialProfile: async () => {},
    currentProfile,
    socialProfile,
    logout,
    initialized,
    loading,
    error,
    refresh: fetchData
  };
}
