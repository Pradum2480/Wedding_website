import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient, getSupabaseConfig } from '../services/supabase';
import { User, Session } from '@supabase/supabase-js';

const STORAGE_ADMIN_EMAIL = 'wedding_admin_email';
const STORAGE_ADMIN_PASSWORD = 'wedding_admin_password';
const DEMO_ADMIN_KEY = 'wedding_demo_admin_active';

export const getMasterCredentials = () => {
  const envEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').trim();
  const envPassword = (import.meta.env.VITE_ADMIN_PASSWORD || '').trim();

  const customEmail = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_ADMIN_EMAIL) || '').trim() : '';
  const customPassword = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_ADMIN_PASSWORD) || '').trim() : '';

  const email = customEmail || envEmail || 'admin@wedding.royal';
  const password = customPassword || envPassword || 'RoyalGold2026!';

  return { email, password };
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isDemoMode: boolean;
  adminEmail: string;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  isDemoMode: false,
  adminEmail: '',
  signIn: async () => ({ success: false }),
  signOut: async () => {},
  changePassword: async () => ({ success: false }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoAdmin, setIsDemoAdmin] = useState(false);

  const client = getSupabaseClient();

  useEffect(() => {
    let mounted = true;

    // Check demo/master admin session in localStorage
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

  const isMasterCredential = (em: string, pw: string) => {
    const { email: masterEmail, password: masterPassword } = getMasterCredentials();
    return (
      em.trim().toLowerCase() === masterEmail.toLowerCase() &&
      pw.trim() === masterPassword
    );
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    // 1. If Supabase is connected, attempt Supabase Auth first
    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

        if (!error && data?.user) {
          setUser(data.user);
          setSession(data.session);
          setIsDemoAdmin(false);
          if (typeof window !== 'undefined') localStorage.removeItem(DEMO_ADMIN_KEY);
          return { success: true };
        }
      } catch (err) {
        // Fall through to master credential check if Supabase Auth throws
      }
    }

    // 2. Fallback check for designated administrator master credentials
    if (isMasterCredential(cleanEmail, cleanPassword)) {
      setIsDemoAdmin(true);
      if (typeof window !== 'undefined') localStorage.setItem(DEMO_ADMIN_KEY, 'true');
      return { success: true };
    }

    // Generic, non-leaking security error message
    return { 
      success: false, 
      error: 'Invalid administrator email or password.' 
    };
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    // If logged in via Supabase Auth
    if (client && user) {
      try {
        const { error } = await client.auth.updateUser({ password: newPassword.trim() });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to update password.' };
      }
    }

    // If logged in via master admin credentials
    const { password: masterPassword } = getMasterCredentials();
    if (currentPassword.trim() !== masterPassword) {
      return { success: false, error: 'Current password does not match.' };
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_ADMIN_PASSWORD, newPassword.trim());
    }
    return { success: true };
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
  const adminEmail = user?.email || getMasterCredentials().email;

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isAdmin, 
      isDemoMode, 
      adminEmail, 
      signIn, 
      signOut, 
      changePassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
