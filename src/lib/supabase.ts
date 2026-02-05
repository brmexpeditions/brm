import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const supabaseUrl = rawUrl?.trim().replace(/\/+$/, "");
const supabaseAnonKey = rawAnonKey?.trim();

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      supabaseUrl.startsWith("http") &&
      supabaseAnonKey.length > 20
  );
};

export function getSupabaseDiagnostics() {
  const urlOk = Boolean(supabaseUrl);
  const keyOk = Boolean(supabaseAnonKey);
  const maskedKey = supabaseAnonKey
    ? `${supabaseAnonKey.slice(0, 6)}…${supabaseAnonKey.slice(-6)}`
    : "(missing)";

  let host = "";
  try {
    host = supabaseUrl ? new URL(supabaseUrl).host : "";
  } catch {
    host = "";
  }

  return {
    configured: isSupabaseConfigured(),
    urlOk,
    keyOk,
    host,
    maskedKey,
  };
}

export async function supabaseHealthCheck(): Promise<{
  ok: boolean;
  status?: number;
  body?: string;
  error?: string;
}> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { ok: false, error: "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY" };
  }

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    const text = await res.text();
    return { ok: res.ok, status: res.status, body: text };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Network error" };
  }
}

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "fleet_manager_auth",
      },
    })
  : null;
