
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { setupProfilePhotosStorage } from './setupProfilePhotosStorage';

// Bucket name e estrutura de pastas padronizada
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
      
      // Validação do arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('O arquivo deve ser uma imagem');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('A imagem não pode exceder 5MB');
      }
      
      // Exibindo os detalhes do arquivo para debug
      console.log('Detalhes do arquivo:', {
        nome: file.name,
        tipo: file.type,
        tamanho: `${(file.size / 1024).toFixed(2)}KB`
      });
      
      // Garantindo que o bucket existe
      console.log('Configurando armazenamento...');
      const setupResult = await setupProfilePhotosStorage();
      
      if (!setupResult) {
        console.error('Falha na configuração do armazenamento');
        throw new Error('Não foi possível configurar o armazenamento de fotos. Tente novamente mais tarde.');
      }
      
      console.log('Armazenamento configurado com sucesso');
      
      // Preparação do caminho do arquivo para upload
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const filePath = `${PROFILE_PHOTOS_FOLDER}/${user.id}/${fileName}.${fileExt}`;
      
      console.log(`Iniciando upload para ${PROFILE_PHOTOS_BUCKET}/${filePath}`);
      
      // Tentativa de upload
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from(PROFILE_PHOTOS_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Erro no upload da foto:', uploadError);
        
        // Se for erro de permissão, fornecemos uma mensagem mais clara
        if (uploadError.message.includes('permission denied')) {
          throw new Error('Você não tem permissão para fazer upload de arquivos. Verifique suas permissões.');
        }
        
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }
      
      console.log('Upload concluído com sucesso. Gerando URL pública...');
      
      // Obtenção da URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(PROFILE_PHOTOS_BUCKET)
        .getPublicUrl(filePath);
      
      if (!publicUrl) {
        throw new Error('Não foi possível gerar uma URL pública para a imagem');
      }
      
      console.log('URL pública gerada:', publicUrl);
      
      // Atualização do perfil com a nova URL da foto na tabela 'usuarios'
      console.log('Atualizando perfil do usuário com a nova URL...');
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ foto_perfil_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Erro ao atualizar perfil com URL da foto:', updateError);
        throw new Error(`Erro ao atualizar perfil: ${updateError.message}`);
      }
      
      console.log('Perfil atualizado com sucesso');
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso!",
        variant: "success"
      });
      
      // Dispare um evento para atualizar a UI
      window.dispatchEvent(new Event('profile:photo:updated'));
      window.dispatchEvent(new Event('storage'));
      
      return publicUrl;
    } catch (error: any) {
      console.error('Erro ao atualizar foto de perfil:', error);
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
