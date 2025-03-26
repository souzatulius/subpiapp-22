
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AuthActions {
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<any>;
  signInWithGoogle?: () => Promise<any>;
  updateProfile?: (data: any) => Promise<any>;
}

interface UseAuthActionsProps {
  onAuthStateChange?: (isLoading: boolean, error: Error | null) => void;
}

/**
 * Hook that provides authentication actions
 */
export const useAuthActions = ({ onAuthStateChange }: UseAuthActionsProps = {}): AuthActions => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoadingState = (loading: boolean, error: Error | null = null) => {
    setIsLoading(loading);
    if (onAuthStateChange) {
      onAuthStateChange(loading, error);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoadingState(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        console.error("Error signing up:", error);
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive"
        });
        setLoadingState(false, error);
        return { error };
      }
      
      setLoadingState(false);
      return { data, error: null };
    } catch (error: any) {
      console.error("Exception during signup:", error);
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive"
      });
      setLoadingState(false, error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoadingState(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Error signing in:", error);
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive"
        });
        setLoadingState(false, error);
        return { error };
      }
      
      setLoadingState(false);
      return { data, error: null };
    } catch (error: any) {
      console.error("Exception during signin:", error);
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive"
      });
      setLoadingState(false, error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setLoadingState(true);
      await supabase.auth.signOut();
      setLoadingState(false);
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
      setLoadingState(false, error);
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    try {
      setLoadingState(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (error) {
        console.error("Error requesting password reset:", error);
        toast({
          title: "Error requesting password reset",
          description: error.message,
          variant: "destructive"
        });
        setLoadingState(false, error);
        return { error };
      }
      
      toast({
        title: "Request sent",
        description: "Check your email to reset your password.",
      });
      
      setLoadingState(false);
      return { data, error: null };
    } catch (error: any) {
      console.error("Exception during password reset request:", error);
      toast({
        title: "Error requesting password reset",
        description: error.message,
        variant: "destructive"
      });
      setLoadingState(false, error);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoadingState(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast({
        title: "Error signing in with Google",
        description: error.message,
        variant: "destructive"
      });
      setLoadingState(false, error);
      return { error };
    }
  };

  const updateProfile = async (data: any) => {
    try {
      return { data, error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPasswordForEmail,
    signInWithGoogle,
    updateProfile,
  };
};
