
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
// Import the toast component
import { toast } from '@/components/ui/use-toast';

interface AuthState {
  session: Session | null;
  user: any | null;
  isLoading: boolean;
  error: Error | null;
}

interface AuthActions {
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<any>;
}

export const useAuth = (): AuthState & AuthActions => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadSession = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        const { data: { session } } = await supabase.auth.getSession();

        setAuthState({
          session,
          user: session?.user || null,
          isLoading: false,
          error: null,
        });

        // Listen for changes on auth state (login, signout, etc.)
        supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'INITIAL_SESSION') {
            return;
          }
          setAuthState({
            session,
            user: session?.user || null,
            isLoading: false,
            error: null,
          });
        });
      } catch (error: any) {
        setAuthState({
          session: null,
          user: null,
          isLoading: false,
          error: error,
        });
        console.error("Erro ao carregar a sessão:", error);
      }
    };

    loadSession();
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      if (error) {
        console.error("Erro ao registrar:", error);
        toast({
          title: "Erro ao registrar",
          description: error.message,
          variant: "destructive"
        });
        setAuthState(prev => ({ ...prev, error: error, isLoading: false }));
        return { error };
      }
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { data, error: null };
    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      toast({
        title: "Erro ao registrar",
        description: error.message,
        variant: "destructive"
      });
      setAuthState(prev => ({ ...prev, error: error, isLoading: false }));
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Erro ao logar:", error);
        toast({
          title: "Erro ao logar",
          description: error.message,
          variant: "destructive"
        });
        setAuthState(prev => ({ ...prev, error: error, isLoading: false }));
        return { error };
      }
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { data, error: null };
    } catch (error: any) {
      console.error("Erro ao logar:", error);
      toast({
        title: "Erro ao logar",
        description: error.message,
        variant: "destructive"
      });
      setAuthState(prev => ({ ...prev, error: error, isLoading: false }));
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await supabase.auth.signOut();
      setAuthState({ session: null, user: null, isLoading: false, error: null });
    } catch (error: any) {
      console.error("Erro ao sair:", error);
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive"
      });
      setAuthState(prev => ({ ...prev, error: error, isLoading: false, session: null, user: null }));
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (error) {
        console.error("Erro ao solicitar redefinição de senha:", error);
        toast({
          title: "Erro ao solicitar redefinição de senha",
          description: error.message,
          variant: "destructive"
        });
        setAuthState(prev => ({ ...prev, error: error, isLoading: false }));
        return { error };
      }
       toast({
          title: "Solicitação enviada",
          description: "Verifique seu email para redefinir sua senha.",
        });
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { data, error: null };
    } catch (error: any) {
      console.error("Erro ao solicitar redefinição de senha:", error);
       toast({
          title: "Erro ao solicitar redefinição de senha",
          description: error.message,
          variant: "destructive"
        });
      setAuthState(prev => ({ ...prev, error: error, isLoading: false }));
      return { error };
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPasswordForEmail,
  };
};
