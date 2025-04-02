
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';

// Standardized bucket name and folder structure
const PROFILE_PHOTOS_BUCKET = 'usuarios';
const PROFILE_PHOTOS_FOLDER = 'fotos_perfil';

export const usePhotoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const uploadProfilePhoto = async (file: File): Promise<string | null> => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado. Faça login novamente.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setIsUploading(true);
      
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        throw new Error('O arquivo deve ser uma imagem');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('A imagem não pode exceder 5MB');
      }
      
      // Upload the photo
      const fileExt = file.name.split('.').pop() || 'jpg';
      const filePath = `${PROFILE_PHOTOS_FOLDER}/${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(PROFILE_PHOTOS_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(PROFILE_PHOTOS_BUCKET)
        .getPublicUrl(filePath);
      
      // Update user profile with new photo URL
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ foto_perfil_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Error updating profile with photo URL:', updateError);
        throw new Error(`Erro ao atualizar perfil: ${updateError.message}`);
      }
      
      // No refresh session call needed, we'll handle the profile update elsewhere
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso!",
        variant: "success"
      });
      
      return publicUrl;
    } catch (error: any) {
      console.error('Error updating profile photo:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao atualizar a foto de perfil",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadProfilePhoto,
    isUploading
  };
};
