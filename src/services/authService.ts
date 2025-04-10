
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/components/profile/types';

export const updateProfile = async (profileData: Partial<ProfileData>, userId: string) => {
  try {
    // Format the aniversario field if it's a Date object
    let formattedData = { ...profileData };
    
    if (formattedData.aniversario instanceof Date) {
      formattedData.aniversario = formattedData.aniversario.toISOString().split('T')[0];
    }
    
    // Cast the profile data to the expected format for Supabase
    const dataToUpdate: any = {
      nome_completo: formattedData.nome_completo,
      whatsapp: formattedData.whatsapp,
      aniversario: formattedData.aniversario,
      email: formattedData.email,
      foto_perfil_url: formattedData.foto_perfil_url
    };

    // Handle special fields
    if (typeof formattedData.cargo === 'object' && formattedData.cargo?.descricao) {
      dataToUpdate.cargo_id = formattedData.cargo.descricao;
    } else if (typeof formattedData.cargo === 'string') {
      dataToUpdate.cargo_id = formattedData.cargo;
    }

    if (typeof formattedData.coordenacao === 'object' && formattedData.coordenacao?.descricao) {
      dataToUpdate.coordenacao_id = formattedData.coordenacao.descricao;
    } else if (typeof formattedData.coordenacao === 'string') {
      dataToUpdate.coordenacao_id = formattedData.coordenacao;
    }

    if (formattedData.supervisao_tecnica) {
      dataToUpdate.supervisao_tecnica_id = formattedData.supervisao_tecnica;
    }
    
    const { data, error } = await supabase
      .from('usuarios')
      .update(dataToUpdate)
      .eq('id', userId)
      .select();
      
    return { data, error };
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return { data: null, error };
  }
};

export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        cargo:cargo_id(descricao),
        coordenacao:coordenacao_id(descricao),
        supervisao_tecnica:supervisao_tecnica_id(descricao)
      `)
      .eq('id', userId)
      .single();
      
    return { data, error };
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return { data: null, error };
  }
};

export const updateUserPhoto = async (userId: string, photoUrl: string) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ foto_perfil_url: photoUrl })
      .eq('id', userId)
      .select();
      
    return { data, error };
  } catch (error) {
    console.error('Error in updateUserPhoto:', error);
    return { data: null, error };
  }
};

// Add the missing auth functions required by AuthProvider
export const setupAuthListener = (callback: (user: any) => void) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
  
  return data;
};

export const signUp = async (email: string, password: string, userData?: any) => {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const registerUser = async (email: string, password: string, userData: any) => {
  return signUp(email, password, userData);
};
