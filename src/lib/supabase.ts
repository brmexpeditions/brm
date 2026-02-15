// Supabase Configuration - Safe Background Sync
// This file ONLY does background syncing - won't crash the site

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Your Supabase credentials
const SUPABASE_URL = 'https://khidecfioxjgwspwcwer.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoaWRlY2Zpb3hqZ3dzcHdjd2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDU3NzUsImV4cCI6MjA4NTY4MTc3NX0.2qnrst53yk4g2AKeYBUpi4vVbXqi77F835PnT67SUYo';

// Create client (safe - won't throw)
let supabase: SupabaseClient | null = null;

try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Supabase client initialized');
} catch {
  console.log('⚠️ Supabase not available, using localStorage only');
}

// Helper: Clean value for database (convert empty strings to null)
function cleanValue(value: unknown, key: string): unknown {
  // If undefined or null, return null
  if (value === undefined || value === null) return null;

  // If empty string, return null (especially important for date fields)
  if (value === '') return null;

  // Date fields need special handling
  const dateFields = ['next_departure', 'nextDeparture', 'created_at', 'updated_at', 'createdAt', 'updatedAt'];
  if (dateFields.includes(key)) {
    if (!value || value === '' || value === 'Invalid Date') return null;
    // If it's a valid date string, return just the date part
    if (typeof value === 'string') {
      if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
        return value.split('T')[0];
      }
      // Try to parse it
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return null;
        return date.toISOString().split('T')[0];
      } catch {
        return null;
      }
    }
  }

  return value;
}

// Helper: Convert camelCase to snake_case for database columns
function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      // Clean the value before adding
      result[snakeKey] = cleanValue(obj[key], snakeKey);
    }
  }
  return result;
}

// Helper: Convert snake_case to camelCase
function toCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = obj[key];
    }
  }
  return result;
}

// ============================================
// BACKGROUND SYNC FUNCTIONS
// These run in background and never throw errors
// ============================================

export const syncToDatabase = {
  // Sync a tour to database (background, safe)
  tour: async (tour: Record<string, unknown>) => {
    if (!supabase) return;
    try {
      const data = toSnakeCase(tour);
      const { error } = await supabase.from('tours').upsert(data, { onConflict: 'id' });
      if (error) console.error('Tour sync error:', error.message);
      else console.log('✅ Tour synced');
    } catch { /* ignore */ }
  },

  destination: async (destination: Record<string, unknown>) => {
    if (!supabase) return;
    try {
      const data = toSnakeCase(destination);
      const { error } = await supabase.from('destinations').upsert(data, { onConflict: 'id' });
      if (error) console.error('Destination sync error:', error.message);
      else console.log('✅ Destination synced');
    } catch { /* ignore */ }
  },

  bike: async (bike: Record<string, unknown>) => {
    if (!supabase) return;
    try {
      const data = toSnakeCase(bike);
      const { error } = await supabase.from('bikes').upsert(data, { onConflict: 'id' });
      if (error) console.error('Bike sync error:', error.message);
      else console.log('✅ Bike synced');
    } catch { /* ignore */ }
  },

  booking: async (booking: Record<string, unknown>) => {
    if (!supabase) return;
    try {
      const data = toSnakeCase(booking);
      const { error } = await supabase.from('bookings').upsert(data, { onConflict: 'id' });
      if (error) console.error('Booking sync error:', error.message);
      else console.log('✅ Booking synced');
    } catch { /* ignore */ }
  },

  page: async (page: Record<string, unknown>) => {
    if (!supabase) return;
    try {
      const data = toSnakeCase(page);
      const { error } = await supabase.from('pages').upsert(data, { onConflict: 'id' });
      if (error) console.error('Page sync error:', error.message);
      else console.log('✅ Page synced');
    } catch { /* ignore */ }
  },

  settings: async (settings: Record<string, unknown>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('site_settings').upsert({ id: 'main', settings }, { onConflict: 'id' });
      if (error) console.error('Settings sync error:', error.message);
      else console.log('✅ Settings synced');
    } catch { /* ignore */ }
  },

  deleteTour: async (id: string) => {
    if (!supabase) return;
    try {
      await supabase.from('tours').delete().eq('id', id);
      console.log('✅ Tour deleted from database');
    } catch { /* ignore */ }
  },

  deleteDestination: async (id: string) => {
    if (!supabase) return;
    try {
      await supabase.from('destinations').delete().eq('id', id);
    } catch { /* ignore */ }
  },

  deleteBike: async (id: string) => {
    if (!supabase) return;
    try {
      await supabase.from('bikes').delete().eq('id', id);
    } catch { /* ignore */ }
  },

  deletePage: async (id: string) => {
    if (!supabase) return;
    try {
      await supabase.from('pages').delete().eq('id', id);
    } catch { /* ignore */ }
  },

  post: async (post: Record<string, unknown>) => {
    if (!supabase) return;
    try {
      const data = toSnakeCase(post);
      const { error } = await supabase.from('posts').upsert(data, { onConflict: 'id' });
      if (error) console.error('Post sync error:', error.message);
      else console.log('✅ Post synced');
    } catch { /* ignore */ }
  },

  deletePost: async (id: string) => {
    if (!supabase) return;
    try {
      await supabase.from('posts').delete().eq('id', id);
      console.log('✅ Post deleted from database');
    } catch { /* ignore */ }
  }
};

// Check if Supabase is available
export function isSupabaseAvailable(): boolean {
  return supabase !== null;
}

// Load data from database (safe - returns null on any error)
export async function loadFromDatabase(): Promise<{
  tours: unknown[];
  destinations: unknown[];
  bikes: unknown[];
  bookings: unknown[];
  pages: unknown[];
  posts: unknown[];
  siteSettings: unknown | null;
  media: unknown[];
} | null> {
  if (!supabase) return null;

  try {
    const result: {
      tours: unknown[];
      destinations: unknown[];
      bikes: unknown[];
      bookings: unknown[];
      pages: unknown[];
      posts: unknown[];
      siteSettings: unknown | null;
      media: unknown[];
    } = {
      tours: [],
      destinations: [],
      bikes: [],
      bookings: [],
      pages: [],
      posts: [],
      siteSettings: null,
      media: []
    };

    // Load tours
    try {
      const { data } = await supabase.from('tours').select('*').order('created_at', { ascending: false });
      if (data) result.tours = data.map(t => toCamelCase(t as Record<string, unknown>));
    } catch { /* ignore */ }

    // Load destinations
    try {
      const { data } = await supabase.from('destinations').select('*').order('created_at', { ascending: false });
      if (data) result.destinations = data.map(d => toCamelCase(d as Record<string, unknown>));
    } catch { /* ignore */ }

    // Load bikes
    try {
      const { data } = await supabase.from('bikes').select('*').order('created_at', { ascending: false });
      if (data) result.bikes = data.map(b => toCamelCase(b as Record<string, unknown>));
    } catch { /* ignore */ }

    // Load bookings
    try {
      const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (data) result.bookings = data.map(b => toCamelCase(b as Record<string, unknown>));
    } catch { /* ignore */ }

    // Load pages
    try {
      const { data } = await supabase.from('pages').select('*').order('created_at', { ascending: false });
      if (data) result.pages = data.map(p => toCamelCase(p as Record<string, unknown>));
    } catch { /* ignore */ }

    // Load posts
    try {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (data) result.posts = data.map(p => toCamelCase(p as Record<string, unknown>));
    } catch { /* ignore */ }

    // Load settings
    try {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 'main').single();
      if (data?.settings) result.siteSettings = data.settings;
    } catch { /* ignore */ }

    // Load media
    try {
      const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      if (data) result.media = data.map(m => toCamelCase(m as Record<string, unknown>));
    } catch { /* ignore */ }

    console.log(`✅ Loaded: ${result.tours.length} tours, ${result.destinations.length} destinations`);
    return result;
  } catch {
    return null;
  }
}

// Test connection (for admin status page)
export async function testConnection(): Promise<{
  connected: boolean;
  tables: { name: string; count: number; status: 'ok' | 'error' }[];
}> {
  if (!supabase) return { connected: false, tables: [] };

  const tables = ['tours', 'destinations', 'bikes', 'bookings', 'pages', 'posts', 'site_settings', 'media'];
  const results: { name: string; count: number; status: 'ok' | 'error' }[] = [];

  for (const table of tables) {
    try {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      results.push({ name: table, count: count || 0, status: error ? 'error' : 'ok' });
    } catch {
      results.push({ name: table, count: 0, status: 'error' });
    }
  }

  return { connected: results.some(r => r.status === 'ok'), tables: results };
}
