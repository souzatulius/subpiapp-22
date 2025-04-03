import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const usePhotoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadProfilePhoto = async (userId: string, file: File): Promise<string | null> => {
    setIsUploading(true);

    try {
      const filePath = `usuarios/${userId}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos') // ou 'usuarios/fotos_perfil'
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '0',
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(filePath);
      const photoUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;

      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ foto_url: photoUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      return photoUrl;
    } catch (error) {
      console.error('Erro no upload da foto:', error);
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
