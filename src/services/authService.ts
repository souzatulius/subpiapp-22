
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Session } from '@supabase/supabase-js';

// Sign up with email/password
export const signUp = async (email: string, password: string, userData: any) => {
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

// Login with email/password
export const signIn = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      return { error: null };
    }

    return { error };
  } catch (error: any) {
    console.error('Erro no login:', error);
    return { error };
  }
};

// Login with Google
export const signInWithGoogle = async () => {
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
    throw error;
  }
};

// Logout
export const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Erro ao sair:', error);
    throw error;
  }
};

// Update profile
export const updateProfile = async (data: any, userId: string) => {
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
    if (userId) {
      const { error: profileError } = await supabase
        .from('usuarios')
        .update({
          nome_completo: data.nome_completo,
          aniversario: data.aniversario,
          whatsapp: data.whatsapp,
          cargo_id: data.cargo_id,
          area_coordenacao_id: data.area_coordenacao_id,
        })
        .eq('id', userId);

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

// Get current session
export const getSession = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    return data;
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    throw error;
  }
};

// Setup auth state change listener
export const setupAuthListener = async (callback: (session: Session | null) => void) => {
  try {
    const { data: { subscription } } = await supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        callback(newSession);
      }
    );
    
    return subscription;
  } catch (error) {
    console.error('Erro ao configurar ouvinte de autenticação:', error);
    throw error;
  }
};
