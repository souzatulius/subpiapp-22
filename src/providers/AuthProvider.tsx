
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import * as authService from '@/services/authService';
import { isUserApproved, createAdminNotification, updateUserProfile } from '@/lib/authUtils';
import { supabase } from '@/integrations/supabase/client';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Inicializa sessão e configura listener para mudanças na autenticação
    const initialize = async () => {
      setLoading(true);
      try {
        // Verifica sessão atual
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);

        // Verifica se o usuário está aprovado
        if (data.session?.user) {
          const approved = await isUserApproved(data.session.user.id);
          setIsApproved(approved);
          
          // Se estiver aprovado e estiver na página de login, redireciona para o dashboard
          if (approved && window.location.pathname === '/login') {
            navigate('/dashboard');
          }
        }

        // Configura ouvinte para mudanças de autenticação
        const subscription = await authService.setupAuthListener(async (newSession) => {
          setSession(newSession);
          setUser(newSession?.user || null);
          
          // Verifica aprovação quando a sessão muda
          if (newSession?.user) {
            const approved = await isUserApproved(newSession.user.id);
            setIsApproved(approved);
            
            // Se estiver aprovado e estiver na página de login, redireciona para o dashboard
            if (approved && window.location.pathname === '/login') {
              navigate('/dashboard');
            }
          } else {
            setIsApproved(null);
          }
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
  }, [navigate]);

  // Create or update user profile - already defined in authUtils.ts, so we'll use that instead
  const handleUpdateUserProfile = async (userId: string, userData: any) => {
    return updateUserProfile(userId, userData);
  };

  // Sign up wrapper
  const signUp = async (email: string, password: string, userData: any) => {
    const result = await authService.signUp(email, password, userData);
    
    if (!result.error) {
      // Notify admins about new user registration
      if (result.data?.user) {
        // Update user profile with cargo and area
        await handleUpdateUserProfile(
          result.data.user.id,
          userData
        );
        
        // Notify administrators
        await createAdminNotification(
          result.data.user.id, 
          userData.nome_completo,
          email
        );
      }
    }
    
    return result;
  };

  // Sign in wrapper
  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    
    if (!result.error && result.data?.user) {
      // Check if user is approved
      const approved = await isUserApproved(result.data.user.id);
      setIsApproved(approved);
      
      if (!approved) {
        // Create custom error for non-approved users
        return { 
          error: { 
            message: 'User not approved'
          } 
        };
      }
      
      // Explicitly redirect to dashboard on successful login
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
    setIsApproved(null);
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
    isApproved,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
