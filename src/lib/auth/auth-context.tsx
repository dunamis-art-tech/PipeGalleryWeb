'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, startTransition } from 'react';
import { authService, type AuthUser } from './auth-service';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: string | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false); // Start as not loading

  // Initialize auth state on mount using startTransition to prevent suspense
  useEffect(() => {
    // Completely non-blocking auth initialization
    const initializeAuth = () => {
      // Set a small timeout to avoid blocking the initial render
      setTimeout(async () => {
        try {
          const currentUser = await authService.getCurrentUser();
          startTransition(() => {
            setUser(currentUser);
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Silently fail, don't block UI
        }
      }, 100);
    };

    initializeAuth();

    // Listen for auth changes (also non-blocking)
    setTimeout(async () => {
      try {
        const { data: { subscription } } = authService.onAuthStateChange((user) => {
          startTransition(() => {
            setUser(user);
          });
        });

        return () => {
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('Auth subscription error:', error);
        // Silently fail, don't block UI
      }
    }, 200);
  }, []);

  const signIn = async (email: string, password: string) => {
    startTransition(() => {
      setLoading(true);
    });
    try {
      const result = await authService.signIn({ email, password });
      startTransition(() => {
        if (result.user) {
          setUser(result.user);
        }
        setLoading(false);
      });
      return result;
    } catch (error) {
      startTransition(() => {
        setLoading(false);
      });
      throw error;
    }
  };

  const signOut = async () => {
    startTransition(() => {
      setLoading(true);
    });
    try {
      await authService.signOut();
      startTransition(() => {
        setUser(null);
        setLoading(false);
      });
    } catch (error) {
      startTransition(() => {
        setLoading(false);
      });
      throw error;
    }
  };

  const isAdmin = authService.isAdmin(user);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;