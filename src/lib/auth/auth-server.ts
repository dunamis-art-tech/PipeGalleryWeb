import { getSupabaseServer } from '@/lib/supabase/server';
import type { AuthUser } from './auth-service';

export class AuthServerService {
  // Server-side user validation
  async validateServerUser(): Promise<AuthUser | null> {
    try {
      const supabaseServer = await getSupabaseServer();
      const { data: { user }, error } = await supabaseServer.auth.getUser();
      
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
      console.error('Error validating server user:', error);
      return null;
    }
  }

  // Check if user has admin access
  isAdmin(user: AuthUser | null): boolean {
    return user?.role === 'admin';
  }
}

// Export singleton instance for server-side use only
export const authServerService = new AuthServerService();