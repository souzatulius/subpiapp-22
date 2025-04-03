
import { supabase } from '@/integrations/supabase/client';

export const setupProfilePhotosStorage = async () => {
  try {
    console.log('Iniciando configuração do armazenamento de fotos de perfil...');
    
    // Verifica se o bucket 'usuarios' existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Erro ao listar buckets:', listError);
      
      // Se o erro for de permissão, vamos tentar prosseguir assumindo que o bucket possa existir
      if (listError.message.includes('permission denied')) {
        console.log('Permissão negada ao listar buckets, tentando prosseguir mesmo assim...');
        return true; // Retornamos true para tentar o upload mesmo sem conseguir verificar o bucket
      }
      
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'usuarios');
    
    if (!bucketExists) {
      console.log('Bucket "usuarios" não encontrado. Criando...');
      
      try {
        const { error: createError } = await supabase.storage.createBucket('usuarios', {
          public: true,
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (createError) {
          console.error('Erro ao criar bucket "usuarios":', createError);
          
          // Se o erro for de chave duplicada, significa que o bucket já existe
          if (createError.message.includes('duplicate key value violates unique constraint')) {
            console.log('O bucket já existe (erro de chave duplicada), continuando...');
            return true;
          }
          
          // Se o erro for de permissão, vamos tentar prosseguir mesmo assim
          if (createError.message.includes('permission denied')) {
            console.log('Permissão negada ao criar bucket, tentando prosseguir mesmo assim...');
            return true; // Retornamos true para tentar o upload mesmo sem conseguir criar o bucket
          }
          
          return false;
        } else {
          console.log('Bucket "usuarios" criado com sucesso');
        }
      } catch (bucketError) {
        console.error('Exceção ao criar bucket:', bucketError);
        return false;
      }
    } else {
      console.log('Bucket "usuarios" já existe, verificando políticas...');
    }
    
    // Tenta atualizar o bucket para garantir que seja público, mas não falha se não tiver permissão
    try {
      const { error: updateError } = await supabase.storage.updateBucket('usuarios', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (updateError) {
        console.error('Erro ao atualizar políticas do bucket:', updateError);
        
        // Se o erro for de permissão, não é crítico para o fluxo principal
        if (updateError.message.includes('permission denied')) {
          console.log('Aviso: Sem permissão para atualizar o bucket, mas continuando com o upload...');
        }
      } else {
        console.log('Políticas do bucket atualizadas com sucesso');
      }
    } catch (policyError) {
      console.error('Exceção ao atualizar políticas:', policyError);
      // Não retornamos false aqui, permissão para upload pode ainda funcionar
    }
    
    console.log('Configuração do armazenamento concluída com sucesso');
    return true;
  } catch (error) {
    console.error('Erro não tratado na configuração de armazenamento:', error);
    return false;
  }
};
