
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/components/profile/types';
import { formatDateForDatabase } from '@/lib/authUtils';

export interface RegisterUserData {
  email: string;
  password?: string;
  nome_completo: string;
  cargo_id?: string;
  coordenacao_id?: string;
  area_id?: string;
  whatsapp?: string;
  cargo?: string;
  RF?: string;
  coordenacao?: string;
  aniversario?: string;
  supervisao_tecnica_id?: string;
}

export const registerUser = async (userData: RegisterUserData) => {
  try {
    // For the simplified registration flow without password (admin approval)
    const { data: authData, error: authError } = !userData.password 
      ? { data: { user: { id: 'pending' } }, error: null }
      : await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              nome_completo: userData.nome_completo,
              cargo_id: userData.cargo_id,
              coordenacao_id: userData.coordenacao_id,
              supervisao_tecnica_id: userData.supervisao_tecnica_id,
              RF: userData.RF,
              whatsapp: userData.whatsapp,
              aniversario: userData.aniversario,
              status: 'pendente'
            }
          }
        });

    if (authError) throw authError;

    if (authData?.user) {
      // Format aniversario if it exists
      let formattedAniversario = null;
      if (userData.aniversario) {
        formattedAniversario = formatDateForDatabase(userData.aniversario);
      }
      
      // Create the user profile in the usuarios table
      const { error: profileError } = await supabase.from('usuarios').insert({
        id: authData.user.id,
        email: userData.email,
        nome_completo: userData.nome_completo,
        cargo_id: userData.cargo_id,
        coordenacao_id: userData.coordenacao_id,
        supervisao_tecnica_id: userData.supervisao_tecnica_id,
        RF: userData.RF, // Store RF in the database
        whatsapp: userData.whatsapp || null,
        aniversario: formattedAniversario,
        status_conta: 'pendente' // Account needs approval by admin
      });

      if (profileError) throw profileError;

      return { data: authData.user, error: null };
    } else {
      throw new Error('Falha ao criar usuário');
    }
  } catch (error: any) {
    console.error('Error registering user:', error);
    return { data: null, error };
  }
};

export const updateProfile = async (profileData: Partial<ProfileData>, userId: string) => {
  try {
    // Format aniversario if it exists
    let formattedAniversario = null;
    if (profileData.aniversario && typeof profileData.aniversario === 'string') {
      formattedAniversario = formatDateForDatabase(profileData.aniversario);
    } else if (profileData.aniversario instanceof Date) {
      formattedAniversario = profileData.aniversario.toISOString().split('T')[0];
    }
    
    const { error } = await supabase
      .from('usuarios')
      .update({
        nome_completo: profileData.nome_completo,
        whatsapp: profileData.whatsapp || null,
        aniversario: formattedAniversario
      })
      .eq('id', userId);

    if (error) throw error;

    return { data: true, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error };
  }
};

// Auth functions needed by AuthProvider
export const setupAuthListener = (callback: (session: any) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session);
    }
  );
  return subscription;
};

export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (data: RegisterUserData) => {
  return registerUser(data);
};

export const signInWithGoogle = async () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
  });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};
