
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
    
    // Handle birthday field - ensure proper date format (YYYY-MM-DD)
    if (userData.aniversario) {
      // Convert DD/MM/YYYY to YYYY-MM-DD
      if (typeof userData.aniversario === 'string' && userData.aniversario.includes('/')) {
        const [day, month, year] = userData.aniversario.split('/');
        updatedData.aniversario = `${year}-${month}-${day}`;
      } else {
        updatedData.aniversario = userData.aniversario;
      }
    } else {
      updatedData.aniversario = null;
    }
    
    // Handle profile photo URL if provided
    if (userData.foto_perfil_url) {
      updatedData.foto_perfil_url = userData.foto_perfil_url;
    }

    console.log('Atualizando perfil do usuário:', userId, 'com dados:', updatedData);

    // Use the 'usuarios' table correctly
    const { error } = await supabase
      .from('usuarios')
      .update(updatedData)
      .eq('id', userId);
      
    if (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
    
    console.log('Perfil atualizado com sucesso');
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
    // Validate required fields
    if (!email || !password) {
      console.error('Email and password are required');
      return { error: new Error('Email e senha são obrigatórios') };
    }
    
    // Format date properly for Postgres (from DD/MM/YYYY to YYYY-MM-DD)
    const cleanMetadata = { ...userData };
    
    // Process date field - ensure proper format for Postgres
    if (cleanMetadata.aniversario && cleanMetadata.aniversario.includes('/')) {
      const parts = cleanMetadata.aniversario.split('/');
      if (parts.length === 3) {
        // Convert from DD/MM/YYYY to YYYY-MM-DD
        cleanMetadata.aniversario = `${parts[2]}-${parts[1]}-${parts[0]}`;
        console.log('Data de aniversário formatada para:', cleanMetadata.aniversario);
      } else {
        console.warn('Formato de data inválido, removendo campo aniversario:', cleanMetadata.aniversario);
        delete cleanMetadata.aniversario;
      }
    }
    
    // Ensure all IDs are valid UUIDs or null
    if (cleanMetadata.cargo_id) {
      if (typeof cleanMetadata.cargo_id !== 'string' || !cleanMetadata.cargo_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.error('Invalid cargo_id format:', cleanMetadata.cargo_id);
        return { error: new Error('ID de cargo inválido') };
      }
      console.log('Using cargo_id as UUID:', cleanMetadata.cargo_id);
    }

    if (cleanMetadata.coordenacao_id) {
      if (typeof cleanMetadata.coordenacao_id !== 'string' || !cleanMetadata.coordenacao_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.error('Invalid coordenacao_id format:', cleanMetadata.coordenacao_id);
        return { error: new Error('ID de coordenação inválido') };
      }
      console.log('Using coordenacao_id as UUID:', cleanMetadata.coordenacao_id);
    }

    if (cleanMetadata.supervisao_tecnica_id) {
      if (typeof cleanMetadata.supervisao_tecnica_id !== 'string' || !cleanMetadata.supervisao_tecnica_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.error('Invalid supervisao_tecnica_id format:', cleanMetadata.supervisao_tecnica_id);
        return { error: new Error('ID de supervisão técnica inválido') };
      }
      console.log('Using supervisao_tecnica_id as UUID:', cleanMetadata.supervisao_tecnica_id);
    } else {
      // Ensure supervisao_tecnica_id is explicitly null and not an empty string
      cleanMetadata.supervisao_tecnica_id = null;
    }
    
    // Clean up any undefined or null values that might cause database errors
    Object.keys(cleanMetadata).forEach(key => {
      if (cleanMetadata[key] === undefined || cleanMetadata[key] === null || cleanMetadata[key] === '') {
        delete cleanMetadata[key];
      }
    });
    
    console.log('Signing up user with data:', { email, metadata: cleanMetadata });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: cleanMetadata
      }
    });
    
    if (error) {
      console.error('Supabase signup error:', error);
      return { error };
    }
    
    console.log('User signed up successfully:', data);
    
    // If we got this far, the signup was successful
    return { data, error: null };
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
    console.log('Attempting signin for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Signin error:', error);
      return { error };
    }
    
    console.log('User signed in successfully');
    return { data, error: null };
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
    console.log('Attempting to sign out user');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      return { error };
    }
    
    console.log('User signed out successfully');
    return { error: null };
  } catch (error) {
    console.error('Error during signout:', error);
    return { error };
  }
};
