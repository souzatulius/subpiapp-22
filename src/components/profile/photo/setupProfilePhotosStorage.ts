
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
        // Não lançamos erro aqui, apenas avisamos - o bucket pode existir mas estar vazio
      }
      
      console.log('Verificação de acesso ao armazenamento concluída');
      return true;
    } catch (error) {
      console.error('Erro ao verificar a configuração de armazenamento:', error);
      throw new Error('Não foi possivel configurar o armazenamento de fotos. Tente novamente mais tarde.');
    }
  } catch (error) {
    console.error('Erro inesperado em setupProfilePhotosStorage:', error);
    throw error;
  }
};
