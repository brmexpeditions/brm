import type { Motorcycle, ServiceRecord, CompanySettings } from '../types';
import { assertSupabase, isSupabaseConfigured } from './supabase';

export type FleetStoreData = {
  motorcycles: Motorcycle[];
  serviceRecords: ServiceRecord[];
  savedMakes: string[];
  savedModels: { [make: string]: string[] };
  companySettings: CompanySettings;
  lastBackup?: string;
};

const TABLE = 'fleet_store';

export async function loadFleetForCurrentUser(): Promise<FleetStoreData | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = assertSupabase();

  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData.session?.user?.id;
  if (!uid) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .select('data')
    .eq('user_id', uid)
    .maybeSingle();

  if (error) throw error;
  return (data?.data as FleetStoreData) || null;
}

export async function saveFleetForCurrentUser(data: FleetStoreData): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = assertSupabase();

  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData.session?.user?.id;
  if (!uid) return;

  const { error } = await supabase
    .from(TABLE)
    .upsert({ user_id: uid, data }, { onConflict: 'user_id' });

  if (error) throw error;
}
