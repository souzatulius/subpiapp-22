
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { demandOriginSchema } from '@/components/settings/demand-origins/DemandOriginForm';

export type DemandOrigin = {
  id: string;
  descricao: string;
  criado_em: string;
};

export function useDemandOrigins() {
  const [origins, setOrigins] = useState<DemandOrigin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrigins();
  }, []);

  const fetchOrigins = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('origens_demandas')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      setOrigins(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar origens de demandas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as origens de demandas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addDemandOrigin = async (data: { descricao: string }) => {
    setIsSubmitting(true);
    try {
      console.log('Adicionando origem de demanda:', data);
      
      const { data: result, error } = await supabase.rpc('insert_origem_demanda', {
        p_descricao: data.descricao
      } as any);
      
      if (error) throw error;
      
      console.log('Origem de demanda adicionada com sucesso:', result);
      
      toast({
        title: 'Sucesso',
        description: 'Origem de demanda adicionada com sucesso',
      });
      
      await fetchOrigins();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar origem de demanda:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar a origem de demanda',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDemandOrigin = async (id: string, data: { descricao: string }) => {
    setIsSubmitting(true);
    try {
      console.log('Editando origem de demanda:', id, data);
      
      const { data: result, error } = await supabase.rpc('update_origem_demanda', {
        p_id: id,
        p_descricao: data.descricao
      } as any);
      
      if (error) throw error;
      
      console.log('Origem de demanda atualizada com sucesso:', result);
      
      toast({
        title: 'Sucesso',
        description: 'Origem de demanda atualizada com sucesso',
      });
      
      await fetchOrigins();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao editar origem de demanda:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar a origem de demanda',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteDemandOrigin = async (origin: DemandOrigin) => {
    try {
      // Check if there are dependent records
      const { count, error: countError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .eq('origem_id', origin.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem demandas associadas a esta origem',
          variant: 'destructive',
        });
        return;
      }
      
      console.log('Excluindo origem de demanda:', origin.id);
      
      const { error } = await supabase.rpc('delete_origem_demanda', {
        p_id: origin.id
      } as any);
      
      if (error) throw error;
      
      toast({
        title: 'Origem de demanda excluída',
        description: 'A origem de demanda foi excluída com sucesso',
      });
      
      await fetchOrigins();
    } catch (error: any) {
      console.error('Erro ao excluir origem de demanda:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir a origem de demanda',
        variant: 'destructive',
      });
    }
  };

  return {
    origins,
    loading,
    isSubmitting,
    addDemandOrigin,
    updateDemandOrigin,
    deleteDemandOrigin
  };
}
