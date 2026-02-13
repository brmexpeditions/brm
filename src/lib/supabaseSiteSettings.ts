import type { SiteSettings } from '../components/AdminPanel';
import { assertSupabase, isSupabaseConfigured } from './supabase';

const TABLE = 'site_settings';
const KEY = 'public';

export async function loadPublicSiteSettings(): Promise<SiteSettings | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = assertSupabase();

  const { data, error } = await supabase
    .from(TABLE)
    .select('settings')
    .eq('key', KEY)
    .maybeSingle();

  if (error) throw error;
  return (data?.settings as SiteSettings) || null;
}

export async function savePublicSiteSettings(settings: SiteSettings): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const supabase = assertSupabase();

  const { error } = await supabase
    .from(TABLE)
    .upsert({ key: KEY, settings }, { onConflict: 'key' });

  if (error) throw error;
}
