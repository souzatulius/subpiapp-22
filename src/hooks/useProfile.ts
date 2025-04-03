
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './useSupabaseAuth';

// Standardized bucket name and folder structure
const PROFILE_PHOTOS_BUCKET = 'usuarios';
const PROFILE_PHOTOS_FOLDER = 'fotos_perfil';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const updateProfilePhoto = async (file: File) => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      // Upload the file to storage with standardized path
      const fileExt = file.name.split('.').pop() || 'jpg';
      const filePath = `${PROFILE_PHOTOS_FOLDER}/${user.id}/${Date.now()}.${fileExt}`;
      
      console.log(`Uploading to ${PROFILE_PHOTOS_BUCKET}/${filePath}`);
      
      const { error: uploadError } = await supabase.storage
        .from(PROFILE_PHOTOS_BUCKET)
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(PROFILE_PHOTOS_BUCKET)
        .getPublicUrl(filePath);
      
      console.log('Generated public URL:', publicUrl);
      
      // Update the user's metadata in the usuarios table - NOT auth.users
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ foto_perfil_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(`Erro ao atualizar perfil: ${updateError.message}`);
      }
      
      // Force refresh to update UI
      window.dispatchEvent(new Event('storage'));
      
      toast({
        title: 'Sucesso!',
        description: 'Foto de perfil atualizada com sucesso',
        variant: 'success'
      });
      
      return publicUrl;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível atualizar sua foto',
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    updateProfilePhoto,
    loading
  };
};
