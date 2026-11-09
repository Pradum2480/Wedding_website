import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Storage keys for runtime configuration overrides
const STORAGE_KEY_URL = 'wedding_supabase_url';
const STORAGE_KEY_KEY = 'wedding_supabase_anon_key';

// Production Supabase Project credentials (anon / publishable public key protected by PostgreSQL RLS)
export const DEFAULT_SUPABASE_URL = 'https://nxojnptnbhpgfjotebwx.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_0QNgtjylNEyoEImO2tfU5A_4fqf4X23';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: 'env' | 'storage' | 'default' | 'none';
}

const cleanUrl = (url: string | undefined): string => {
  if (!url) return '';
  return url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
};

export const getSupabaseConfig = (): SupabaseConfig => {
  const envUrl = cleanUrl(import.meta.env.VITE_SUPABASE_URL);
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
  
  const storedUrl = typeof window !== 'undefined' ? cleanUrl(localStorage.getItem(STORAGE_KEY_URL) || '') : '';
  const storedKey = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEY_KEY) || '').trim() : '';

  // 1. Runtime override in localStorage (if set via admin settings)
  if (storedUrl && storedKey && !storedUrl.includes('your-project-id')) {
    return {
      url: storedUrl,
      anonKey: storedKey,
      isConfigured: true,
      source: 'storage'
    };
  }

  // 2. Build-time environment variables
  if (envUrl && envKey && !envUrl.includes('your-project-id')) {
    return {
      url: envUrl,
      anonKey: envKey,
      isConfigured: true,
      source: 'env'
    };
  }

  // 3. Official production Supabase instance default (ensures public website always connects even without .env)
  if (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_ANON_KEY) {
    return {
      url: DEFAULT_SUPABASE_URL,
      anonKey: DEFAULT_SUPABASE_ANON_KEY,
      isConfigured: true,
      source: 'default'
    };
  }

  return {
    url: '',
    anonKey: '',
    isConfigured: false,
    source: 'none'
  };
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_URL, cleanUrl(url));
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  }
};

export const clearSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
  }
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSupabaseConfig();
  if (!config.isConfigured || !config.url || !config.anonKey) {
    return null;
  }

  try {
    if (!supabaseInstance) {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        global: {
          headers: {
            'x-client-info': 'royal-wedding-web',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          }
        }
      });
    }
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const resetSupabaseClient = () => {
  supabaseInstance = null;
};

export const testSupabaseConnection = async (testUrl?: string, testKey?: string): Promise<{ success: boolean; message: string }> => {
  const url = testUrl || getSupabaseConfig().url;
  const key = testKey || getSupabaseConfig().anonKey;

  if (!url || !key) {
    return {
      success: false,
      message: 'Supabase URL and Anon Key are missing.'
    };
  }

  try {
    const client = createClient(url, key);
    const { data, error } = await client
      .from('wedding_settings')
      .select('id, wedding_title')
      .limit(1);

    if (error) {
      // Check if table missing vs network
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Connected to Supabase successfully, but database tables are not created yet. Please execute the schema.sql in Supabase SQL Editor.'
        };
      }
      return {
        success: false,
        message: `Database query returned error: ${error.message} (${error.code || 'unknown'})`
      };
    }

    return {
      success: true,
      message: 'Connected successfully to Supabase! Database is live and ready.'
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection failed: ${err.message || 'Unknown network error'}`
    };
  }
};
