
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AuthState {
  session: Session | null;
  user: any | null;
  isLoading: boolean;
  loading: boolean; // Alias for backward compatibility
  error: Error | null;
  isApproved: boolean | undefined;
}

/**
 * Hook that manages the authentication state
 */
export const useAuthState = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    isLoading: true,
    loading: true,
    error: null,
    isApproved: undefined,
  });

  useEffect(() => {
    const loadSession = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true, loading: true }));
        const { data: { session } } = await supabase.auth.getSession();

        setAuthState({
          session,
          user: session?.user || null,
          isLoading: false,
          loading: false,
          error: null,
          isApproved: true,
        });

        // Set up auth state listener
        supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'INITIAL_SESSION') {
            return;
          }
          
          console.log(`Auth state changed: ${event}`);
          setAuthState({
            session,
            user: session?.user || null,
            isLoading: false,
            loading: false,
            error: null,
            isApproved: true,
          });
        });
      } catch (error: any) {
        console.error("Error loading auth session:", error);
        setAuthState({
          session: null,
          user: null,
          isLoading: false,
          loading: false,
          error: error,
          isApproved: false,
        });
      }
    };

    loadSession();
  }, []);

  return authState;
};
