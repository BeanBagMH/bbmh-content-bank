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

  // --- Thumbnails ---
  async getThumbnails() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('thumbnails')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Thumbnail[];
  }
};
