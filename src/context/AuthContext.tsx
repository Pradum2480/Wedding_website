import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient, getSupabaseConfig } from '../services/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  isDemoMode: false,
  signIn: async () => ({ success: false }),
  signOut: async () => {},
});

const DEMO_ADMIN_KEY = 'wedding_demo_admin_active';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoAdmin, setIsDemoAdmin] = useState(false);

  const config = getSupabaseConfig();
  const client = getSupabaseClient();

  useEffect(() => {
    let mounted = true;

    // Check demo admin session in localStorage
    if (typeof window !== 'undefined' && localStorage.getItem(DEMO_ADMIN_KEY) === 'true') {
      setIsDemoAdmin(true);
    }

    if (!client) {
      setLoading(false);
      return;
    }

    // Get initial Supabase session
    client.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    }).catch(err => {
      console.warn('Supabase auth getSession error:', err);
      if (mounted) setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [client]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // 1. If Supabase is connected, attempt Supabase Auth
    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (error) {
          // If Supabase user not found or invalid, check demo fallback
          if (email.toLowerCase() === 'admin@wedding.royal' && password === 'RoyalGold2026!') {
            setIsDemoAdmin(true);
            if (typeof window !== 'undefined') localStorage.setItem(DEMO_ADMIN_KEY, 'true');
            return { success: true };
          }
          return { success: false, error: error.message };
        }

        setUser(data.user);
        setSession(data.session);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Authentication failed' };
      }
    }

    // 2. Demo mode fallback when Supabase is not yet configured
    if (email.toLowerCase() === 'admin@wedding.royal' && password === 'RoyalGold2026!') {
      setIsDemoAdmin(true);
      if (typeof window !== 'undefined') localStorage.setItem(DEMO_ADMIN_KEY, 'true');
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. For initial testing, use email: admin@wedding.royal and password: RoyalGold2026!'
    };
  };

  const signOut = async () => {
    if (client) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    setUser(null);
    setSession(null);
    setIsDemoAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_ADMIN_KEY);
    }
  };

  const isAdmin = !!user || isDemoAdmin;
  const isDemoMode = !client || isDemoAdmin;

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, isDemoMode, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
