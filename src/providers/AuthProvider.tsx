
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import * as authService from '@/services/authService';
import { isUserApproved, createAdminNotification, updateUserProfile } from '@/lib/authUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        console.log('Inicializando autenticação...');
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);

        if (data.session?.user) {
          console.log('Sessão encontrada para usuário:', data.session.user.id);
          const approved = await isUserApproved(data.session.user.id);
          setIsApproved(approved);
          
          // Permitir acesso à página de email-verified mesmo se não aprovado
          const allowedUnapprovedRoutes = ['/email-verified', '/login'];
          
          if (approved && location.pathname === '/login') {
            console.log('Usuário aprovado, redirecionando para dashboard');
            navigate('/dashboard');
          } else if (!approved && data.session && 
                    !allowedUnapprovedRoutes.includes(location.pathname)) {
            // Redirecionar para email-verified page se o usuário não está aprovado e não está em uma rota permitida
            console.log('Usuário não aprovado, redirecionando para página de verificação');
            toast.info("Seu acesso ainda não foi aprovado por um administrador.");
            navigate('/email-verified');
          }
        } else {
          console.log('Nenhuma sessão de usuário encontrada');
        }

        console.log('Configurando listener de autenticação...');
        const subscription = await authService.setupAuthListener(async (newSession) => {
          console.log('Estado de autenticação alterado:', newSession ? 'logado' : 'deslogado');
          setSession(newSession);
          setUser(newSession?.user || null);
          
          if (newSession?.user) {
            console.log('Verificando aprovação para:', newSession.user.id);
            const approved = await isUserApproved(newSession.user.id);
            setIsApproved(approved);
            
            // Permitir acesso à página de email-verified mesmo se não aprovado
            const allowedUnapprovedRoutes = ['/email-verified', '/login'];
            
            if (approved && location.pathname === '/login') {
              navigate('/dashboard');
            } else if (!approved && newSession && 
                      !allowedUnapprovedRoutes.includes(location.pathname)) {
              // Redirecionar para email-verified page se o usuário não está aprovado e não está em uma rota permitida
              toast.info("Seu acesso ainda não foi aprovado por um administrador.");
              navigate('/email-verified');
            }
          } else {
            setIsApproved(null);
          }
        });

        return () => {
          console.log('Removendo listener de autenticação');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [navigate, location.pathname]);

  const handleUpdateUserProfile = async (userId: string, userData: any) => {
    console.log('Atualizando perfil de usuário:', userId);
    return updateUserProfile(userId, userData);
  };

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('Iniciando processo de registro para:', email);
    try {
      // Combine email, password, and other user data for registration
      const registerData = {
        email,
        password,
        ...userData
      };
      
      const result = await authService.signUp(registerData);
      
      if (!result.error) {
        if (result.data?.user) {
          console.log('Atualizando perfil para usuário recém-registrado:', result.data.user.id);
          const profileResult = await handleUpdateUserProfile(
            result.data.user.id,
            userData
          );
          
          if (profileResult.error) {
            console.error('Erro ao atualizar perfil do usuário:', profileResult.error);
          }
          
          try {
            console.log('Criando notificação para administradores com ID do usuário:', result.data.user.id);
            await createAdminNotification(
              result.data.user.id, 
              userData.nome_completo,
              email
            );
          } catch (notificationError) {
            console.error('Erro ao criar notificação, mas usuário foi registrado:', notificationError);
            // Continue despite notification error
          }
        }
      } else {
        console.error('Erro durante o registro:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Erro não tratado durante o registro:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Tentando login para:', email);
    const result = await authService.signIn(email, password);
    
    if (!result.error && result.data?.user) {
      console.log('Login bem-sucedido, verificando aprovação');
      const approved = await isUserApproved(result.data.user.id);
      setIsApproved(approved);
      
      if (!approved) {
        console.log('Usuário não aprovado, redirecionando');
        navigate('/email-verified');
        return { 
          error: { 
            message: 'User not approved'
          } 
        };
      }
      
      console.log('Usuário aprovado, redirecionando para dashboard');
      navigate('/dashboard');
    }
    
    return result;
  };

  const signInWithGoogle = async () => {
    console.log('Iniciando login com Google');
    await authService.signInWithGoogle();
  };

  const signOut = async () => {
    console.log('Iniciando logout');
    await authService.signOut();
    setIsApproved(null);
    navigate('/login', { replace: true });
  };

  const updateProfile = async (data: any) => {
    if (!user) {
      console.error('Tentativa de atualizar perfil sem usuário autenticado');
      return { error: new Error('Usuário não autenticado') };
    }
    
    console.log('Atualizando perfil para usuário:', user.id);
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
