
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

    const { error } = await supabase
      .from('usuarios')
      .update(updatedData)
      .eq('id', userId);
      
    return { error };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error };
  }
};
