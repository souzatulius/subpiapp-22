
import { supabase } from '@/integrations/supabase/client';

export const setupProfilePhotosStorage = async () => {
  try {
    console.log('Verificando configuração de armazenamento para fotos de perfil...');
    
    // Testar acesso ao bucket com uma operação mínima
    try {
      // Testamos apenas se conseguimos listar arquivos no bucket
      const { data: objects, error } = await supabase.storage
        .from('usuarios')
        .list('fotos_perfil', {
          limit: 1,
        });
      
      if (error) {
        console.warn('Não foi possível listar objetos no bucket:', error.message);
        // Verificamos se o erro é relacionado a permissões
        if (error.message.includes('permission denied')) {
          throw new Error('Erro de permissão ao acessar o armazenamento. Verifique as políticas de segurança.');
        }
      }
      
      console.log('Verificação de acesso ao armazenamento concluída');
      return true;
    } catch (error) {
      console.error('Erro ao verificar a configuração de armazenamento:', error);
      throw new Error('Não foi possível configurar o armazenamento de fotos. Verifique se o bucket "usuarios" existe e se você tem permissões para acessá-lo.');
    }
  } catch (error) {
    console.error('Erro inesperado em setupProfilePhotosStorage:', error);
    throw error;
  }
};
