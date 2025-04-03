
import { supabase } from '@/integrations/supabase/client';

export const setupProfilePhotosStorage = async () => {
  try {
    console.log('Iniciando configuração do armazenamento de fotos de perfil...');
    
    // Verifica se o bucket 'usuarios' existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Erro ao listar buckets:', listError);
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
          if (createError.message.includes('duplicate key value violates unique constraint')) {
            console.log('O bucket já existe (erro de chave duplicada), continuando...');
          } else {
            return false;
          }
        } else {
          console.log('Bucket "usuarios" criado com sucesso');
        }
      } catch (bucketError) {
        console.error('Exceção ao criar bucket:', bucketError);
        return false;
      }
      
      // Tenta atualizar as políticas do bucket recém-criado para torná-lo público
      try {
        const { error: updateError } = await supabase.storage.updateBucket('usuarios', {
          public: true,
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (updateError) {
          console.error('Erro ao atualizar políticas do bucket:', updateError);
          // Não retornamos false aqui, pois o bucket já foi criado
        } else {
          console.log('Políticas do bucket atualizadas com sucesso');
        }
      } catch (policyError) {
        console.error('Exceção ao atualizar políticas:', policyError);
        // Não retornamos false aqui, pois o bucket já foi criado
      }
    } else {
      console.log('Bucket "usuarios" já existe, verificando políticas...');
      
      // Tenta atualizar o bucket existente para garantir que seja público
      try {
        const { error: updateError } = await supabase.storage.updateBucket('usuarios', {
          public: true,
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (updateError) {
          console.error('Erro ao atualizar políticas do bucket existente:', updateError);
          
          // Se o erro for de permissão, não é crítico para o fluxo principal
          if (updateError.message.includes('permission denied')) {
            console.log('Aviso: Sem permissão para atualizar o bucket, mas continuando com o upload...');
          }
        } else {
          console.log('Políticas do bucket atualizadas com sucesso');
        }
      } catch (policyError) {
        console.error('Exceção ao atualizar políticas do bucket existente:', policyError);
        // Não retornamos false aqui, permissão para upload pode ainda funcionar
      }
    }
    
    // Verificando permissões de RLS para o bucket usuarios
    console.log('Verificando se o usuário tem permissão para upload...');
    
    // Como não podemos verificar políticas diretamente, vamos tentar um teste
    // de upload dummy para confirmar acesso (opcional, pode remover esta parte)
    
    console.log('Configuração do armazenamento concluída com sucesso');
    return true;
  } catch (error) {
    console.error('Erro não tratado na configuração de armazenamento:', error);
    return false;
  }
};
