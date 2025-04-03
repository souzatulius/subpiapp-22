
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { setupProfilePhotosStorage } from './setupProfilePhotosStorage';

const STORAGE_BUCKET = 'usuarios';
const STORAGE_PATH = 'fotos_perfil';

export const usePhotoUpload = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  
  const uploadProfilePhoto = async (file: File): Promise<string | null> => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }
    
    if (!file) {
      throw new Error('Nenhum arquivo selecionado');
    }
    
    // Validação básica do arquivo
    if (!file.type.startsWith('image/')) {
      throw new Error('O arquivo deve ser uma imagem');
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB 
      throw new Error('A imagem não pode exceder 5MB');
    }
    
    setIsUploading(true);
    
    try {
      // Verifica se o bucket existe e está configurado corretamente
      const storageSetup = await setupProfilePhotosStorage();
      if (!storageSetup) {
        throw new Error('Não foi possivel configurar o armazenamento de fotos. Tente novamente mais tarde.');
      }
      
      // Cria uma pasta para o usuário e usa timestamp para evitar colisões de nomes
      const fileExt = file.name.split('.').pop();
      const filePath = `${STORAGE_PATH}/${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });
      
      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw new Error(uploadError.message);
      }
      
      // Obter a URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);
      
      if (!urlData || !urlData.publicUrl) {
        throw new Error('Não foi possível obter a URL do arquivo');
      }
      
      // Atualiza o perfil do usuário com a nova URL
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ foto_perfil_url: urlData.publicUrl })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError);
        throw new Error('Erro ao atualizar foto de perfil no banco de dados');
      }
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro no processo de upload:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    uploadProfilePhoto,
    isUploading
  };
};
