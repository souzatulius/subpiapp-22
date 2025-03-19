
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';

export const mediaTypeSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
});

export type MediaType = {
  id: string;
  descricao: string;
  criado_em: string;
};

export function useMediaTypes() {
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMediaTypes();
  }, []);

  const fetchMediaTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tipos_midia')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      setMediaTypes(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar tipos de mídia:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os tipos de mídia',
        variant: 'destructive',
      });
      setMediaTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const addMediaType = async (data: { descricao: string }) => {
    setIsSubmitting(true);
    try {
      console.log('Adicionando tipo de mídia:', data);
      
      const { data: newId, error } = await supabase.rpc('insert_tipo_midia', {
        p_descricao: data.descricao
      });
      
      if (error) throw error;
      
      console.log('Tipo de mídia adicionado com sucesso:', newId);
      
      toast({
        title: 'Sucesso',
        description: 'Tipo de mídia adicionado com sucesso',
      });
      
      await fetchMediaTypes();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar tipo de mídia:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar o tipo de mídia',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateMediaType = async (id: string, data: { descricao: string }) => {
    setIsSubmitting(true);
    try {
      console.log('Atualizando tipo de mídia:', id, data);
      
      const { data: result, error } = await supabase.rpc('update_tipo_midia', {
        p_id: id,
        p_descricao: data.descricao
      });
      
      if (error) throw error;
      
      console.log('Tipo de mídia atualizado com sucesso:', result);
      
      toast({
        title: 'Sucesso',
        description: 'Tipo de mídia atualizado com sucesso',
      });
      
      await fetchMediaTypes();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao editar tipo de mídia:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o tipo de mídia',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMediaType = async (mediaType: MediaType) => {
    try {
      console.log('Excluindo tipo de mídia:', mediaType.id);
      
      // Verificar se há registros dependentes
      const { count, error: countError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .eq('tipo_midia_id', mediaType.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem demandas associadas a este tipo de mídia',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase.rpc('delete_tipo_midia', {
        p_id: mediaType.id
      });
      
      if (error) throw error;
      
      toast({
        title: 'Tipo de mídia excluído',
        description: 'O tipo de mídia foi excluído com sucesso',
      });
      
      await fetchMediaTypes();
    } catch (error: any) {
      console.error('Erro ao excluir tipo de mídia:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o tipo de mídia',
        variant: 'destructive',
      });
    }
  };

  return {
    mediaTypes,
    loading,
    isSubmitting,
    addMediaType,
    updateMediaType,
    deleteMediaType
  };
}
