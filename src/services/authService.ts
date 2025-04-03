
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Session, User } from '@supabase/supabase-js';

// Sign up with email/password
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.nome_completo,
          birthday: userData.aniversario,
          whatsapp: userData.whatsapp,
          role_id: userData.cargo_id,
          area_id: userData.coordenacao_id,
        },
        emailRedirectTo: `${window.location.origin}/email-verified`,
      }
    });

    if (!error) {
      toast({
        title: "Cadastro enviado com sucesso!",
        description: "Verifique seu e-mail para confirmar o cadastro.",
      });
      return { error: null, data };
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      return { error: null, data };
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
    // Log the configuration to help with debugging
    console.log('Iniciando login com Google', {
      redirectUrl: `${window.location.origin}/auth/callback`,
      domain: 'smsub.prefeitura.sp.gov.br',
      fullUrl: window.location.href
    });
    
    // Add additional query params to help troubleshoot the code exchange
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          hd: 'smsub.prefeitura.sp.gov.br', // Restrict to specific domain
        },
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: false // Ensure browser is redirected
      }
    });
    
    if (error) {
      console.error('Erro no login com Google:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Erro no login com Google:', error);
    return { data: null, error };
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

// Update profile - Corrigido para usar apenas a tabela 'usuarios'
export const updateProfile = async (data: any, userId: string) => {
  if (!userId) {
    console.error('updateProfile: userId not provided');
    return { error: new Error('ID de usuário não fornecido') };
  }
  
  try {
    console.log('Atualizando dados do perfil para userId:', userId, 'com dados:', data);
    
    // Atualizar informações do perfil na tabela usuarios
    const { error: profileError } = await supabase
      .from('usuarios')
      .update({
        nome_completo: data.nome_completo,
        aniversario: data.aniversario,
        whatsapp: data.whatsapp,
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Erro ao atualizar perfil em usuarios:', profileError);
      return { error: profileError };
    }
    
    // Atualizar também metadata do usuário na auth
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: data.nome_completo,
          birthday: data.aniversario,
          whatsapp: data.whatsapp
        }
      });
      
      if (authError) {
        console.warn('Erro ao atualizar metadados de auth:', authError);
        // Não interrompemos o fluxo por causa deste erro
      }
    } catch (authUpdateError) {
      console.warn('Exceção ao atualizar auth metadata:', authUpdateError);
      // Não interrompemos o fluxo por causa deste erro
    }
      
    // Força uma atualização da UI
    window.dispatchEvent(new Event('storage'));
    
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
