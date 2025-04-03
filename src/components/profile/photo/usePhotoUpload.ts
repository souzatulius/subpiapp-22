
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const usePhotoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadProfilePhoto = async (userId: string, file: File): Promise<string | null> => {
    setIsUploading(true);

    try {
      const filePath = `usuarios/${userId}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '0',
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(filePath);
      const photoUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;

      // Update the foto_perfil_url in usuarios table instead of auth.users
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ foto_perfil_url: photoUrl })
        .eq('id', userId);

      if (updateError) throw updateError;
      
      // Dispatch an event to update UI components that display the profile photo
      window.dispatchEvent(new Event('profile:photo:updated'));

      return photoUrl;
    } catch (error) {
      console.error('Erro no upload da foto:', error);
      toast({
        title: "Erro ao atualizar foto",
        description: "Não foi possível fazer o upload ou atualizar sua foto de perfil.",
        variant: "destructive"
      });
      throw new Error('Erro ao enviar ou salvar a foto.');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadProfilePhoto,
    isUploading,
  };
};
