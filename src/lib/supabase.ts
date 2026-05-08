import { createClient } from '@supabase/supabase-js';
import type { ContentItem, Idea, Campaign, Thumbnail } from '../types';

const getEnv = (key: string) => import.meta.env[key] || '';

const supabaseUrl = getEnv('VITE_SUPABASE_URL').trim();
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY').trim();

export const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http')
);

let supabaseClient: any = null;

if (isConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error('Supabase init failed:', e);
  }
}

export const supabase = supabaseClient;

export const db = {
  // --- Content Items ---
  async getItems() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as ContentItem[];
  },

  async addItem(item: Partial<ContentItem>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('content_items')
      .insert([item])
      .select();
    
    if (error) throw error;
    return data[0] as ContentItem;
  },

  async updateItem(id: string, updates: Partial<ContentItem>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('content_items')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0] as ContentItem;
  },

  async deleteItem(id: string) {
    if (!supabase) throw new Error('Database not configured');
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // --- Ideas ---
  async getIdeas() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Idea[];
  },

  async addIdea(idea: Partial<Idea>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('ideas')
      .insert([idea])
      .select();
    if (error) throw error;
    return data[0] as Idea;
  },

  async updateIdea(id: string, updates: Partial<Idea>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('ideas')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0] as Idea;
  },

  async deleteIdea(id: string) {
    if (!supabase) throw new Error('Database not configured');
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- Campaigns ---
  async getCampaigns() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Campaign[];
  },

  async addCampaign(campaign: Partial<Campaign>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaign])
      .select();
    if (error) throw error;
    return data[0] as Campaign;
  },

  async updateCampaign(id: string, updates: Partial<Campaign>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0] as Campaign;
  },

  async deleteCampaign(id: string) {
    if (!supabase) throw new Error('Database not configured');
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- Thumbnails ---
  async getThumbnails() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('thumbnails')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Thumbnail[];
  },

  async addThumbnail(thumbnail: Partial<Thumbnail>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('thumbnails')
      .insert([thumbnail])
      .select();
    if (error) throw error;
    return data[0] as Thumbnail;
  },

  async updateThumbnail(id: string, updates: Partial<Thumbnail>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('thumbnails')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0] as Thumbnail;
  },

  async deleteThumbnail(id: string) {
    if (!supabase) throw new Error('Database not configured');
    const { error } = await supabase
      .from('thumbnails')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- Conversion ---
  async convertIdeaToContent(idea: Idea) {
    if (!supabase) throw new Error('Database not configured');
    
    // 1. Create content item
    const { data: contentData, error: contentError } = await supabase
      .from('content_items')
      .insert([{
        title: idea.title,
        notes: idea.note,
        platform: idea.platform,
        content_cluster: idea.content_cluster,
        status: 'Raw Idea'
      }])
      .select();
      
    if (contentError) throw contentError;
    const newItem = contentData[0] as ContentItem;
    
    // 2. Link idea to content
    const { error: ideaError } = await supabase
      .from('ideas')
      .update({ converted_to_content_id: newItem.id, status: 'Converted' })
      .eq('id', idea.id);
      
    if (ideaError) throw ideaError;
    
    return newItem;
  },

  // --- Workspace Settings ---
  async getSettings(key: string) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('workspace_settings')
      .select('value')
      .eq('key', key)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data?.value;
  },

  async updateSettings(key: string, value: any) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('workspace_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() })
      .select();
    if (error) throw error;
    return data[0];
  },

  // --- Profiles (using team_members) ---
  async getProfile(email: string) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateProfile(id: string, updates: any) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  }
};
