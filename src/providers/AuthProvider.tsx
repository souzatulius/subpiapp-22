
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import * as authService from '@/services/authService';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Inicializa sessão e configura listener para mudanças na autenticação
    const initialize = async () => {
      setLoading(true);
      try {
        // Verifica sessão atual
        const { session: currentSession } = await authService.getSession();
        setSession(currentSession);
        setUser(currentSession?.user || null);

        // Configura ouvinte para mudanças de autenticação
        const subscription = await authService.setupAuthListener((newSession) => {
          setSession(newSession);
          setUser(newSession?.user || null);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // Sign up wrapper
  const signUp = async (email: string, password: string, userData: any) => {
    return authService.signUp(email, password, userData);
  };

  // Sign in wrapper
  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    
    if (!result.error) {
      navigate('/dashboard');
    }
    
    return result;
  };

  // Sign in with Google wrapper
  const signInWithGoogle = async () => {
    await authService.signInWithGoogle();
  };

  // Sign out wrapper
  const signOut = async () => {
    await authService.signOut();
    navigate('/login');
  };

  // Update profile wrapper
  const updateProfile = async (data: any) => {
    if (!user) {
      return { error: new Error('Usuário não autenticado') };
    }
    
    return authService.updateProfile(data, user.id);
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
