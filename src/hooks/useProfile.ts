
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
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setLoading(true);
      
      // Upload the file to storage with standardized path
      const fileExt = file.name.split('.').pop() || 'jpg';
      const filePath = `${PROFILE_PHOTOS_FOLDER}/${user.id}/${Date.now()}.${fileExt}`;
      
      console.log(`Tentando fazer upload para ${PROFILE_PHOTOS_BUCKET}/${filePath}`);
      
      // Diretamente tenta upload sem verificar a existência do bucket
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from(PROFILE_PHOTOS_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }
      
      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(PROFILE_PHOTOS_BUCKET)
        .getPublicUrl(filePath);
      
      console.log('URL pública gerada:', publicUrl);
      
      // Atualizar a tabela 'usuarios' em vez de tentar acessar auth.users diretamente
      const { error: updateError } = await supabase
        .from('usuarios')  // Use a tabela correta
        .update({ foto_perfil_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Erro na atualização:', updateError);
        throw new Error(`Erro ao atualizar perfil: ${updateError.message}`);
      }
      
      // Forçar atualização para recarregar a UI
      window.dispatchEvent(new Event('storage'));
      
      toast({
        title: 'Sucesso!',
        description: 'Foto de perfil atualizada com sucesso',
      });
      
      return publicUrl;
    } catch (error: any) {
      console.error('Erro na atualização do perfil:', error);
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
