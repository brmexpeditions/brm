import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CompanySettings, Motorcycle, ServiceRecord } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface SupabaseFleetData {
  motorcycles: Motorcycle[];
  serviceRecords: ServiceRecord[];
  savedMakes: string[];
  savedModels: Record<string, string[]>;
  companySettings: CompanySettings;
  lastBackup?: string;
}

const STORAGE_KEY = "motorcycle_fleet_data";

// We store a single row per user in table: public.fleet_store
// columns: user_id uuid (pk), data jsonb, updated_at timestamptz
const TABLE = "fleet_store";

export function useSupabaseFleet(defaultData: SupabaseFleetData) {
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [data, setData] = useState<SupabaseFleetData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const loadFromLocal = useCallback((): SupabaseFleetData => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultData;
      const parsed = JSON.parse(raw);
      return {
        ...defaultData,
        ...parsed,
        motorcycles: Array.isArray(parsed.motorcycles) ? parsed.motorcycles : [],
        serviceRecords: Array.isArray(parsed.serviceRecords) ? parsed.serviceRecords : [],
        savedMakes: Array.isArray(parsed.savedMakes) ? parsed.savedMakes : defaultData.savedMakes,
        savedModels: parsed.savedModels || defaultData.savedModels,
        companySettings: { ...defaultData.companySettings, ...parsed.companySettings },
      };
    } catch {
      return defaultData;
    }
  }, [defaultData]);

  const saveToLocal = useCallback((next: SupabaseFleetData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  // Track auth
  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsOnline(configured);

    if (!configured || !supabase) {
      setSessionUserId(null);
      setIsLoading(false);
      setData(loadFromLocal());
      return;
    }

    let cancelled = false;

    (async () => {
      const { data: sessData } = await supabase.auth.getSession();
      if (cancelled) return;
      setSessionUserId(sessData.session?.user?.id ?? null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUserId(session?.user?.id ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [loadFromLocal]);

  // Load fleet data when user changes
  useEffect(() => {
    const configured = isSupabaseConfigured();

    // Always load local first for instant UI
    const local = loadFromLocal();
    setData(local);

    if (!configured || !supabase || !sessionUserId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      const { data: row, error: e } = await supabase
        .from(TABLE)
        .select("data, updated_at")
        .eq("user_id", sessionUserId)
        .maybeSingle();

      if (cancelled) return;

      if (e) {
        setError(e.message);
        setIsLoading(false);
        return;
      }

      if (row?.data) {
        const remote = {
          ...defaultData,
          ...(row.data as Partial<SupabaseFleetData>),
        } as SupabaseFleetData;

        // normalize
        remote.motorcycles = Array.isArray(remote.motorcycles) ? remote.motorcycles : [];
        remote.serviceRecords = Array.isArray(remote.serviceRecords) ? remote.serviceRecords : [];
        remote.savedMakes = Array.isArray(remote.savedMakes) ? remote.savedMakes : defaultData.savedMakes;
        remote.savedModels = remote.savedModels || defaultData.savedModels;
        remote.companySettings = { ...defaultData.companySettings, ...remote.companySettings };

        setData(remote);
        saveToLocal(remote);
        setLastSynced(row.updated_at ? new Date(row.updated_at) : new Date());
      } else {
        // No remote row yet: create it from local
        const { error: upErr } = await supabase
          .from(TABLE)
          .upsert({ user_id: sessionUserId, data: local }, { onConflict: "user_id" });

        if (upErr) {
          setError(upErr.message);
        } else {
          setLastSynced(new Date());
        }
      }

      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [defaultData, loadFromLocal, saveToLocal, sessionUserId]);

  const save = useCallback(
    (updater: (prev: SupabaseFleetData) => SupabaseFleetData) => {
      setData((prev) => {
        const next = updater(prev);
        saveToLocal(next);

        // async remote sync
        if (isSupabaseConfigured() && supabase && sessionUserId) {
          supabase
            .from(TABLE)
            .upsert({ user_id: sessionUserId, data: next }, { onConflict: "user_id" })
            .then(({ error: e }) => {
              if (e) setError(e.message);
              else {
                setError(null);
                setLastSynced(new Date());
              }
            });
        }

        return next;
      });
    },
    [saveToLocal, sessionUserId]
  );

  return useMemo(
    () => ({
      data,
      setData: save,
      isLoading,
      isOnline,
      error,
      lastSynced,
      sessionUserId,
    }),
    [data, save, isLoading, isOnline, error, lastSynced, sessionUserId]
  );
}
