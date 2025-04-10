
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/components/profile/types';

export const updateProfile = async (profileData: Partial<ProfileData>, userId: string) => {
  try {
    // Format the aniversario field if it's a Date object
    let formattedData = { ...profileData };
    
    if (formattedData.aniversario instanceof Date) {
      formattedData.aniversario = formattedData.aniversario.toISOString().split('T')[0];
    }
    
    const { data, error } = await supabase
      .from('usuarios')
      .update(formattedData)
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
