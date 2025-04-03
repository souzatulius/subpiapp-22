
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/components/profile/types';

/**
 * Update user profile information
 */
export const updateProfile = async (userData: ProfileData, userId: string) => {
  try {
    // Clean up data for update
    const updatedData: any = {
      nome_completo: userData.nome_completo
    };
    
    // Handle WhatsApp field (only store digits)
    if (userData.whatsapp) {
      updatedData.whatsapp = userData.whatsapp.replace(/\D/g, '');
    } else {
      updatedData.whatsapp = null;
    }
    
    // Handle birthday field
    if (userData.aniversario) {
      updatedData.aniversario = userData.aniversario;
    } else {
      updatedData.aniversario = null;
    }
    
    // Handle profile photo URL if provided
    if (userData.foto_perfil_url) {
      updatedData.foto_perfil_url = userData.foto_perfil_url;
    }

    console.log('Atualizando perfil do usuário:', userId, 'com dados:', updatedData);

    // CORREÇÃO: Usar corretamente a tabela 'usuarios' e não tentar acessar 'auth.users'
    const { error } = await supabase
      .from('usuarios')
      .update(updatedData)
      .eq('id', userId);
      
    if (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error };
  }
};

/**
 * Set up authentication listener
 */
export const setupAuthListener = async (callback: (session: any) => void) => {
  const { data: { subscription } } = await supabase.auth.onAuthStateChange(
    (_, session) => {
      callback(session);
    }
  );
  
  return subscription;
};

/**
 * Sign up a new user
 */
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    return { data, error };
  } catch (error) {
    console.error('Error during signup:', error);
    return { error };
  }
};

/**
 * Sign in an existing user
 */
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { data, error };
  } catch (error) {
    console.error('Error during signin:', error);
    return { error };
  }
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    return { data, error };
  } catch (error) {
    console.error('Error during Google signin:', error);
    return { error };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Error during signout:', error);
    return { error };
  }
};
