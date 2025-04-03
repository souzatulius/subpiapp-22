
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { setupProfilePhotosStorage } from './setupProfilePhotosStorage';
import { toast } from '@/components/ui/use-toast';

const STORAGE_BUCKET = 'usuarios';
const STORAGE_PATH = 'fotos_perfil';

export const usePhotoUpload = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  
  const uploadProfilePhoto = async (file: File): Promise<string | null> => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      throw new Error('Usuário não autenticado');
    }
    
    if (!file) {
      toast({
        title: "Erro",
        description: "Nenhum arquivo selecionado",
        variant: "destructive"
      });
      throw new Error('Nenhum arquivo selecionado');
    }
    
    // Validação básica do arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "O arquivo deve ser uma imagem",
        variant: "destructive"
      });
      throw new Error('O arquivo deve ser uma imagem');
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB 
      toast({
        title: "Erro",
        description: "A imagem não pode exceder 5MB",
        variant: "destructive"
      });
      throw new Error('A imagem não pode exceder 5MB');
    }
    
    setIsUploading(true);
    
    try {
      // Verifica se o bucket está configurado corretamente
      await setupProfilePhotosStorage();
      
      // Cria uma pasta para o usuário e usa timestamp para evitar colisões de nomes
      const fileExt = file.name.split('.').pop();
      const filePath = `${STORAGE_PATH}/${user.id}/${Date.now()}.${fileExt}`;
      
      // Log para debugging
      console.log(`Tentando fazer upload para ${STORAGE_BUCKET}/${filePath}`);
      
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });
      
      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        toast({
          title: "Erro",
          description: "Não foi possível fazer upload da imagem: " + uploadError.message,
          variant: "destructive"
        });
        throw new Error(uploadError.message);
      }
      
      // Obter a URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);
      
      if (!urlData || !urlData.publicUrl) {
        throw new Error('Não foi possível obter a URL do arquivo');
      }
      
      console.log('URL pública obtida:', urlData.publicUrl);
      
      // CORREÇÃO: Atualiza a tabela usuarios com a nova URL - NÃO auth.users
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ foto_perfil_url: urlData.publicUrl })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError);
        toast({
          title: "Erro",
          description: "Erro ao atualizar foto no perfil: " + updateError.message,
          variant: "destructive"
        });
        throw new Error(updateError.message);
      }
      
      toast({
        title: "Sucesso",
        description: "Foto de perfil atualizada com sucesso",
      });
      
      // Dispare eventos para atualizar a UI
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('profile:photo:updated'));
      
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Erro no processo de upload:', error);
      
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar foto de perfil",
        variant: "destructive"
      });
      
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
