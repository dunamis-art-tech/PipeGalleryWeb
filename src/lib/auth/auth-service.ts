import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin';
  created_at: string;
  last_sign_in_at: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: AuthUser | null;
  error: string | null;
}

export class AuthService {
  // Sign in with email and password
  async signIn(credentials: SignInCredentials): Promise<SignInResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Authentication failed' };
      }

      // Check if user is admin (for now, all authenticated users are admins)
      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email || '',
        role: 'admin',
        created_at: data.user.created_at || new Date().toISOString(),
        last_sign_in_at: data.user.last_sign_in_at ?? null
      };

      return { user: authUser, error: null };
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    }
  }

  // Sign out current user
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Sign out failed' 
      };
    }
  }

  // Get current user session
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email || '',
        role: 'admin',
        created_at: user.created_at || new Date().toISOString(),
        last_sign_in_at: user.last_sign_in_at ?? null
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }


  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          role: 'admin',
          created_at: session.user.created_at || new Date().toISOString(),
          last_sign_in_at: session.user.last_sign_in_at ?? null
        };
        callback(authUser);
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    });
  }

  // Check if user has admin access (simplified - all authenticated users are admins)
  isAdmin(user: AuthUser | null): boolean {
    return user?.role === 'admin';
  }

  // Create admin user (for initial setup)
  async createAdminUser(email: string, password: string): Promise<SignInResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'User creation failed' };
      }

      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email || email,
        role: 'admin',
        created_at: data.user.created_at || new Date().toISOString(),
        last_sign_in_at: null
      };

      return { user: authUser, error: null };
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'User creation failed' 
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();