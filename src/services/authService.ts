
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface RegisterUserData {
  email: string;
  nome_completo: string;
  cargo?: string;
  RF?: string;
  coordenacao?: string;
}

/**
 * Registers a new user in the system by sending a request for access
 * This doesn't create an auth account but stores the request in the database
 * @param userData User registration data
 */
export const registerUser = async (userData: RegisterUserData) => {
  try {
    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', userData.email)
      .single();
    
    if (existingUser) {
      throw new Error('Este email já está cadastrado no sistema.');
    }
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    // Insert the user registration request
    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        email: userData.email,
        nome_completo: userData.nome_completo,
        cargo: userData.cargo || null,
        rf: userData.RF || null,
        coordenacao: userData.coordenacao || null,
        status: 'pendente',
      });
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error in registerUser:', error);
    throw new Error(error.message || 'Falha ao registrar usuário');
  }
}

/**
 * Updates a user profile in the system
 * @param userId The ID of the user to update
 * @param profileData The profile data to update
 */
export const updateProfile = async (userId: string, profileData: any) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error in updateProfile:', error);
    throw new Error(error.message || 'Falha ao atualizar perfil');
  }
}

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error in signIn:', error);
    throw new Error(error.message || 'Falha ao realizar login');
  }
}

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error in signInWithGoogle:', error);
    throw new Error(error.message || 'Falha ao realizar login com Google');
  }
}

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error in signUp:', error);
    throw new Error(error.message || 'Falha ao criar conta');
  }
}

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Error in signOut:', error);
    throw new Error(error.message || 'Falha ao realizar logout');
  }
}

/**
 * Setup an auth state listener for the application
 * @param callback Function to call when auth state changes
 */
export const setupAuthListener = (callback: (session: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session);
  });
};
