
import { supabase } from '@/integrations/supabase/client';

export const setupProfilePhotosStorage = async () => {
  try {
    // Verifica se o bucket 'usuarios' existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Erro ao listar buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'usuarios');
    
    if (!bucketExists) {
      console.log('Criando bucket usuarios...');
      const { error: createError } = await supabase.storage.createBucket('usuarios', {
        public: true
      });
      
      if (createError) {
        console.error('Erro ao criar bucket:', createError);
        return false;
      }
      
      console.log('Bucket criado com sucesso');

      // Atualiza as políticas do bucket para torná-lo público
      const { error: updateError } = await supabase.storage.updateBucket('usuarios', {
        public: true
      });
      
      if (updateError) {
        console.error('Erro ao atualizar políticas do bucket:', updateError);
        return false;
      }
      
      console.log('Políticas do bucket atualizadas com sucesso');
    } else {
      console.log('Bucket usuarios já existe');
      
      // Garante que o bucket seja público mesmo que já exista
      const { error: updateError } = await supabase.storage.updateBucket('usuarios', {
        public: true
      });
      
      if (updateError) {
        console.error('Erro ao atualizar políticas do bucket:', updateError);
      } else {
        console.log('Políticas do bucket atualizadas com sucesso');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao configurar armazenamento de fotos de perfil:', error);
    return false;
  }
};
