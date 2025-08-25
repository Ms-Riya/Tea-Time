import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
  };
}

// Fallback user for offline mode
const fallbackUser: User = {
  id: "demo-user",
  email: "demo@teatime.app",
  user_metadata: { name: "Tea Lover" },
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionMode, setConnectionMode] = useState<'online' | 'offline'>('offline');

  useEffect(() => {
    // Check initial auth state
    checkUser();

    // Set up auth state listener with error handling
    let authSubscription: any = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          
          if (session?.user) {
            setUser(session.user as User);
            setIsAuthenticated(true);
            setConnectionMode('online');
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
          setLoading(false);
        }
      );
      
      authSubscription = data.subscription;
    } catch (error) {
      console.warn('Auth state listener setup failed, using fallback mode:', error);
      // Continue with fallback user in offline mode
      setUser(fallbackUser);
      setIsAuthenticated(true);
      setConnectionMode('offline');
      setLoading(false);
    }

    return () => {
      try {
        authSubscription?.unsubscribe();
      } catch (error) {
        console.warn('Error unsubscribing from auth changes:', error);
      }
    };
  }, []);

  const checkUser = async () => {
    try {
      // Add timeout to prevent hanging
      const authCheck = Promise.race([
        supabase.auth.getUser(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth check timeout')), 3000)
        )
      ]);

      const { data: { user }, error } = await authCheck as any;
      
      if (error) {
        console.warn('Auth check failed, using offline mode:', error.message);
        setUser(fallbackUser);
        setIsAuthenticated(true);
        setConnectionMode('offline');
      } else if (user) {
        setUser(user as User);
        setIsAuthenticated(true);
        setConnectionMode('online');
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setConnectionMode('offline');
      }
    } catch (error) {
      console.warn('Auth check error, using offline mode:', error);
      setUser(fallbackUser);
      setIsAuthenticated(true);
      setConnectionMode('offline');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Add timeout to prevent hanging
      const signInAttempt = Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Sign in timeout')), 5000)
        )
      ]);

      const { data, error } = await signInAttempt as any;

      if (error) {
        throw error;
      }

      setConnectionMode('online');
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // For network errors, provide helpful message
      if (error.message?.includes('Failed to fetch') || 
          error.message?.includes('timeout') ||
          error.name === 'TypeError') {
        return { 
          user: null, 
          error: "Connection issue. Please check your internet and try again." 
        };
      }
      
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      
      // Add timeout to prevent hanging
      const signUpAttempt = Promise.race([
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || 'Tea Lover',
            },
          },
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Sign up timeout')), 5000)
        )
      ]);

      const { data, error } = await signUpAttempt as any;

      if (error) {
        throw error;
      }

      setConnectionMode('online');
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // For network errors, provide helpful message
      if (error.message?.includes('Failed to fetch') || 
          error.message?.includes('timeout') ||
          error.name === 'TypeError') {
        return { 
          user: null, 
          error: "Connection issue. Please check your internet and try again." 
        };
      }
      
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Add timeout to prevent hanging
      const signOutAttempt = Promise.race([
        supabase.auth.signOut(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Sign out timeout')), 3000)
        )
      ]);
      
      await signOutAttempt;
      setConnectionMode('online');
    } catch (error) {
      console.warn('Sign out error (continuing anyway):', error);
      // Even if sign out fails, clear local state
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    connectionMode,
    signIn,
    signUp,
    signOut,
    checkUser,
  };
}
