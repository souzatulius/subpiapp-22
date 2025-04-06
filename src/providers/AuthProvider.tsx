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
    const initialize = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);

        if (data.session?.user) {
          const approved = await isUserApproved(data.session.user.id);
          setIsApproved(approved);
          
          if (approved && window.location.pathname === '/login') {
            navigate('/dashboard');
          }
        }

        const subscription = await authService.setupAuthListener(async (newSession) => {
          setSession(newSession);
          setUser(newSession?.user || null);
          
          if (newSession?.user) {
            const approved = await isUserApproved(newSession.user.id);
            setIsApproved(approved);
            
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

  const handleUpdateUserProfile = async (userId: string, userData: any) => {
    return updateUserProfile(userId, userData);
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const result = await authService.signUp(email, password, userData);
    
    if (!result.error) {
      if (result.data?.user) {
        await handleUpdateUserProfile(
          result.data.user.id,
          userData
        );
        
        await createAdminNotification(
          result.data.user.id, 
          userData.nome_completo,
          email
        );
      }
    }
    
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    
    if (!result.error && result.data?.user) {
      const approved = await isUserApproved(result.data.user.id);
      setIsApproved(approved);
      
      if (!approved) {
        return { 
          error: { 
            message: 'User not approved'
          } 
        };
      }
      
      navigate('/dashboard');
    }
    
    return result;
  };

  const signInWithGoogle = async () => {
    await authService.signInWithGoogle();
  };

  const signOut = async () => {
    await authService.signOut();
    setIsApproved(null);
    navigate('/login', { replace: true });
  };

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
