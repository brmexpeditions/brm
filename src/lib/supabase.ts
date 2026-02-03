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
} catch (e) {
  console.log('⚠️ Supabase not available, using localStorage only');
}

// Helper: Convert camelCase to snake_case for database columns
function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = obj[key];
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
    console.log('🔄 syncToDatabase.tour called');
    console.log('📦 Tour data:', tour);
    
    if (!supabase) {
      console.log('❌ Supabase client is null - cannot sync');
      return;
    }
    
    try {
      const data = toSnakeCase(tour);
      console.log('📤 Sending to database (snake_case):', data);
      
      const { data: result, error } = await supabase
        .from('tours')
        .upsert(data, { onConflict: 'id' })
        .select();
      
      if (error) {
        console.error('❌ Database error:', error.message);
        console.error('❌ Error details:', error.details);
        console.error('❌ Error hint:', error.hint);
        console.error('❌ Error code:', error.code);
      } else {
        console.log('✅ Tour synced to database successfully!');
        console.log('📥 Database response:', result);
      }
    } catch (e: unknown) {
      const error = e as Error;
      console.error('❌ Tour sync exception:', error.message);
    }
  },

  // Sync a destination to database
  destination: async (destination: Record<string, unknown>) => {
    console.log('🔄 syncToDatabase.destination called');
    
    if (!supabase) {
      console.log('❌ Supabase client is null');
      return;
    }
    
    try {
      const data = toSnakeCase(destination);
      console.log('📤 Sending destination:', data);
      
      const { error } = await supabase
        .from('destinations')
        .upsert(data, { onConflict: 'id' });
      
      if (error) {
        console.error('❌ Destination sync error:', error.message, error.hint);
      } else {
        console.log('✅ Destination synced to database');
      }
    } catch (e: unknown) {
      const error = e as Error;
      console.error('❌ Destination sync exception:', error.message);
    }
  },

  // Sync a bike to database
  bike: async (bike: Record<string, unknown>) => {
    console.log('🔄 syncToDatabase.bike called');
    
    if (!supabase) {
      console.log('❌ Supabase client is null');
      return;
    }
    
    try {
      const data = toSnakeCase(bike);
      console.log('📤 Sending bike:', data);
      
      const { error } = await supabase
        .from('bikes')
        .upsert(data, { onConflict: 'id' });
      
      if (error) {
        console.error('❌ Bike sync error:', error.message, error.hint);
      } else {
        console.log('✅ Bike synced to database');
      }
    } catch (e: unknown) {
      const error = e as Error;
      console.error('❌ Bike sync exception:', error.message);
    }
  },

  // Sync a booking to database
  booking: async (booking: Record<string, unknown>) => {
    console.log('🔄 syncToDatabase.booking called');
    
    if (!supabase) return;
    
    try {
      const data = toSnakeCase(booking);
      const { error } = await supabase
        .from('bookings')
        .upsert(data, { onConflict: 'id' });
      
      if (error) {
        console.error('❌ Booking sync error:', error.message);
      } else {
        console.log('✅ Booking synced to database');
      }
    } catch (e: unknown) {
      const error = e as Error;
      console.error('❌ Booking sync exception:', error.message);
    }
  },

  // Sync a page to database
  page: async (page: Record<string, unknown>) => {
    console.log('🔄 syncToDatabase.page called');
    
    if (!supabase) return;
    
    try {
      const data = toSnakeCase(page);
      const { error } = await supabase
        .from('pages')
        .upsert(data, { onConflict: 'id' });
      
      if (error) {
        console.error('❌ Page sync error:', error.message);
      } else {
        console.log('✅ Page synced to database');
      }
    } catch (e: unknown) {
      const error = e as Error;
      console.error('❌ Page sync exception:', error.message);
    }
  },

  // Sync site settings to database
  settings: async (settings: Record<string, unknown>) => {
    console.log('🔄 syncToDatabase.settings called');
    
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'main', settings }, { onConflict: 'id' });
      
      if (error) {
        console.error('❌ Settings sync error:', error.message);
      } else {
        console.log('✅ Settings synced to database');
      }
    } catch (e: unknown) {
      const error = e as Error;
      console.error('❌ Settings sync exception:', error.message);
    }
  },

  // Delete functions
  deleteTour: async (id: string) => {
    console.log('🔄 syncToDatabase.deleteTour called:', id);
    if (!supabase) return;
    try {
      const { error } = await supabase.from('tours').delete().eq('id', id);
      if (error) {
        console.error('❌ Tour delete error:', error.message);
      } else {
        console.log('✅ Tour deleted from database');
      }
    } catch (e: unknown) {
      const error = e as Error;
      console.error('❌ Delete exception:', error.message);
    }
  },

  deleteDestination: async (id: string) => {
    console.log('🔄 syncToDatabase.deleteDestination called:', id);
    if (!supabase) return;
    try {
      const { error } = await supabase.from('destinations').delete().eq('id', id);
      if (error) console.error('❌ Destination delete error:', error.message);
      else console.log('✅ Destination deleted from database');
    } catch (e: unknown) {
      const error = e as Error;
      console.error('❌ Delete exception:', error.message);
    }
  },

  deleteBike: async (id: string) => {
    console.log('🔄 syncToDatabase.deleteBike called:', id);
    if (!supabase) return;
    try {
      const { error } = await supabase.from('bikes').delete().eq('id', id);
      if (error) console.error('❌ Bike delete error:', error.message);
      else console.log('✅ Bike deleted from database');
    } catch (e: unknown) {
      const error = e as Error;
      console.error('❌ Delete exception:', error.message);
    }
  },

  deletePage: async (id: string) => {
    console.log('🔄 syncToDatabase.deletePage called:', id);
    if (!supabase) return;
    try {
      const { error } = await supabase.from('pages').delete().eq('id', id);
      if (error) console.error('❌ Page delete error:', error.message);
      else console.log('✅ Page deleted from database');
    } catch (e: unknown) {
      const error = e as Error;
      console.error('❌ Delete exception:', error.message);
    }
  }
};

// ============================================
// TEST CONNECTION (for Database Status page)
// ============================================
export async function testConnection(): Promise<{
  connected: boolean;
  tables: { name: string; count: number; status: 'ok' | 'error'; error?: string }[];
}> {
  console.log('🔍 Testing Supabase connection...');
  
  if (!supabase) {
    console.log('❌ Supabase client is null');
    return { connected: false, tables: [] };
  }

  const tables = ['tours', 'destinations', 'bikes', 'bookings', 'pages', 'site_settings', 'media'];
  const results: { name: string; count: number; status: 'ok' | 'error'; error?: string }[] = [];

  for (const table of tables) {
    try {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`❌ Table ${table}: ${error.message}`);
        results.push({ name: table, count: 0, status: 'error', error: error.message });
      } else {
        console.log(`✅ Table ${table}: ${count} rows`);
        results.push({ name: table, count: count || 0, status: 'ok' });
      }
    } catch (e: unknown) {
      const error = e as Error;
      console.log(`❌ Table ${table}: ${error.message}`);
      results.push({ name: table, count: 0, status: 'error', error: error.message });
    }
  }

  const connected = results.some(r => r.status === 'ok');
  console.log(`📊 Connection test complete. Connected: ${connected}`);
  return { connected, tables: results };
}

// Check if Supabase is available
export function isSupabaseAvailable(): boolean {
  return supabase !== null;
}
