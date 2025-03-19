
import { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user || null);

        // Configura ouvinte para mudanças de autenticação
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user || null);
          }
        );

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

  // Inscrição com email/senha
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.nome_completo,
            birthday: userData.aniversario,
            whatsapp: userData.whatsapp,
            role: userData.cargo,
            area: userData.area,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });

      if (!error) {
        toast({
          title: "Cadastro enviado com sucesso!",
          description: "Verifique seu e-mail para confirmar o cadastro.",
        });
        return { error: null };
      }
      
      return { error };
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      return { error };
    }
  };

  // Login com email/senha
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        navigate('/dashboard');
        return { error: null };
      }

      return { error };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { error };
    }
  };

  // Login com Google
  const signInWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch (error) {
      console.error('Erro no login com Google:', error);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  // Atualização de perfil
  const updateProfile = async (data: any) => {
    try {
      // Atualiza metadados do usuário no auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: data.nome_completo,
          birthday: data.aniversario,
          whatsapp: data.whatsapp,
          role: data.cargo,
          area: data.area,
        }
      });

      if (authError) {
        console.error('Erro ao atualizar metadados:', authError);
        return { error: authError };
      }

      // Atualiza informações na tabela usuarios
      if (user) {
        const { error: profileError } = await supabase
          .from('usuarios')
          .update({
            nome_completo: data.nome_completo,
            aniversario: data.aniversario,
            whatsapp: data.whatsapp,
            cargo_id: data.cargo_id,
            area_coordenacao_id: data.area_coordenacao_id,
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError);
          return { error: profileError };
        }
      }

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      return { error };
    }
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
